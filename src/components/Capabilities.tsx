import Section from './Section';
import { CAPABILITIES } from '@/lib/capabilities';
import { PROJECTS } from '@/lib/projects';

const LINK_CLASS = 'font-medium text-primary underline-offset-4 hover:underline';

export default function Capabilities() {
    return (
        <Section id="hva-vi-gjor" title="Hva vi gjør." compact tinted>
            <ul role="list" className="grid gap-8 sm:grid-cols-3">
                {CAPABILITIES.map(capability => {
                    // Project cards and the optional section link join into one "Se A, B og C" sentence.
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
                            <p className="mt-3 text-sm text-muted">
                                Se{' '}
                                {proofs.map((proof, index) => (
                                    <span key={proof.href}>
                                        {index > 0 && (index === proofs.length - 1 ? ' og ' : ', ')}
                                        <a href={proof.href} className={LINK_CLASS}>
                                            {proof.label}
                                        </a>
                                    </span>
                                ))}
                            </p>
                        </li>
                    );
                })}
            </ul>
        </Section>
    );
}
