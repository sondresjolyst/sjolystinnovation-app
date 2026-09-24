import Image from 'next/image';
import Link from 'next/link';
import { COMPANY } from '@/lib/company';
import { NAV_LINKS } from '@/lib/navigation';

export default function Nav() {
    return (
        <header className="sticky top-0 z-40 border-b border-line/80 bg-background/85 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5">
                <Link href="/" className="flex shrink-0 items-center gap-3 font-semibold tracking-tight">
                    <Image src="/logo.png" alt="" width={128} height={256} priority className="h-7 w-auto" />
                    {/* Hidden on narrow screens so the logo and four links share one row. */}
                    <span className="sr-only sm:not-sr-only">{COMPANY.name}</span>
                </Link>

                <nav aria-label="Hovedmeny">
                    <ul role="list" className="flex items-center gap-4 text-sm font-medium sm:gap-6">
                        {NAV_LINKS.map(link => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="whitespace-nowrap text-foreground/80 decoration-primary decoration-2 underline-offset-8 transition-colors hover:text-foreground hover:underline"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </header>
    );
}
