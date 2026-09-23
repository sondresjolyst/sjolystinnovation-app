import Section from './Section';
import ContactForm from './ContactForm';
import { COMPANY } from '@/lib/company';

export default function Contact() {
    return (
        <Section
            id="kontakt"
            title="Har du noe du vil ha bygget?"
            intro="Fortell kort hva du trenger, så svarer vi med hva det vil kreve, og hva det vil koste."
        >
            <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
                <div className="space-y-6 text-sm">
                    <div>
                        <p className="font-medium">{COMPANY.legalName}</p>
                        {COMPANY.address && <p className="mt-1 text-muted">{COMPANY.address}</p>}
                    </div>

                    {COMPANY.email && (
                        <div>
                            <p className="font-medium">E-post</p>
                            <a
                                href={`mailto:${COMPANY.email}`}
                                className="mt-1 block text-muted underline underline-offset-4 hover:text-foreground"
                            >
                                {COMPANY.email}
                            </a>
                        </div>
                    )}

                    {COMPANY.phone && (
                        <div>
                            <p className="font-medium">Telefon</p>
                            <a
                                href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                                className="mt-1 block text-muted underline underline-offset-4 hover:text-foreground"
                            >
                                {COMPANY.phone}
                            </a>
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-line bg-background p-6 sm:p-8">
                    <ContactForm />
                </div>
            </div>
        </Section>
    );
}
