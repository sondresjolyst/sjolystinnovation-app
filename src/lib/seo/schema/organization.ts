import { COMPANY, type Company } from '@/lib/company';
import { absoluteUrl } from '../urls';
import { ref, SCHEMA_IDS, type SchemaNode } from './graph';

/** The address as separate fields, which is the form a local listing is matched on. */
function postalAddress(company: Company) {
    return {
        '@type': 'PostalAddress',
        streetAddress: company.streetAddress,
        postalCode: company.postalCode,
        addressLocality: company.addressLocality,
        addressRegion: company.addressRegion,
        addressCountry: 'NO',
    };
}

/**
 * The business itself, under a stable `@id` that page-scoped nodes point at. Both an
 * `Organization` and a `LocalBusiness`: the workshop has an address, the services do not.
 */
export function organizationNode(company: Company): SchemaNode {
    return {
        '@type': ['Organization', 'LocalBusiness'],
        '@id': SCHEMA_IDS.organization,
        name: company.name,
        ...(company.legalName !== company.name ? { legalName: company.legalName } : {}),
        url: absoluteUrl(),
        image: absoluteUrl('/icon.png'),
        logo: absoluteUrl('/logo.png'),
        ...(company.phone ? { telephone: company.phone } : {}),
        email: company.email,
        address: postalAddress(company),
        areaServed: 'NO',
        // The register entry is the same legal entity, which is what `sameAs` states.
        sameAs: [company.brregUrl],
        ...(company.vatRegistered
            ? { vatID: `NO${company.orgNumber.replace(/\s/g, '')}MVA` }
            : {}),
        taxID: company.orgNumber,
    };
}

/** The site as an entity, so search engines can attribute pages to it and to the business. */
export function webSiteNode(): SchemaNode {
    return {
        '@type': 'WebSite',
        '@id': SCHEMA_IDS.website,
        url: absoluteUrl(),
        name: COMPANY.name,
        inLanguage: 'nb-NO',
        publisher: ref(SCHEMA_IDS.organization),
    };
}
