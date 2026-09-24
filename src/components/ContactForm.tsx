'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { COMPANY } from '@/lib/company';

const FIELD_CLASS =
    'w-full rounded-xl border border-line bg-background px-4 py-3 text-sm transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none';

type Status =
    | { kind: 'idle' }
    | { kind: 'sending' }
    | { kind: 'sent'; text: string }
    | { kind: 'error'; text: string };

const SEND_FAILED = 'Klarte ikke å sende meldingen.';

export default function ContactForm() {
    const [status, setStatus] = useState<Status>({ kind: 'idle' });
    const sending = status.kind === 'sending';

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));

        setStatus({ kind: 'sending' });
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data),
            });
            const answer: { error?: unknown; message?: unknown } = await res.json().catch(() => ({}));

            if (!res.ok) {
                const text = typeof answer.error === 'string' ? answer.error : SEND_FAILED;
                toast.error(text);
                setStatus({ kind: 'error', text });
                return;
            }

            const text =
                typeof answer.message === 'string' ? answer.message : 'Meldingen er sendt. Vi svarer på e-post.';
            toast.success(text);
            setStatus({ kind: 'sent', text });
            form.reset();
        } catch {
            const text = `${SEND_FAILED} Sjekk nettforbindelsen.`;
            toast.error(text);
            setStatus({ kind: 'error', text });
        }
    }

    return (
        <form onSubmit={submit} className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm">
                    <span className="font-medium">Navn</span>
                    <input name="name" required maxLength={120} autoComplete="name" className={FIELD_CLASS} />
                </label>

                <label className="grid gap-2 text-sm">
                    <span className="font-medium">E-post</span>
                    <input
                        name="email"
                        type="email"
                        required
                        maxLength={200}
                        autoComplete="email"
                        placeholder="navn@eksempel.no"
                        className={FIELD_CLASS}
                    />
                </label>
            </div>

            <label className="grid gap-2 text-sm">
                <span className="font-medium">
                    Telefon <span className="font-normal text-muted">(valgfritt)</span>
                </span>
                <input
                    name="phone"
                    maxLength={30}
                    autoComplete="tel"
                    placeholder="+47 900 00 000"
                    className={FIELD_CLASS}
                />
            </label>

            <label className="grid gap-2 text-sm">
                <span className="font-medium">Hva kan vi hjelpe med?</span>
                <span id="melding-hjelp" className="-mt-1 text-muted">
                    Hva skal lages, hvem skal bruke det, og når trenger du det?
                </span>
                <textarea
                    name="message"
                    required
                    maxLength={4000}
                    rows={5}
                    aria-describedby="melding-hjelp"
                    className={FIELD_CLASS}
                />
            </label>

            {/* Honeypot. Mimics a real field so bots fill it. */}
            <div className="hidden" aria-hidden="true">
                <label>
                    Nettsted
                    <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
            </div>

            <button
                type="submit"
                disabled={sending}
                aria-busy={sending}
                className="mt-2 justify-self-start rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50"
            >
                {sending ? 'Sender …' : 'Send melding'}
            </button>

            {/* Always in the DOM, so the live region is registered before it gets text. */}
            <p role="status" aria-live="polite" className="min-h-6 text-sm text-muted">
                {status.kind === 'sending' && 'Sender meldingen …'}
                {status.kind === 'sent' && status.text}
                {status.kind === 'error' && (
                    <>
                        {status.text} Prøv igjen, eller send e-post til{' '}
                        <a href={`mailto:${COMPANY.email}`} className="text-foreground underline underline-offset-4">
                            {COMPANY.email}
                        </a>
                        .
                    </>
                )}
            </p>
        </form>
    );
}
