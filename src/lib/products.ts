export interface Product {
    slug: string;
    name: string;
    alt: string;
    /** Rendered size of the photo, so the grid reserves the right space before it loads. */
    width: number;
    height: number;
}

/** Ordered so the two upright photos sit on one row and the two wide ones on the next. */
export const PRODUCTS: readonly Product[] = [
    {
        slug: 'skjaerefjol',
        name: 'Skjærefjøl i bøk',
        alt: 'Skjærefjøl i bøk med gravert logo, med kniv og oppskåret pære',
        width: 750,
        height: 1000,
    },
    {
        slug: 'elgitar',
        name: 'Elgitar i eik og bøk',
        alt: 'Elgitar med kropp og hals i lyst tre, på stativ i en stue',
        width: 750,
        height: 1000,
    },
    {
        slug: 'primusbord',
        name: 'Primusbord i Accoya',
        alt: 'Primusbord i lyst tre som ligger over en gassboks, med brenneren gjennom utsparingen',
        width: 1000,
        height: 750,
    },
    {
        slug: 'glassbrikker',
        name: 'Glassbrikke i bøk',
        alt: 'Rund glassbrikke i tre på en stein, med barnåler i bakgrunnen',
        width: 1000,
        height: 750,
    },
] as const;
