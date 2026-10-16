import { describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import RootLayout from '@/app/layout';
import { COMPANY } from '@/lib/company';
import { site } from '@/lib/seo/site';

// next/font only works inside the Next compiler.
vi.mock('geist/font/sans', () => ({ GeistSans: { variable: 'font-geist-sans' } }));

/** The JSON-LD blocks the root layout puts on every page. */
function jsonLdBlocks() {
    const html = renderToStaticMarkup(createElement(RootLayout, null, null));
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return [...doc.querySelectorAll('script[type="application/ld+json"]')].map(script => JSON.parse(script.textContent!));
}

const graph = () => jsonLdBlocks()[0]['@graph'];
const organization = () => graph().find((node: { '@id': string }) => node['@id'] === site.ids.organization);
const webSite = () => graph().find((node: { '@id': string }) => node['@id'] === site.ids.website);

describe('structured data on every page', () => {
    it('is one context-bearing graph with the organization and the web site', () => {
        const blocks = jsonLdBlocks();

        expect(blocks).toHaveLength(1);
        expect(blocks[0]['@context']).toBe('https://schema.org');
        expect(graph()).toHaveLength(2);
    });

    it('ids both nodes on the canonical host', () => {
        expect(site.ids.organization).toBe(`${COMPANY.url}/#organization`);
        expect(site.ids.website).toBe(`${COMPANY.url}/#website`);
    });
});

describe('organization node', () => {
    it('is both an organization and a local business', () => {
        expect(organization()['@type']).toEqual(['Organization', 'LocalBusiness']);
    });

    it('emits the address as separate fields, which is what a listing is matched on', () => {
        expect(organization().address).toEqual({
            '@type': 'PostalAddress',
            streetAddress: 'Mårvegen 21A',
            postalCode: '4347',
            addressLocality: 'Lye',
            addressRegion: 'Rogaland',
            addressCountry: 'NO',
        });
    });

    it('omits the telephone while the company has no number to publish', () => {
        expect(COMPANY.phone).toBe('');
        expect(organization()).not.toHaveProperty('telephone');
    });

    it('omits the VAT id while the business is not registered for VAT', () => {
        expect(COMPANY.vatRegistered).toBe(false);
        expect(organization()).not.toHaveProperty('vatID');
    });

    it('carries the org number and the legal name, which identify the entity in Norway', () => {
        expect(organization().taxID).toBe('938 517 789');
        expect(organization().legalName).toBe('Sjølyst Innovation AS');
    });

    it('points at the Brønnøysund entry, so the two describe one entity', () => {
        expect(organization().sameAs).toEqual([COMPANY.brregUrl]);
    });

    it('resolves the logo to an absolute url, which a consumer cannot resolve itself', () => {
        expect(organization().logo).toBe(`${COMPANY.url}/logo.png`);
    });
});

describe('web site node', () => {
    it('references the organization rather than repeating it', () => {
        expect(webSite().publisher).toEqual({ '@id': site.ids.organization });
    });

    it('declares the site language as Norwegian bokmål', () => {
        expect(webSite().inLanguage).toBe('nb-NO');
    });
});
