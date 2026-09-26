import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import ProjectCard from '@/components/ProjectCard';
import { PROJECTS } from '@/lib/projects';

describe('ProjectCard', () => {
    it('gives every card the anchor the capability links point to', () => {
        for (const project of PROJECTS) {
            const { container, unmount } = render(
                <ul>
                    <ProjectCard project={project} logo={project.fallbackLogo} />
                </ul>,
            );

            expect(container.querySelector(`#prosjekt-${project.slug}`)).not.toBeNull();
            unmount();
        }
    });

    it('bundles every fallback logo it points at', () => {
        for (const project of PROJECTS) {
            expect(existsSync(`public${project.fallbackLogo}`), project.fallbackLogo).toBe(true);
        }
    });
});
