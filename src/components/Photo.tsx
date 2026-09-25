/** Widths written by scripts/prepare-images.mjs, longest edge first. */
const LARGE_EDGE = 1000;
const SMALL_EDGE = 640;

interface PhotoProps {
    /** Path without the width suffix or extension, such as `/products/elgitar`. */
    src: string;
    alt: string;
    /** Size of the large variant, so the layout reserves the right space before it loads. */
    width: number;
    height: number;
    /** Rendered width at each breakpoint, for the browser to pick a variant from. */
    sizes: string;
    className?: string;
}

/**
 * A photo served from the files prepared at author time. AVIF first, JPEG for anything that
 * cannot read it, each at two widths so a phone does not download the desktop file.
 */
export default function Photo({ src, alt, width, height, sizes, className }: PhotoProps) {
    const smallWidth = Math.round((width * SMALL_EDGE) / LARGE_EDGE);
    const set = (extension: string) =>
        `${src}-${SMALL_EDGE}.${extension} ${smallWidth}w, ${src}-${LARGE_EDGE}.${extension} ${width}w`;

    return (
        <picture>
            <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
            <img
                src={`${src}-${LARGE_EDGE}.jpg`}
                srcSet={set('jpg')}
                sizes={sizes}
                alt={alt}
                width={width}
                height={height}
                decoding="async"
                className={className}
            />
        </picture>
    );
}
