export interface NavLink {
    label: string;
    href: `#${string}`;
}

/** Section anchors, shared by the header and the footer so the two lists cannot drift. */
export const NAV_LINKS: readonly NavLink[] = [
    { label: 'Prosjekter', href: '#prosjekter' },
    { label: 'Tre og metall', href: '#produkter' },
    { label: 'Om oss', href: '#om-oss' },
    { label: 'Kontakt', href: '#kontakt' },
];
