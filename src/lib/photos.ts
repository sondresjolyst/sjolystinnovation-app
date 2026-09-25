/**
 * The photo variants, shared by scripts/prepare-images.mjs which writes them and by the Photo
 * component which asks for them, so the two cannot drift.
 */

/** Longest edge of each variant, smallest first. */
export const PHOTO_EDGES = [640, 1000];

/** The edge the width and height in products.ts and About.tsx describe. */
export const PHOTO_MAX_EDGE = Math.max(...PHOTO_EDGES);

/** Name of one variant, without its directory when called with a bare stem. */
export function photoFile(name: string, edge: number, extension: string): string {
    return `${name}-${edge}.${extension}`;
}
