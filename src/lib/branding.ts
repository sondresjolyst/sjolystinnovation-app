import type { Project } from './projects';

/** How long a fetched logo is reused before the page regenerates. */
const REVALIDATE_SECONDS = 86_400;

/** One slow API must not hold up a page regeneration. */
const TIMEOUT_MS = 3_000;

/** Shape of `GET /api/branding`. The images come back base64-encoded, not as URLs. */
interface BrandingResponse {
    logoData?: string | null;
    logoContentType?: string | null;
}

/**
 * The logo a project's API serves, or the bundled copy. Server-side only, so `connect-src` stays
 * `'self'`. Every failure path falls back rather than leaving a broken image.
 */
export async function fetchLogo(project: Project): Promise<string> {
    if (!project.brandingApi) return project.fallbackLogo;

    try {
        const res = await fetch(project.brandingApi, {
            next: { revalidate: REVALIDATE_SECONDS },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!res.ok) return project.fallbackLogo;

        const { logoData, logoContentType }: BrandingResponse = await res.json();
        // The API answers 200 with nulls when no logo has been uploaded.
        if (!logoData || !logoContentType?.startsWith('image/')) return project.fallbackLogo;

        return `data:${logoContentType};base64,${logoData}`;
    } catch {
        return project.fallbackLogo;
    }
}

export async function fetchLogos(projects: readonly Project[]): Promise<Map<string, string>> {
    const pairs = await Promise.all(
        projects.map(async p => [p.slug, await fetchLogo(p)] as const),
    );
    return new Map(pairs);
}
