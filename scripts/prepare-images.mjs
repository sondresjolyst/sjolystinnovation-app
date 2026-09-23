/**
 * Reads the sources listed in IMAGES, applies EXIF rotation, resizes the longest edge to MAX_EDGE,
 * crops to `ratio` where given, strips metadata and writes JPEG into OUT_DIR.
 */
import { mkdir, stat } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import sharp from 'sharp';

const OUT_DIR = 'public/products';

/** Longest edge of the written image. The cards never render wider than this, even on 2x screens. */
const MAX_EDGE = 1400;
const QUALITY = 78;

/**
 * Add a line per photo: the source on disk, and the name it gets in public/products.
 * Give `ratio` to crop a photo to a shape it was not shot in, so two cards can sit side by side.
 */
const IMAGES = [
    { source: 'E:/Downloads/Photos-1-001-8/20260308_104824.jpg', name: 'skjaerefjol.jpg', ratio: [3, 4] },
    { source: 'E:/Downloads/Photos-1-001-8/PXL_20260307_142016668.jpg', name: 'glassbrikker.jpg', ratio: [4, 3] },
    { source: 'E:/Downloads/Photos-1-001-8/PXL_20260818_140209953.jpg', name: 'primusbord.jpg', ratio: [4, 3] },
    { source: 'E:/Downloads/Photos-1-001-8/PXL_20260201_132854808.jpg', name: 'elgitar.jpg', ratio: [3, 4] },
];

async function prepare({ source, name, ratio }) {
    const target = join(OUT_DIR, name);
    const input = sharp(source).rotate();
    const { width, height } = await input.metadata();

    const resize = ratio
        ? {
            // Keep the longest edge at MAX_EDGE whichever way round the target shape is.
            width: ratio[0] >= ratio[1] ? MAX_EDGE : Math.round((MAX_EDGE * ratio[0]) / ratio[1]),
            height: ratio[0] >= ratio[1] ? Math.round((MAX_EDGE * ratio[1]) / ratio[0]) : MAX_EDGE,
            fit: 'cover',
            // Crops around the busiest part of the frame, which is the object rather than the backdrop.
            position: sharp.strategy.attention,
        }
        : {
            width: width >= height ? MAX_EDGE : undefined,
            height: height > width ? MAX_EDGE : undefined,
            withoutEnlargement: true,
        };

    const output = await input
        .resize(resize)
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(target);

    const before = (await stat(source)).size;
    console.log(
        `${basename(source)} -> ${name}  ${width}x${height} to ${output.width}x${output.height}  ` +
        `${(before / 1e6).toFixed(1)} MB to ${(output.size / 1e3).toFixed(0)} kB`,
    );
}

if (IMAGES.length === 0) {
    console.error('No images configured. Add entries to IMAGES in this file.');
    process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });
for (const image of IMAGES) {
    await prepare(image);
}
