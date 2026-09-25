import Photo from '@/components/Photo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { COMPANY } from '@/lib/company';

/**
 * Not built on `Section`: the heading sits beside the portrait rather than above the grid, so the
 * text column is centred on the photo and the band has no empty corner.
 */
export default function About() {
    return (
        <section id="om-oss" className="border-b border-line">
            <div className="mx-auto max-w-5xl px-5 py-20 sm:py-24">
                <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:gap-16">
                    <div>
                        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Om oss.</h2>
                        <p className="mt-6 max-w-prose leading-relaxed text-muted text-pretty">
                            {COMPANY.name} er et lite firma på Lye som liker å lage ting, enten det er en nettside,
                            en sensor eller en skjærefjøl. Vi trives best når vi får være med hele veien, fra
                            første skisse til ferdig produkt.
                        </p>
                        <p className="mt-4 max-w-prose leading-relaxed text-muted text-pretty">
                            Hos oss snakker du direkte med den som gjør jobben. Kom med en idé, en ferdig tegning
                            eller noe du trenger laget, så finner vi ut av det sammen. Trenger du drift eller
                            videreutvikling etterpå, ordner vi det også.
                        </p>
                        <a
                            href="#kontakt"
                            className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-foreground"
                        >
                            Ta kontakt
                            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </a>
                    </div>

                    <figure className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
                        <Photo
                            src="/about/portrait"
                            alt={`${COMPANY.contactPerson} foran Pantheon i Roma`}
                            width={800}
                            height={1000}
                            sizes="(min-width: 1024px) 380px, (min-width: 640px) 384px, 100vw"
                            className="h-auto w-full rounded-2xl border border-line bg-surface"
                        />
                        <figcaption className="mt-3 text-sm text-muted">{COMPANY.contactPerson}</figcaption>
                    </figure>
                </div>
            </div>
        </section>
    );
}
