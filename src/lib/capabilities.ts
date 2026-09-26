export interface Capability {
    slug: string;
    title: string;
    blurb: string;
    /** Slugs from PROJECTS that show this delivered. Rendered as links to the project cards. */
    projects: readonly string[];
    /** Used when the proof is a section rather than a project card. */
    section?: { label: string; href: `#${string}` };
}

/** Only areas with delivered work behind them. Each entry points to that work. */
export const CAPABILITIES: readonly Capability[] = [
    {
        slug: 'nettsteder-og-apper',
        title: 'Nettsteder og apper',
        blurb: 'Nettsider, apper og nettbutikker, laget for det du skal bruke dem til.',
        projects: ['altinnendata', 'nstuning', 'pyttogpanne'],
    },
    {
        slug: 'elektronikk-og-automasjon',
        title: 'Elektronikk og automasjon',
        blurb: 'Sensorer og styring for hjemmet og garasjen, med apper som viser hva som skjer.',
        projects: ['garge', 'si-tyre-analyzer'],
    },
    {
        slug: 'tre-og-metall',
        title: 'Tre og metall',
        blurb: 'Bruksting, møbler og enkeltstykker, tegnet digitalt og frest med CNC.',
        projects: [],
        section: { label: 'eksemplene', href: '#produkter' },
    },
];
