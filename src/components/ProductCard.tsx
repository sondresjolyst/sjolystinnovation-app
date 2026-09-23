import Image from 'next/image';
import type { Product } from '@/lib/products';

export default function ProductCard({ product }: { product: Product }) {
    return (
        <li className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-background">
            {/* Each photo keeps its own aspect ratio; a shared one crops the upright shots. */}
            <Image
                src={product.image}
                alt={product.alt}
                width={product.width}
                height={product.height}
                sizes="(min-width: 640px) 50vw, 100vw"
                className="h-auto w-full bg-surface"
            />

            <h3 className="p-6 text-xl font-semibold tracking-tight">{product.name}</h3>
        </li>
    );
}
