export interface Company {
    /** Brand name, for headings and marketing copy. */
    name: string;
    /** Registered foretaksnavn, for the footer and any formal context. */
    legalName: string;
    /** Follows the name in the page title and the manifest. */
    tagline: string;
    /** The person a customer deals with. Shown with the portrait in the about block. */
    contactPerson: string;
    orgNumber: string;
    /** Shown next to the org number, which foretaksregisterloven § 10-2 requires of an AS. */
    register: string;
    vatRegistered: boolean;
    /** One-line address, for the footer and the contact block. */
    address: string;
    /** The address again, split into the fields a local listing is matched on. */
    streetAddress: string;
    postalCode: string;
    addressLocality: string;
    addressRegion: string;
    /** Empty fields are hidden by the footer and the contact block. */
    email: string;
    phone: string;
    url: string;
    brregUrl: string;
}

export const COMPANY: Company = {
    name: "Sjølyst Innovation",
    legalName: "Sjølyst Innovation AS",
    tagline: "Fra idé til produkt",
    contactPerson: "Sondre Sjølyst",
    orgNumber: "938 517 789",
    register: "Foretaksregisteret",
    vatRegistered: false,
    address: "Mårvegen 21A, 4347 Lye",
    streetAddress: "Mårvegen 21A",
    postalCode: "4347",
    addressLocality: "Lye",
    addressRegion: "Rogaland",
    email: "sondresjoelyst@gmail.com",
    phone: "",
    url: "https://www.sjolystinnovation.no",
    brregUrl: "https://virksomhet.brreg.no/nb/oppslag/enheter/938517789",
};
