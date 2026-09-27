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

    it('render each proof as its own chip, not as words inside a sentence', () => {
        render(<Capabilities />);

        const links = screen.getAllByRole('link');
        const expected = CAPABILITIES.flatMap(capability => [
            ...capability.projects.map(slug => PROJECTS.find(project => project.slug === slug)?.name),
            ...(capability.section ? [capability.section.label] : []),
        ]);

        expect(links.map(link => link.textContent)).toEqual(expected);

        // A chip owns its list item, so no connecting prose can sit next to the label.
        for (const link of links) {
            expect(link.closest('li')?.textContent).toBe(link.textContent);
        }
    });
});
