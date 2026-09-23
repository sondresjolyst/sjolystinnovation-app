import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import type { Project } from '@/lib/projects';

interface ProjectCardProps {
    project: Project;
    /** Either a `data:` URI fetched from the project's own API, or its bundled logo. */
    logo: string;
}

export default function ProjectCard({ project, logo }: ProjectCardProps) {
    return (
        <li className="group relative flex flex-col rounded-2xl border border-line bg-background p-6 transition-shadow hover:shadow-[0_1px_24px_rgba(15,17,21,0.07)]">
            <div className="h-0.5 w-10 rounded-full" style={{ backgroundColor: project.accent }} aria-hidden="true" />

            <div className="mt-6 flex items-start justify-between gap-4">
                <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-line bg-surface p-2"
                    style={{ borderColor: `${project.accent}33` }}
                >
                    {/* A base64 data URI has nothing for the image optimizer to do. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt={`${project.name} logo`} className="max-h-full max-w-full object-contain" />
                </div>

                {project.status === 'in-development' && (
                    <span className="rounded-full border border-line bg-surface px-2.5 py-1 text-xs font-medium text-muted">
                        Under utvikling
                    </span>
                )}
            </div>

            <h3 className="mt-5 text-xl font-semibold tracking-tight">{project.name}</h3>
            <p className="mt-1 text-sm font-medium text-muted">{project.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted text-pretty">{project.description}</p>

            <ul className="mt-6 flex flex-wrap gap-2">
                {project.tags.map(tag => (
                    <li key={tag} className="rounded-md bg-surface px-2 py-1 text-xs text-muted">
                        {tag}
                    </li>
                ))}
            </ul>

            <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 self-start text-sm font-medium text-foreground after:absolute after:inset-0 after:content-['']"
            >
                {project.linkText}
                <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
        </li>
    );
}
