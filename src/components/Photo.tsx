import { PHOTO_EDGES, PHOTO_MAX_EDGE, photoFile } from '@/lib/photos';

interface PhotoProps {
    /** Path without the width suffix or extension, such as `/products/elgitar`. */
    src: string;
    alt: string;
    /** Size of the largest variant, so the layout reserves the right space before it loads. */
    width: number;
    height: number;
    /** Rendered width at each breakpoint, for the browser to pick a variant from. */
    sizes: string;
    className?: string;
}

/**
 * A photo served from the files prepared at author time. AVIF first, JPEG for anything that
 * cannot read it, each at every prepared width so a phone does not download the desktop file.
 */
export default function Photo({ src, alt, width, height, sizes, className }: PhotoProps) {
    const set = (extension: string) =>
        PHOTO_EDGES
            .map((edge) => {
                const variant = photoFile(src, edge, extension);
                return `${variant} ${Math.round((width * edge) / PHOTO_MAX_EDGE)}w`;
            })
            .join(', ');

    return (
        <picture>
            <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
            <img
                src={photoFile(src, PHOTO_MAX_EDGE, 'jpg')}
                srcSet={set('jpg')}
                sizes={sizes}
                alt={alt}
                width={width}
                height={height}
                loading="lazy"
                decoding="async"
                className={className}
            />
        </picture>
    );
}
