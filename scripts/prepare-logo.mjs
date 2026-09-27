/**
 * Writes public/logo-white.png: the ink logo with its colours inverted and its transparency kept.
 * The share card renders on the dark hero ground outside the browser, where the `invert` class the
 * footer uses has no effect. Rerun this whenever public/logo.png changes.
 */
import sharp from 'sharp';

const SOURCE = 'public/logo.png';
const OUT = 'public/logo-white.png';

const { width, height } = await sharp(SOURCE)
    .negate({ alpha: false })
    .png()
    .toFile(OUT);

console.log(`${SOURCE} -> ${OUT}  ${width}x${height}`);
