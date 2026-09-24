import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchLogo } from '@/lib/branding';
import type { Project } from '@/lib/projects';

const withApi: Project = {
    slug: 'test',
    name: 'Test',
    tagline: '',
    description: '',
    url: 'https://example.no',
    linkText: 'example.no',
    status: 'live',
    accent: '#000000',
    fallbackLogo: '/projects/test.png',
    brandingApi: 'https://api.example.no/api/branding',
};

const withoutApi: Project = { ...withApi, brandingApi: undefined };

function response(body: unknown, ok = true, status = 200) {
    return { ok, status, json: async () => body } as Response;
}

afterEach(() => {
    vi.restoreAllMocks();
});

describe('fetchLogo', () => {
    it('does not fetch for projects without a branding endpoint', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch');

        await expect(fetchLogo(withoutApi)).resolves.toBe('/projects/test.png');
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('builds a data URI from the base64 response', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            response({ logoData: 'AAAB', logoContentType: 'image/png' }),
        );

        await expect(fetchLogo(withApi)).resolves.toBe('data:image/png;base64,AAAB');
    });

    it('falls back when the API answers with an error code', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(response({}, false, 503));

        await expect(fetchLogo(withApi)).resolves.toBe('/projects/test.png');
    });

    it('falls back when no logo has been uploaded', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            response({ logoData: null, logoContentType: null }),
        );

        await expect(fetchLogo(withApi)).resolves.toBe('/projects/test.png');
    });

    it('rejects content that is not an image', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            response({ logoData: 'PHN2Zz48L3N2Zz4=', logoContentType: 'text/html' }),
        );

        await expect(fetchLogo(withApi)).resolves.toBe('/projects/test.png');
    });

    it('falls back when the call fails or times out', async () => {
        vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('timeout'));

        await expect(fetchLogo(withApi)).resolves.toBe('/projects/test.png');
    });
});
