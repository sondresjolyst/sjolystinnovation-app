import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { NAV_LINKS } from '@/lib/navigation';

const HREFS = ['#prosjekter', '#produkter', '#om-oss', '#kontakt'];

describe('section navigation', () => {
    it('lists every section anchor in the header', () => {
        render(<Nav />);

        const nav = screen.getByRole('navigation', { name: 'Hovedmeny' });
        const hrefs = within(nav)
            .getAllByRole('link')
            .map(link => link.getAttribute('href'));

        expect(hrefs).toEqual(HREFS);
        expect(screen.getByText('Sjølyst Innovation')).toBeInTheDocument();
    });

    it('repeats the same anchors in the footer', () => {
        render(<Footer />);

        const nav = screen.getByRole('navigation', { name: 'Snarveier' });
        const hrefs = within(nav)
            .getAllByRole('link')
            .map(link => link.getAttribute('href'));

        expect(hrefs).toEqual(NAV_LINKS.map(link => link.href));
    });
});
