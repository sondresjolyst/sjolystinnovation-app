export default function Hero() {
    return (
        <section className="border-b border-line bg-foreground text-background">
            <div className="mx-auto max-w-5xl px-5 py-24 sm:py-32">
                <p className="text-sm font-medium tracking-widest text-background/55 uppercase">
                    Sjølyst Innovation AS
                </p>

                <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
                    Fra idé til produkt.
                </h1>

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
