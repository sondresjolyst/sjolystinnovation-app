/**
 * Reads the originals in assets/photos, applies EXIF rotation, crops to `ratio` where given, strips
 * metadata and writes each photo at every width in WIDTHS, as AVIF and as JPEG. The page serves
 * these files directly, so the sizes written here are the sizes the browser downloads.
 */
import { mkdir, stat } from 'node:fs/promises';
import { basename, join } from 'node:path';
import sharp from 'sharp';

const DEFAULT_OUT_DIR = 'public/products';

/** A card is at most 492 CSS px wide, so 1000 covers 2x screens and 640 covers a phone. */
const WIDTHS = [640, 1000];
const MAX_EDGE = Math.max(...WIDTHS);
const QUALITY = 78;
const AVIF_QUALITY = 55;

/**
 * Add a line per photo: the source on disk, and the name it gets in the output directory.
 * Give `ratio` to crop a photo to a shape it was not shot in, so two cards can sit side by side.
 * Give `extract` (a box in source pixels, after rotation) when the automatic crop picks the wrong
 * part of the frame; `ratio` then applies to that box.
 */
const IMAGES = [
    { source: 'assets/photos/skjaerefjol.jpg', name: 'skjaerefjol.jpg', ratio: [3, 4] },
    { source: 'assets/photos/glassbrikker.jpg', name: 'glassbrikker.jpg', ratio: [4, 3] },
    { source: 'assets/photos/primusbord.jpg', name: 'primusbord.jpg', ratio: [4, 3] },
    { source: 'assets/photos/elgitar.jpg', name: 'elgitar.jpg', ratio: [3, 4] },
    {
        source: 'assets/photos/portrait.jpg',
        name: 'portrait.jpg',
        outDir: 'public/about',
        ratio: [4, 5],
        // The subject stands centre-left; the attention crop would pick the crowd behind.
        extract: { left: 380, top: 120, width: 1900, height: 2375 },
    },
];

async function prepare({ source, name, ratio, extract, outDir = DEFAULT_OUT_DIR }) {
    await mkdir(outDir, { recursive: true });
    const { width, height } = await sharp(source).rotate().metadata();
    const before = (await stat(source)).size;
    const stem = name.replace(/\.[^.]+$/, '');

    for (const edge of WIDTHS) {
        // sharp applies one resize per pipeline, so each width is built from the source.
        let input = sharp(source).rotate();
        if (extract) input = input.extract(extract);

        const resize = ratio
            ? {
                // Keep the longest edge at `edge` whichever way round the target shape is.
                width: ratio[0] >= ratio[1] ? edge : Math.round((edge * ratio[0]) / ratio[1]),
                height: ratio[0] >= ratio[1] ? Math.round((edge * ratio[1]) / ratio[0]) : edge,
                fit: 'cover',
                // Crops around the busiest part of the frame, which is the object rather than the backdrop.
                position: sharp.strategy.attention,
            }
            : {
                width: width >= height ? edge : undefined,
                height: height > width ? edge : undefined,
                withoutEnlargement: true,
            };

        const scaled = input.resize(resize);
        const jpeg = await scaled.clone()
            .jpeg({ quality: QUALITY, mozjpeg: true })
            .toFile(join(outDir, `${stem}-${edge}.jpg`));
        const avif = await scaled.clone()
            .avif({ quality: AVIF_QUALITY })
            .toFile(join(outDir, `${stem}-${edge}.avif`));

        console.log(
            `${basename(source)} -> ${stem}-${edge}  ${jpeg.width}x${jpeg.height}  ` +
            `jpeg ${(jpeg.size / 1e3).toFixed(0)} kB, avif ${(avif.size / 1e3).toFixed(0)} kB`,
        );
    }

    console.log(`${basename(source)}  source ${width}x${height}, ${(before / 1e6).toFixed(1)} MB`);
}

if (IMAGES.length === 0) {
    console.error('No images configured. Add entries to IMAGES in this file.');
    process.exit(1);
}

const only = process.argv.slice(2);
for (const image of IMAGES) {
    if (only.length === 0 || only.includes(image.name)) await prepare(image);
}
