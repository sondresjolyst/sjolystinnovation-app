import Photo from '@/components/Photo';
import type { Product } from '@/lib/products';

/** A bare photo with a caption. The photo is the content, so it gets no box around it. */
export default function ProductCard({ product }: { product: Product }) {
    return (
        <li>
            <figure>
                {/* Each photo keeps its own aspect ratio; a shared one crops the upright shots. */}
                <Photo
                    src={product.image}
                    alt={product.alt}
                    width={product.width}
                    height={product.height}
                    sizes="(min-width: 1024px) 492px, (min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full rounded-2xl bg-surface"
                />
                <figcaption className="mt-3 text-base font-medium tracking-tight">{product.name}</figcaption>
            </figure>
        </li>
    );
}
