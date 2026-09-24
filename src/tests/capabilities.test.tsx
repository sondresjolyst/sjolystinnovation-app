import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Capabilities from '@/components/Capabilities';
import { CAPABILITIES } from '@/lib/capabilities';
import { PROJECTS } from '@/lib/projects';

describe('capabilities', () => {
    it('only claim areas backed by a project or a section', () => {
        const slugs = new Set(PROJECTS.map(project => project.slug));

        for (const capability of CAPABILITIES) {
            expect(capability.projects.length > 0 || capability.section !== undefined).toBe(true);
            for (const slug of capability.projects) {
                expect(slugs.has(slug), `${capability.slug} points to unknown project ${slug}`).toBe(true);
            }
        }
    });

    it('link each proof to its project card or section', () => {
        render(<Capabilities />);

        const hrefs = screen.getAllByRole('link').map(link => link.getAttribute('href'));
        const expected = CAPABILITIES.flatMap(capability => [
            ...capability.projects.map(slug => `#prosjekt-${slug}`),
            ...(capability.section ? [capability.section.href] : []),
        ]);

        expect(hrefs).toEqual(expected);
    });
});
