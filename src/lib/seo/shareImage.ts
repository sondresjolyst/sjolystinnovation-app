import { join } from 'node:path';
import { COMPANY } from '@/lib/company';
import { BRAND } from '@/lib/seo/brand';

/** Dimensions of the generated share image, the aspect every consumer crops against. */
export const SHARE_IMAGE_SIZE = { width: 1200, height: 630 } as const;

export const SHARE_IMAGE_CONTENT_TYPE = 'image/png';

export const SHARE_IMAGE_ALT = `${COMPANY.name} — ${COMPANY.tagline}`;

/**
 * The card is the hero band, cropped: the same dark ground and white type a visitor meets at the
 * top of the site, so the preview and the page read as one thing.
 */
export const SHARE_IMAGE_COLOURS = {
    background: BRAND.foreground,
    heading: BRAND.background,
    body: 'rgba(255,255,255,0.72)',
    faint: 'rgba(255,255,255,0.45)',
} as const;

/**
 * Geist as files rather than as `next/font`: the image renders outside the browser, where only a
 * font binary will do. Read at build time, when `node_modules` is still there.
 */
const GEIST_SANS = join(process.cwd(), 'node_modules', 'geist', 'dist', 'fonts', 'geist-sans');

export const SHARE_IMAGE_FONTS = {
    regular: join(GEIST_SANS, 'Geist-Regular.ttf'),
    semiBold: join(GEIST_SANS, 'Geist-SemiBold.ttf'),
} as const;
