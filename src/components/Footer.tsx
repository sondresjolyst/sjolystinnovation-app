import { COMPANY } from '@/lib/company';

export default function Footer() {
    return (
        <footer className="bg-foreground text-background/70">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="font-semibold text-background">{COMPANY.legalName}</p>
                    {COMPANY.address && <p className="mt-2 text-sm">{COMPANY.address}</p>}
                    <p className="mt-1 text-sm">
                        Org.nr.{' '}
                        <a
                            href={COMPANY.brregUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline underline-offset-4 hover:text-background"
                        >
                            {COMPANY.orgNumber}
                        </a>{' '}
                        {COMPANY.register}
                    </p>
                    {COMPANY.email && (
                        <p className="mt-1 text-sm">
                            <a
                                href={`mailto:${COMPANY.email}`}
                                className="underline underline-offset-4 hover:text-background"
                            >
                                {COMPANY.email}
                            </a>
                        </p>
                    )}
                </div>

                <p className="text-sm">
                    © {new Date().getFullYear()} {COMPANY.legalName}
                </p>
            </div>
        </footer>
    );
}
