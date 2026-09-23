import Section from './Section';
import ProjectCard from './ProjectCard';
import { PROJECTS } from '@/lib/projects';
import { fetchLogos } from '@/lib/branding';

export default async function Projects() {
    // Logos come from each project's own API where it has one, so a swap there needs no deploy.
    const logos = await fetchLogos(PROJECTS);

    return (
        <Section id="prosjekter" title="Nettsteder og apper.">
            <ul className="grid gap-5 sm:grid-cols-2">
                {PROJECTS.map(project => (
                    <ProjectCard
                        key={project.slug}
                        project={project}
                        logo={logos.get(project.slug) ?? project.fallbackLogo}
                    />
                ))}
            </ul>
        </Section>
    );
}
