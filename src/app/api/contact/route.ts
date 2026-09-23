import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/contactSchema';

// Config is read per request, so a rotated key needs a restart, not a rebuild.
export const dynamic = 'force-dynamic';

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

/** Requests allowed per IP inside the window. */
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter(t => now - t < WINDOW_MS);
    recent.push(now);
    hits.set(ip, recent);

    // The map is per-process and would otherwise grow for the life of the pod.
    if (hits.size > 5_000) {
        for (const [key, times] of hits) {
            if (times.every(t => now - t >= WINDOW_MS)) hits.delete(key);
        }
    }

    return recent.length > LIMIT;
}

function clientIp(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    return forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
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
    if (isRateLimited(clientIp(req))) {
        return NextResponse.json(
            { error: 'For mange forsøk. Prøv igjen om en stund.' },
            { status: 429 },
        );
    }

    let body: unknown;
    try {
        body = await req.json();
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

    // Honeypot: no real visitor fills this. Return success so the trap is not detectable.
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
            // Brevo's body can name the account and the key, so it stays in the log.
            console.error('Brevo responded %s: %s', res.status, await res.text());
            return NextResponse.json(
                { error: 'Klarte ikke å sende meldingen. Prøv igjen senere.' },
                { status: 502 },
            );
        }
    } catch (error) {
        console.error('Brevo request failed:', error);
        return NextResponse.json(
            { error: 'Klarte ikke å sende meldingen. Prøv igjen senere.' },
            { status: 502 },
        );
    }

    return NextResponse.json({ message: 'Takk! Vi tar kontakt.' });
}
