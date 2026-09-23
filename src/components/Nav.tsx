import Link from 'next/link';
import { COMPANY } from '@/lib/company';

export default function Nav() {
    return (
        <header className="sticky top-0 z-40 border-b border-line/80 bg-background/85 backdrop-blur">
            <nav className="mx-auto flex h-16 max-w-5xl items-center px-5">
                <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="" className="h-7 w-auto" />
                    <span>{COMPANY.name}</span>
                </Link>
            </nav>
        </header>
    );
}
