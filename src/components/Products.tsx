import Section from './Section';
import ProductCard from './ProductCard';
import { PRODUCTS } from '@/lib/products';

export default function Products() {
    return (
        <Section id="produkter" title="Tre og metall." tinted>
            <ul className="grid gap-5 sm:grid-cols-2">
                {PRODUCTS.map(product => (
                    <ProductCard key={product.slug} product={product} />
                ))}
            </ul>
        </Section>
    );
}
