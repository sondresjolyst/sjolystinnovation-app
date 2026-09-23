import { z } from 'zod';

/**
 * Limits mirror the enquiry validator the other sites' APIs use, so a message that would be
 * accepted there is accepted here. The messages are shown to the visitor.
 */
export const contactSchema = z.object({
    name: z.string().trim().min(1, 'Skriv navnet ditt.').max(120),
    email: z.email('Skriv en gyldig e-postadresse.').max(200),
    phone: z.string().trim().max(30).optional(),
    message: z.string().trim().min(1, 'Skriv en melding.').max(4000),
    // Honeypot. Unknown rather than a string, so it can never decide the status code.
    website: z.unknown().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
