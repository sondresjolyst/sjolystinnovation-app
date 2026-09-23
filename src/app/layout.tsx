import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { COMPANY } from '@/lib/company';
import { BRAND } from '@/lib/seo/brand';
import './globals.css';

const TAGLINE = 'Fra idé til produkt';
const BESKRIVELSE =
    'Sjølyst Innovation bygger programvare og maskinvare, fra nettsteder og mobilapper til elektronikk og maskinering. Se prosjektene vi har levert.';

export const metadata: Metadata = {
    metadataBase: new URL(COMPANY.url),
    title: {
        default: `${COMPANY.name} | ${TAGLINE}`,
        template: `%s | ${COMPANY.name}`,
    },
    description: BESKRIVELSE,
    alternates: { canonical: '/' },
    openGraph: {
        type: 'website',
        siteName: COMPANY.name,
        locale: 'nb_NO',
        url: COMPANY.url,
        title: `${COMPANY.name} | ${TAGLINE}`,
        description: BESKRIVELSE,
    },
    manifest: '/manifest.json',
};

export const viewport = {
    themeColor: BRAND.background,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="no">
            <body>
                {children}
                <Toaster position="bottom-right" richColors />
            </body>
        </html>
    );
}
