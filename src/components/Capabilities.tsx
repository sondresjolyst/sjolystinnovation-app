import Section from './Section';
import { CAPABILITIES } from '@/lib/capabilities';
import { PROJECTS } from '@/lib/projects';

/* Chips, not inline links: a blue word mid-paragraph reads as an accident on a phone, and a
   wrapped sentence scatters the tap targets. `min-h-9` keeps each chip thumb-sized. */
const CHIP_CLASS =
    'inline-flex min-h-9 items-center rounded-lg border border-line bg-background px-3 text-sm ' +
    'font-medium text-muted transition-colors hover:border-foreground/30 hover:text-foreground';

export default function Capabilities() {
    return (
        <Section id="hva-vi-gjor" title="Hva vi gjør." compact tinted>
            <ul role="list" className="grid gap-8 sm:grid-cols-3">
                {CAPABILITIES.map(capability => {
                    // Project cards and the optional section link are all proof of the same claim.
                    const proofs = [
                        ...capability.projects
                            .map(slug => PROJECTS.find(project => project.slug === slug))
                            .filter(project => project !== undefined)
                            .map(project => ({ label: project.name, href: `#prosjekt-${project.slug}` })),
                        ...(capability.section ? [capability.section] : []),
                    ];

                    return (
                        <li key={capability.slug}>
                            <h3 className="font-semibold tracking-tight">{capability.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-muted text-pretty">{capability.blurb}</p>
                            <ul role="list" className="mt-4 flex flex-wrap gap-2">
                                {proofs.map(proof => (
                                    <li key={proof.href}>
                                        <a href={proof.href} className={CHIP_CLASS}>
                                            {proof.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </Section>
    );
}
