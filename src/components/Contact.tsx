import Section from './Section';
import ContactForm from './ContactForm';

export default function Contact() {
    return (
        <Section
            id="kontakt"
            title="Har du noe du vil ha bygget?"
            intro="Fortell kort hva du trenger, så svarer vi med hva det vil kreve, og hva det vil koste."
        >
            <div className="max-w-2xl rounded-2xl border border-line bg-background p-6 sm:p-8">
                <ContactForm />
            </div>
        </Section>
    );
}
