import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { Toaster } from 'sonner';
import { COMPANY } from '@/lib/company';
import { BRAND } from '@/lib/seo/brand';
import './globals.css';

const BESKRIVELSE =
    'Sjølyst Innovation på Lye bygger nettsteder, apper og elektronikk, og lager produkter i tre og metall. Se hva vi har levert, og ta kontakt.';

export const metadata: Metadata = {
    metadataBase: new URL(COMPANY.url),
    title: {
        default: `${COMPANY.name} | ${COMPANY.tagline}`,
        template: `%s | ${COMPANY.name}`,
    },
    description: BESKRIVELSE,
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        siteName: COMPANY.name,
        locale: 'nb_NO',
        url: COMPANY.url,
        title: `${COMPANY.name} | ${COMPANY.tagline}`,
        description: BESKRIVELSE,
    },
    manifest: '/manifest.json',
};

export const viewport = {
    themeColor: BRAND.background,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="nb" className={GeistSans.variable}>
            <body>
                <a
                    href="#innhold"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium"
                >
                    Hopp til innhold
                </a>
                {children}
                <Toaster position="bottom-right" richColors />
            </body>
        </html>
    );
}
