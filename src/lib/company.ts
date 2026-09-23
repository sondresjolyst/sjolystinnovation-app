interface Company {
    /** Brand name, for headings and marketing copy. */
    name: string;
    /** Registered foretaksnavn, for the footer and any formal context. */
    legalName: string;
    orgNumber: string;
    /** Shown next to the org number, which foretaksregisterloven § 10-2 requires of an AS. */
    register: string;
    vatRegistered: boolean;
    address: string;
    /** Empty fields are hidden by the footer and the contact block. */
    email: string;
    phone: string;
    url: string;
    brregUrl: string;
}

export const COMPANY: Company = {
    name: "Sjølyst Innovation",
    legalName: "Sjølyst Innovation AS",
    orgNumber: "938 517 789",
    register: "Foretaksregisteret",
    vatRegistered: false,
    address: "Mårvegen 21A, 4347 Lye",
    email: "sondresjoelyst@gmail.com",
    phone: "",
    url: "https://www.sjolystinnovation.no",
    brregUrl: "https://virksomhet.brreg.no/nb/oppslag/enheter/938517789",
};
