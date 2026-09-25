import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Photo from '@/components/Photo';

function renderPhoto() {
    render(
        <Photo
            src="/products/elgitar"
            alt="Elgitar"
            width={750}
            height={1000}
            sizes="(min-width: 640px) 50vw, 100vw"
        />,
    );
    return screen.getByAltText('Elgitar');
}

describe('Photo', () => {
    it('offers avif before the jpeg fallback', () => {
        const source = renderPhoto().parentElement?.querySelector('source');
        expect(source?.getAttribute('type')).toBe('image/avif');
        expect(source?.getAttribute('srcset')).toBe(
            '/products/elgitar-640.avif 480w, /products/elgitar-1000.avif 750w',
        );
    });

    it('falls back to the large jpeg', () => {
        expect(renderPhoto().getAttribute('src')).toBe('/products/elgitar-1000.jpg');
    });

    it('scales the small width from the large one', () => {
        expect(renderPhoto().getAttribute('srcset')).toBe(
            '/products/elgitar-640.jpg 480w, /products/elgitar-1000.jpg 750w',
        );
    });

    it('reserves the layout with the large dimensions', () => {
        const image = renderPhoto();
        expect(image.getAttribute('width')).toBe('750');
        expect(image.getAttribute('height')).toBe('1000');
    });
});
