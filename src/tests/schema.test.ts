import { describe, expect, it } from 'vitest';
import { COMPANY, type Company } from '@/lib/company';
import { organizationNode, webSiteNode } from '@/lib/seo/schema/organization';
import { ref, SCHEMA_IDS, serializeGraph } from '@/lib/seo/schema/graph';
import { absoluteUrl } from '@/lib/seo/urls';

/** The real company, with the fields the site currently leaves empty filled in. */
const company: Company = { ...COMPANY, phone: '+47 400 00 000' };

describe('organization node', () => {
    it('is both an organization and a local business, under a stable id', () => {
        const node = organizationNode(company);

        expect(node['@id']).toBe(SCHEMA_IDS.organization);
        expect(node['@type']).toEqual(['Organization', 'LocalBusiness']);
    });

    it('emits the address as separate fields, which is what a listing is matched on', () => {
        expect(organizationNode(company).address).toEqual({
            '@type': 'PostalAddress',
            streetAddress: 'Mårvegen 21A',
            postalCode: '4347',
            addressLocality: 'Lye',
            addressRegion: 'Rogaland',
            addressCountry: 'NO',
        });
    });

    it('omits the telephone until there is a number to publish', () => {
        expect(organizationNode({ ...company, phone: '' })).not.toHaveProperty('telephone');
        expect(organizationNode(company).telephone).toBe('+47 400 00 000');
    });

    it('omits the VAT id until the business is registered for VAT', () => {
        expect(organizationNode(company)).not.toHaveProperty('vatID');
        expect(organizationNode({ ...company, vatRegistered: true }).vatID).toBe('NO938517789MVA');
    });

    it('carries the org number, which is what identifies the entity in Norway', () => {
        expect(organizationNode(company).taxID).toBe('938 517 789');
    });

    it('omits the legal name when it only repeats the trading name', () => {
        expect(organizationNode({ ...company, legalName: company.name })).not.toHaveProperty('legalName');
        expect(organizationNode(company).legalName).toBe('Sjølyst Innovation AS');
    });

    it('points at the Brønnøysund entry, so the two describe one entity', () => {
        expect(organizationNode(company).sameAs).toEqual([COMPANY.brregUrl]);
    });

    it('resolves the logo to an absolute url, which a consumer cannot resolve itself', () => {
        expect(organizationNode(company).logo).toBe(`${COMPANY.url}/logo.png`);
    });
});

describe('web site node', () => {
    it('references the organization rather than repeating it', () => {
        expect(webSiteNode().publisher).toEqual(ref(SCHEMA_IDS.organization));
    });

    it('declares the site language as Norwegian bokmål', () => {
        expect(webSiteNode().inLanguage).toBe('nb-NO');
    });
});

describe('graph serialisation', () => {
    it('escapes angle brackets so the payload cannot close the script tag', () => {
        const json = serializeGraph([{ '@type': 'Thing', name: '</script><script>alert(1)</script>' }]);

        expect(json).not.toContain('</script>');
        expect(JSON.parse(json)['@graph'][0].name).toBe('</script><script>alert(1)</script>');
    });

    it('gives the graph the schema.org context', () => {
        expect(JSON.parse(serializeGraph([]))['@context']).toBe('https://schema.org');
    });
});

describe('absolute urls', () => {
    it('returns the front page for an empty path', () => {
        expect(absoluteUrl()).toBe(COMPANY.url);
    });

    it('never ends a url in a slash, so a canonical cannot have two spellings', () => {
        expect(absoluteUrl('/produkter/')).toBe(`${COMPANY.url}/produkter`);
    });

    it('adds the leading slash a caller left out', () => {
        expect(absoluteUrl('logo.png')).toBe(`${COMPANY.url}/logo.png`);
    });
});
