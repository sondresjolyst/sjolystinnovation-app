import { z } from 'zod';

/** Matches a string with no control or formatting characters. */
const NO_CONTROL_CHARS = /^[^\p{Cc}\p{Cf}]*$/u;

/** Validates one contact form submission. The messages are shown to the visitor. */
export const contactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Skriv navnet ditt.')
        .max(120)
        .regex(NO_CONTROL_CHARS, 'Skriv navnet ditt.'),
    email: z.email('Skriv en gyldig e-postadresse.').max(200),
    phone: z.string().trim().max(30).regex(NO_CONTROL_CHARS, 'Skriv et gyldig telefonnummer.').optional(),
    message: z.string().trim().min(1, 'Skriv en melding.').max(4000).transform(v => v.replace(/\r/g, '')),
    /** Honeypot. Unknown, so it cannot fail validation. */
    website: z.unknown().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
