export type ProjectStatus = 'live' | 'in-development';

export interface Project {
    slug: string;
    name: string;
    tagline: string;
    description: string;
    url: string;
    linkText: string;
    status: ProjectStatus;
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
        tagline: 'Spill-PC-er bygget og installert lokalt',
        description:
            'Nettbutikk for ferdigbygde spill-PC-er. Du ser hvilke maskiner som er ledige og hva de koster, og kan be om tilbud på en maskin tilpasset det du skal bruke den til og budsjettet ditt.',
        url: 'https://www.altinnendata.no',
        linkText: 'altinnendata.no',
        status: 'live',
        accent: '#00887a',
        fallbackLogo: '/projects/altinnendata.png',
        brandingApi: 'https://altinnendata-api.prod.tumogroup.com/api/branding',
    },
    {
        slug: 'nstuning',
        name: 'NS Tuning',
        tagline: 'Dynotesting og motoroptimalisering',
        description:
            'Her ser du hva bilene faktisk yter. Hver dynokjøring publiseres med målt effekt og dreiemoment, og vil du teste din egen bil, booker du en kjøring rett fra siden.',
        url: 'https://www.nstuning.no',
        linkText: 'nstuning.no',
        status: 'live',
        accent: '#ffd400',
        fallbackLogo: '/projects/nstuning.png',
        brandingApi: 'https://nstuning-api.prod.tumogroup.com/api/branding',
    },
    {
        slug: 'garge',
        name: 'Garge',
        tagline: 'Følg med på garasjen fra mobilen',
        description:
            'Små sensorer måler temperatur, fukt og batterispenning, og Garge viser det live i appen. Du ser når et batteri begynner å bli dårlig, enten det sitter i bilen, båten eller bobilen, og kan styre smartplugger uten å være hjemme.',
        url: 'https://www.garge.no',
        linkText: 'garge.no',
        status: 'live',
        accent: '#0284c7',
        fallbackLogo: '/projects/garge.png',
    },
    {
        slug: 'pyttogpanne',
        name: 'Pyttogpanne',
        tagline: 'Turmat laget i én panne',
        description:
            'Oppskrifter på turmat du kan følge med brenneren i gang og uten dekning. Velg antall porsjoner, send ingrediensene til handlelisten, og lagre favorittene dine uten å lage konto.',
        url: 'https://www.instagram.com/pyttogpanne/',
        linkText: 'Følg på Instagram',
        status: 'in-development',
        accent: '#C0431C',
        fallbackLogo: '/projects/pyttogpanne.png',
    },
] as const;
