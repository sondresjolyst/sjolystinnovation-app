// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { COMPANY } from '@/lib/company';
import { BRAND } from '@/lib/seo/brand';

describe('content kept in sync', () => {
    it('manifest description matches the tagline', () => {
        const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8'));

        expect(manifest.description).toBe(`${COMPANY.tagline}.`);
        expect(manifest.name).toBe(COMPANY.name);
    });

    it('BRAND literals match the CSS tokens', () => {
        const css = readFileSync('src/app/globals.css', 'utf8');

        expect(css).toContain(`--color-background: ${BRAND.background};`);
        expect(css).toContain(`--color-foreground: ${BRAND.foreground};`);
        expect(css).toContain(`--color-primary: ${BRAND.primary};`);
    });
});
