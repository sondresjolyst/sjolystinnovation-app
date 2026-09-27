// @vitest-environment node
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';

const raw = (file: string) => sharp(file).raw().toBuffer({ resolveWithObject: true });

describe('the white logo', () => {
    it('is the same artwork as the ink logo, at the same size', async () => {
        const ink = await sharp('public/logo.png').metadata();
        const white = await sharp('public/logo-white.png').metadata();

        expect([white.width, white.height]).toEqual([ink.width, ink.height]);
    });

    it('inverts every pixel and keeps the transparency, so it can sit on the dark card', async () => {
        const ink = await raw('public/logo.png');
        const white = await raw('public/logo-white.png');
        const n = ink.info.channels;

        for (let i = 0; i < ink.data.length; i += n) {
            expect(white.data[i]).toBe(255 - ink.data[i]);
            expect(white.data[i + 1]).toBe(255 - ink.data[i + 1]);
            expect(white.data[i + 2]).toBe(255 - ink.data[i + 2]);
            if (n === 4) expect(white.data[i + 3]).toBe(ink.data[i + 3]);
        }
    });
});
