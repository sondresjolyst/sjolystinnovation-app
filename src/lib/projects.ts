export type ProjectStatus = 'live' | 'in-development';

export interface Project {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    url: string;
    linkText: string;
    status: ProjectStatus;
    tags: readonly string[];
    /** Accent used for the card's rule and logo chip. */
    accent: string;
    /** Bundled logo. Always present, and what renders when `brandingApi` is absent or down. */
    fallbackLogo: string;
    /**
     * Public `/api/branding` endpoint, where the project has one. Only altinnendata-api and
     * nstuning-api expose it. garge-api and pyttogpanne-api have no Branding feature.
     */
    brandingApi?: string;
}

export const PROJECTS: readonly Project[] = [
    {
        slug: 'altinnendata',
        name: 'Altinnendata',
        tagline: 'Lokal bygging og installasjon av stasjonære PC-er',
        description:
            'Maskinkatalog med prisforespørsel. Kunden publiserer nye maskiner selv, og oversettelsen til engelsk går automatisk.',
        url: 'https://www.altinnendata.no',
        linkText: 'altinnendata.no',
        status: 'live',
        tags: ['Nettsted', 'Produktkatalog', 'Drift'],
        accent: '#00887a',
        fallbackLogo: '/projects/altinnendata.png',
        brandingApi: 'https://altinnendata-api.prod.tumogroup.com/api/branding',
    },
    {
        slug: 'nstuning',
        name: 'NS Tuning',
        tagline: 'Dynotesting og motoroptimalisering',
        description:
            'Hver dynokjøring publiseres med måledata og nedlastbar rapport. Kunden setter sammen forsiden og innholdet selv.',
        url: 'https://www.nstuning.no',
        linkText: 'nstuning.no',
        status: 'live',
        tags: ['Nettsted', 'Innholdsstyring', 'Drift'],
        accent: '#ffd400',
        fallbackLogo: '/projects/nstuning.png',
        brandingApi: 'https://nstuning-api.prod.tumogroup.com/api/branding',
    },
    {
        slug: 'garge',
        name: 'Garge',
        tagline: 'Sensorer og styring for garasjen',
        description:
            'Sensorene måler og loggfører kontinuerlig, og automasjoner slår strømuttak av og på etter grensene du setter.',
        url: 'https://www.garge.no',
        linkText: 'garge.no',
        status: 'live',
        tags: ['Maskinvare', 'Overvåking', 'Automasjon'],
        accent: '#0284c7',
        fallbackLogo: '/projects/garge.png',
    },
    {
        slug: 'pyttogpanne',
        name: 'Pyttogpanne',
        tagline: 'Turmat laget i én panne',
        description:
            'Oppskriftene ligger lagret på telefonen og fungerer uten dekning. Handleliste og porsjonsberegning er innebygd.',
        url: 'https://www.instagram.com/pyttogpanne/',
        linkText: 'Følg på Instagram',
        status: 'in-development',
        tags: ['Mobilapp', 'iOS og Android', 'Oppskrifter'],
        accent: '#C0431C',
        fallbackLogo: '/projects/pyttogpanne.png',
    },
] as const;
