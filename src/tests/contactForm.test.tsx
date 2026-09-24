import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '@/components/ContactForm';
import { COMPANY } from '@/lib/company';

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

function response(body: unknown, ok = true) {
    return { ok, json: async () => body } as Response;
}

async function fillAndSubmit() {
    const user = userEvent.setup();
    await user.type(screen.getByLabelText('Navn'), 'Kari');
    await user.type(screen.getByLabelText('E-post'), 'kari@example.no');
    await user.type(screen.getByLabelText(/Hva kan vi hjelpe med/), 'En nettside.');
    await user.click(screen.getByRole('button', { name: 'Send melding' }));
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe('ContactForm', () => {
    it('describes the message field with the helper text', () => {
        render(<ContactForm />);

        expect(screen.getByLabelText(/Hva kan vi hjelpe med/)).toHaveAccessibleDescription(
            'Hva skal lages, hvem skal bruke det, og når trenger du det?',
        );
    });

    it('shows the server confirmation in the status region', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            response({ message: 'Meldingen er sendt. Vi svarer på e-post.' }),
        );
        render(<ContactForm />);

        await fillAndSubmit();

        expect(await screen.findByRole('status')).toHaveTextContent('Meldingen er sendt. Vi svarer på e-post.');
        expect(screen.getByLabelText('Navn')).toHaveValue('');
    });

    it('shows the server error with a mail fallback', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            response({ error: 'For mange forsøk. Prøv igjen om en stund.' }, false),
        );
        render(<ContactForm />);

        await fillAndSubmit();

        const status = await screen.findByRole('status');
        expect(status).toHaveTextContent('For mange forsøk. Prøv igjen om en stund.');
        expect(status).toHaveTextContent(`send e-post til ${COMPANY.email}`);
        expect(screen.getByRole('link', { name: COMPANY.email })).toHaveAttribute('href', `mailto:${COMPANY.email}`);
        expect(screen.getByLabelText('Navn')).toHaveValue('Kari');
    });

    it('disables the button while sending', async () => {
        let resolve: (value: Response) => void = () => {};
        vi.spyOn(globalThis, 'fetch').mockReturnValue(new Promise<Response>(r => (resolve = r)));
        render(<ContactForm />);

        await fillAndSubmit();

        const button = screen.getByRole('button', { name: 'Sender …' });
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('aria-busy', 'true');

        resolve(response({ message: 'ok' }));
        expect(await screen.findByRole('button', { name: 'Send melding' })).toBeEnabled();
    });
});
