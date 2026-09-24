interface SectionProps {
    id: string;
    title: string;
    intro?: string;
    children: React.ReactNode;
    /** Tinted band, to separate neighbouring sections. */
    tinted?: boolean;
    /** Shorter band with a smaller heading, for a strip rather than a full section. */
    compact?: boolean;
}

export default function Section({ id, title, intro, children, tinted, compact }: SectionProps) {
    return (
        <section id={id} className={tinted ? 'border-b border-line bg-surface' : 'border-b border-line'}>
            <div className={compact ? 'mx-auto max-w-5xl px-5 py-12 sm:py-16' : 'mx-auto max-w-5xl px-5 py-20 sm:py-24'}>
                <h2
                    className={
                        compact
                            ? 'max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl'
                            : 'max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl'
                    }
                >
                    {title}
                </h2>
                {intro && <p className="mt-4 max-w-prose text-muted text-pretty">{intro}</p>}

                <div className={compact ? 'mt-8' : 'mt-12'}>{children}</div>
            </div>
        </section>
    );
}
