// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/contact/route';

const VALID = {
    name: 'Kari Nordmann',
    email: 'kari@example.no',
    phone: '',
    message: 'Hei, vi trenger en ny nettside.',
};

/** A fresh IP per test, so one test's requests never count against another's rate limit. */
let counter = 0;
function request(body: unknown) {
    counter += 1;
    return new Request('https://www.sjolystinnovation.no/api/contact', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'x-forwarded-for': `10.0.0.${counter}`,
        },
        body: JSON.stringify(body),
    });
}

beforeEach(() => {
    process.env.BREVO_API_KEY = 'test-key';
    process.env.BREVO_SENDER_EMAIL = 'ikke-svar@sjolystinnovation.no';
    process.env.BREVO_SENDER_NAME = 'Sjølyst Innovation';
    process.env.CONTACT_TO_EMAIL = 'post@sjolystinnovation.no';
    vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('POST /api/contact', () => {
    it('sender meldingen til Brevo og svarer 200', async () => {
        const fetchSpy = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue({ ok: true, status: 201, text: async () => '' } as Response);

        const res = await POST(request(VALID));

        expect(res.status).toBe(200);
        expect(fetchSpy).toHaveBeenCalledOnce();

        const [url, init] = fetchSpy.mock.calls[0];
        expect(url).toBe('https://api.brevo.com/v3/smtp/email');
        expect((init?.headers as Record<string, string>)['api-key']).toBe('test-key');

        const sent = JSON.parse(init?.body as string);
        expect(sent.to).toEqual([{ email: 'post@sjolystinnovation.no' }]);
        expect(sent.replyTo.email).toBe('kari@example.no');
    });

    it('avviser ugyldig e-postadresse uten å kontakte Brevo', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch');

        const res = await POST(request({ ...VALID, email: 'ikke-en-epost' }));

        expect(res.status).toBe(400);
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('avviser tom melding', async () => {
        const res = await POST(request({ ...VALID, message: '   ' }));
        expect(res.status).toBe(400);
    });

    it('later som alt gikk bra når honningkrukka er fylt ut, men sender ingenting', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch');

        const res = await POST(request({ ...VALID, website: 'https://spam.example' }));

        expect(res.status).toBe(200);
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('svarer 200 uansett hva honningkrukka inneholder', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch');

        // A bot that can tell these apart learns which field is the trap.
        for (const website of ['x'.repeat(5000), 42, { a: 1 }, ['x'], true]) {
            const res = await POST(request({ ...VALID, website }));
            expect(res.status).toBe(200);
        }

        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('svarer 500 uten å røpe årsaken når nøkkelen mangler', async () => {
        delete process.env.BREVO_API_KEY;
        const fetchSpy = vi.spyOn(globalThis, 'fetch');

        const res = await POST(request(VALID));
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).not.toMatch(/BREVO/i);
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('røper ikke Brevos feilmelding til klienten', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            status: 401,
            text: async () => '{"message":"Key not found: xkeysib-hemmelig"}',
        } as Response);

        const res = await POST(request(VALID));
        const body = await res.json();

        expect(res.status).toBe(502);
        expect(JSON.stringify(body)).not.toMatch(/xkeysib/);
    });

    it('stopper for mange forsøk fra samme IP', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            status: 201,
            text: async () => '',
        } as Response);

        const lagKall = () =>
            new Request('https://www.sjolystinnovation.no/api/contact', {
                method: 'POST',
                headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.9.9.9' },
                body: JSON.stringify(VALID),
            });

        for (let i = 0; i < 5; i += 1) {
            expect((await POST(lagKall())).status).toBe(200);
        }

        expect((await POST(lagKall())).status).toBe(429);
    });
});
