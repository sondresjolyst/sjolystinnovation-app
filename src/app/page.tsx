import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Projects from '@/components/Projects';
import Products from '@/components/Products';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

/** Matches the branding fetch, so the page lifetime is declared rather than inherited. */
export const revalidate = 86400;

export default function Home() {
    return (
        <>
            <Nav />
            <main>
                <Hero />
                <Projects />
                <Products />
                <Contact />
            </main>
            <Footer />
        </>
    );
}
