import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

const { vat } = vi.hoisted(() => ({ vat: { registered: false } }));
vi.mock('@/lib/company', async importOriginal => {
    const { COMPANY } = await importOriginal<typeof import('@/lib/company')>();
    return {
        get COMPANY() {
            return { ...COMPANY, vatRegistered: vat.registered };
        },
    };
});

import Footer from '@/components/Footer';

const orgLink = () => screen.getByRole('link', { name: /^938 517 789/ });

afterEach(() => {
    vat.registered = false;
});

describe('Footer', () => {
    it('shows the bare org number while the company is not VAT registered', () => {
        render(<Footer />);
        expect(orgLink()).toHaveTextContent(/^938 517 789$/);
        expect(orgLink().parentElement).toHaveTextContent(/^Org\.nr\. 938 517 789 Foretaksregisteret$/);
    });

    it('adds MVA after the org number once the company is VAT registered', () => {
        vat.registered = true;
        render(<Footer />);
        expect(orgLink()).toHaveTextContent(/^938 517 789 MVA$/);
        expect(orgLink().parentElement).toHaveTextContent(/^Org\.nr\. 938 517 789 MVA Foretaksregisteret$/);
    });

    it('links the org number to the company in Brønnøysundregistrene', () => {
        render(<Footer />);
        expect(orgLink()).toHaveAttribute('href', 'https://virksomhet.brreg.no/nb/oppslag/enheter/938517789');
    });
});
