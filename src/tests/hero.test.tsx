import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';
import { COMPANY } from '@/lib/company';
import { INTRO } from '@/lib/copy';

describe('Hero', () => {
    it('leads with the tagline, as the share card does', () => {
        render(<Hero />);
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(`${COMPANY.tagline}.`);
    });

    it('draws its intro from the shared copy, so the page and the share card cannot drift', () => {
        render(<Hero />);
        expect(screen.getByText(INTRO)).toBeInTheDocument();
    });
});
