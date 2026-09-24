import Section from './Section';
import ProductCard from './ProductCard';
import { PRODUCTS } from '@/lib/products';

export default function Products() {
    return (
        <Section
            id="produkter"
            title="Fra skjærefjøl til elgitar."
            intro="Eksempler på hva vi lager, tegnet digitalt og frest med CNC."
            tinted
        >
            <ul role="list" className="grid gap-5 sm:grid-cols-2">
                {PRODUCTS.map(product => (
                    <ProductCard key={product.slug} product={product} />
                ))}
            </ul>
        </Section>
    );
}
