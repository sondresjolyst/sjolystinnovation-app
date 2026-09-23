interface SectionProps {
    id: string;
    title: string;
    intro?: string;
    children: React.ReactNode;
    /** Tinted band, to separate neighbouring sections. */
    tinted?: boolean;
}

export default function Section({ id, title, intro, children, tinted }: SectionProps) {
    return (
        <section id={id} className={tinted ? 'border-b border-line bg-surface' : 'border-b border-line'}>
            <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
                <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                    {title}
                </h2>
                {intro && <p className="mt-4 max-w-xl text-muted text-pretty">{intro}</p>}

                <div className="mt-12">{children}</div>
            </div>
        </section>
    );
}
