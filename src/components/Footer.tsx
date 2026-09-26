import Image from 'next/image';
import { COMPANY } from '@/lib/company';
import { NAV_LINKS } from '@/lib/navigation';

const HEADING_CLASS = 'text-sm font-semibold text-background';
const LINK_CLASS = 'transition-colors hover:text-background';

export default function Footer() {
    return (
        <footer className="bg-foreground text-background/70">
            <div className="mx-auto max-w-5xl px-5 py-16">
                <div className="grid gap-10 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] sm:gap-8">
                    <div>
                        <a href="#innhold" className="inline-flex items-center gap-3 font-semibold text-background">
                            {/* Same ink logo as the header, inverted to white for the dark band. */}
                            <Image src="/logo.png" alt="" width={128} height={256} className="h-7 w-auto invert" />
                            {COMPANY.name}
                        </a>
                        <p className="mt-4 max-w-xs text-sm leading-relaxed">
                            {COMPANY.tagline}. Vi holder til på Lye.
                        </p>
                    </div>

                    <nav aria-label="Snarveier">
                        <p className={HEADING_CLASS}>Innhold</p>
                        <ul role="list" className="mt-4 grid gap-2.5 text-sm">
                            {NAV_LINKS.map(link => (
                                <li key={link.href}>
                                    <a href={link.href} className={LINK_CLASS}>
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div>
                        <p className={HEADING_CLASS}>Kontakt</p>
                        <ul role="list" className="mt-4 grid gap-2.5 text-sm">
                            {COMPANY.email && (
                                <li>
                                    <a href={`mailto:${COMPANY.email}`} className={LINK_CLASS}>
                                        {COMPANY.email}
                                    </a>
                                </li>
                            )}
                            {COMPANY.phone && (
                                <li>
                                    <a href={`tel:${COMPANY.phone.replace(/\s/g, '')}`} className={LINK_CLASS}>
                                        {COMPANY.phone}
                                    </a>
                                </li>
                            )}
                            {COMPANY.address && <li>{COMPANY.address}</li>}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-2 border-t border-background/10 pt-6 text-xs text-background/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        © {new Date().getFullYear()} {COMPANY.legalName}
                    </p>
                    <p>
                        Org.nr.{' '}
                        <a
                            href={COMPANY.brregUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-4 transition-colors hover:text-background"
                        >
                            {COMPANY.orgNumber}
                        </a>{' '}
                        {COMPANY.register}
                    </p>
                </div>
            </div>
        </footer>
    );
}
