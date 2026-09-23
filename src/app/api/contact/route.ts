import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/contactSchema';

// Environment is read per request.
export const dynamic = 'force-dynamic';

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

/** Requests allowed per IP inside the window. */
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

/** Maximum callers tracked at once. The least recently seen is evicted past this. */
const MAX_TRACKED_IPS = 10_000;

/** Maximum accepted request body size. */
const MAX_BODY_BYTES = 32_768;

const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter(t => now - t < WINDOW_MS);

    // Re-insert to keep the map in least-recently-used order.
    hits.delete(ip);
    hits.set(ip, recent);

    if (recent.length >= LIMIT) return true;

    recent.push(now);

    while (hits.size > MAX_TRACKED_IPS) {
        const oldest = hits.keys().next();
        if (oldest.done) break;
        hits.delete(oldest.value);
    }

    return false;
}

/** Client address, from x-real-ip or the rightmost x-forwarded-for entry. */
function clientIp(req: Request): string {
    const realIp = req.headers.get('x-real-ip')?.trim();
    if (realIp) return realIp;

    const forwarded = req.headers.get('x-forwarded-for');
    const hops = forwarded?.split(',').map(v => v.trim()).filter(Boolean) ?? [];
    return hops.at(-1) ?? 'unknown';
}

/** True when the request carries no Origin, or one matching the host it was sent to. */
function isSameOrigin(req: Request): boolean {
    const origin = req.headers.get('origin');
    if (!origin) return true;

    try {
        const host = req.headers.get('host') ?? new URL(req.url).host;
        return new URL(origin).host === host;
    } catch {
        return false;
    }
}

/** Reads the request body, or null when it exceeds MAX_BODY_BYTES. */
async function readBody(req: Request): Promise<string | null> {
    const declared = Number(req.headers.get('content-length'));
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return null;

    const reader = req.body?.getReader();
    if (!reader) return '';

    const chunks: Uint8Array[] = [];
    let total = 0;

    for (;;) {
        const { done, value } = await reader.read();
        if (done) break;

        total += value.length;
        if (total > MAX_BODY_BYTES) {
            await reader.cancel();
            return null;
        }
        chunks.push(value);
    }

    return new TextDecoder().decode(Buffer.concat(chunks));
}

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildHtml(fields: { name: string; email: string; phone?: string; message: string }): string {
    const line = (label: string, value: string) =>
        value ? `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>` : '';

    return [
        '<h2>Ny henvendelse fra sjolystinnovation.no</h2>',
        line('Navn', fields.name),
        line('E-post', fields.email),
        line('Telefon', fields.phone ?? ''),
        '<p><strong>Melding:</strong></p>',
        `<p>${escapeHtml(fields.message).replace(/\n/g, '<br/>')}</p>`,
    ].join('');
}

export async function POST(req: Request) {
    if (!req.headers.get('content-type')?.startsWith('application/json')) {
        return NextResponse.json({ error: 'Ugyldig forespørsel.' }, { status: 415 });
    }

    if (!isSameOrigin(req)) {
        return NextResponse.json({ error: 'Ugyldig forespørsel.' }, { status: 403 });
    }

    if (isRateLimited(clientIp(req))) {
        return NextResponse.json(
            { error: 'For mange forsøk. Prøv igjen om en stund.' },
            { status: 429 },
        );
    }

    const raw = await readBody(req);
    if (raw === null) {
        return NextResponse.json({ error: 'Meldingen er for stor.' }, { status: 413 });
    }

    let body: unknown;
    try {
        body = JSON.parse(raw);
    } catch {
        return NextResponse.json({ error: 'Ugyldig forespørsel.' }, { status: 400 });
    }

    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0]?.message ?? 'Sjekk feltene og prøv igjen.' },
            { status: 400 },
        );
    }

    const { name, email, phone, message, website } = parsed.data;

    // Honeypot. Answered as a success.
    if (website) return NextResponse.json({ message: 'Takk! Vi tar kontakt.' });

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName = process.env.BREVO_SENDER_NAME ?? 'Sjølyst Innovation';
    const recipient = process.env.CONTACT_TO_EMAIL;

    if (!apiKey || !senderEmail || !recipient) {
        console.error('Contact form is not configured.');
        return NextResponse.json(
            { error: 'Skjemaet er ikke tilgjengelig akkurat nå.' },
            { status: 500 },
        );
    }

    try {
        const res = await fetch(BREVO_URL, {
            method: 'POST',
            headers: {
                'api-key': apiKey,
                'content-type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify({
                sender: { email: senderEmail, name: senderName },
                to: [{ email: recipient }],
                replyTo: { email, name },
                subject: `Ny henvendelse fra ${name}`,
                htmlContent: buildHtml({ name, email, phone, message }),
            }),
            signal: AbortSignal.timeout(10_000),
        });

        if (!res.ok) {
            console.error('Brevo responded %s', res.status);
            return NextResponse.json(
                { error: 'Klarte ikke å sende meldingen. Prøv igjen senere.' },
                { status: 502 },
            );
        }
    } catch (error) {
        console.error('Brevo request failed:', error instanceof Error ? error.message : 'unknown error');
        return NextResponse.json(
            { error: 'Klarte ikke å sende meldingen. Prøv igjen senere.' },
            { status: 502 },
        );
    }

    return NextResponse.json({ message: 'Takk! Vi tar kontakt.' });
}
