import { COMPANY } from '@/lib/company';

export default function Hero() {
    return (
        <section className="border-b border-line bg-foreground text-background">
            <div className="mx-auto max-w-5xl px-5 py-24 sm:py-32">
                <h1 className="max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
                    {COMPANY.tagline}.
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-background/75 text-pretty sm:text-xl">
                    Vi bygger nettsteder, apper og elektronikk, og lager produkter i tre og metall.
                </p>

                <div className="mt-10 flex flex-wrap gap-3">
                    <a
                        href="#prosjekter"
                        className="rounded-xl bg-background px-5 py-3 text-sm font-medium text-foreground transition-opacity hover:opacity-85"
                    >
                        Se hva vi har laget
                    </a>
                    <a
                        href="#kontakt"
                        className="rounded-xl border border-background/25 px-5 py-3 text-sm font-medium transition-colors hover:bg-background/10"
                    >
                        Ta kontakt
                    </a>
                </div>
            </div>
        </section>
    );
}
