// @vitest-environment node
import { statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { COMPANY } from '@/lib/company';
import { BRAND } from '@/lib/seo/brand';
import {
    SHARE_IMAGE_ALT,
    SHARE_IMAGE_COLOURS,
    SHARE_IMAGE_CONTENT_TYPE,
    SHARE_IMAGE_FONTS,
    SHARE_IMAGE_SIZE,
} from '@/lib/seo/shareImage';

describe('share image', () => {
    it('is the size Open Graph consumers crop against', () => {
        expect(SHARE_IMAGE_SIZE).toEqual({ width: 1200, height: 630 });
    });

    it('is a PNG, which every consumer renders', () => {
        expect(SHARE_IMAGE_CONTENT_TYPE).toBe('image/png');
    });

    it('describes the image by the company and what it does', () => {
        expect(SHARE_IMAGE_ALT).toContain(COMPANY.name);
        expect(SHARE_IMAGE_ALT).toContain(COMPANY.tagline);
    });

    it('takes its ground from the hero band, so the card looks like the site', () => {
        expect(SHARE_IMAGE_COLOURS.background).toBe(BRAND.foreground);
    });

    it('draws no text in the background colour, which would render it invisible', () => {
        expect(SHARE_IMAGE_COLOURS.heading).not.toBe(SHARE_IMAGE_COLOURS.background);
        expect(SHARE_IMAGE_COLOURS.body).not.toBe(SHARE_IMAGE_COLOURS.background);
    });

    it('names font files that exist, so a geist upgrade fails here and not in the build', () => {
        for (const path of Object.values(SHARE_IMAGE_FONTS)) {
            expect(statSync(path).size).toBeGreaterThan(10_000);
        }
    });
});
