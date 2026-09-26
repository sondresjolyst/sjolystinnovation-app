import Section from './Section';
import ContactForm from './ContactForm';

export default function Contact() {
    return (
        <Section
            id="kontakt"
            title="Har du noe du vil ha bygget?"
            intro="Fortell kort hva du trenger, så får du et prisestimat på e-post, med hva jobben krever og når vi kan starte."
            tinted
        >
            <div className="max-w-2xl">
                <ContactForm />
            </div>
        </Section>
    );
}
