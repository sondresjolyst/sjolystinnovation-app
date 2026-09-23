'use client';

import { useState } from 'react';
import { toast } from 'sonner';

const FIELD_CLASS =
    'w-full rounded-xl border border-line bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-primary';

export default function ContactForm() {
    const [sending, setSending] = useState(false);

    async function submit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = event.currentTarget;
        const data = Object.fromEntries(new FormData(form));

        setSending(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data),
            });
            const answer = await res.json().catch(() => ({}));

            if (!res.ok) {
                toast.error(answer.error ?? 'Klarte ikke å sende meldingen.');
                return;
            }

            toast.success(answer.message ?? 'Takk! Vi tar kontakt.');
            form.reset();
        } catch {
            toast.error('Klarte ikke å sende meldingen. Sjekk nettforbindelsen.');
        } finally {
            setSending(false);
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
                        className={FIELD_CLASS}
                    />
                </label>
            </div>

            <label className="grid gap-2 text-sm">
                <span className="font-medium">
                    Telefon <span className="font-normal text-muted">(valgfritt)</span>
                </span>
                <input name="phone" maxLength={30} autoComplete="tel" className={FIELD_CLASS} />
            </label>

            <label className="grid gap-2 text-sm">
                <span className="font-medium">Hva kan vi hjelpe med?</span>
                <textarea name="message" required maxLength={4000} rows={5} className={FIELD_CLASS} />
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
                className="mt-2 justify-self-start rounded-xl bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-85 disabled:opacity-50"
            >
                {sending ? 'Sender …' : 'Send melding'}
            </button>
        </form>
    );
}
