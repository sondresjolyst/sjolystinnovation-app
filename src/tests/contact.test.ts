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
            'x-real-ip': `10.0.0.${counter}`,
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
    it('sends the message to Brevo and answers 200', async () => {
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

    it('rejects an invalid email without contacting Brevo', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch');

        const res = await POST(request({ ...VALID, email: 'not-an-email' }));

        expect(res.status).toBe(400);
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('rejects an empty message', async () => {
        const res = await POST(request({ ...VALID, message: '   ' }));
        expect(res.status).toBe(400);
    });

    it('answers as a success when the honeypot is filled, and sends nothing', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch');

        const res = await POST(request({ ...VALID, website: 'https://spam.example' }));

        expect(res.status).toBe(200);
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('answers 200 whatever the honeypot contains', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch');

        for (const website of ['x'.repeat(5000), 42, { a: 1 }, ['x'], true]) {
            const res = await POST(request({ ...VALID, website }));
            expect(res.status).toBe(200);
        }

        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('answers 500 without naming the missing variable', async () => {
        delete process.env.BREVO_API_KEY;
        const fetchSpy = vi.spyOn(globalThis, 'fetch');

        const res = await POST(request(VALID));
        const body = await res.json();

        expect(res.status).toBe(500);
        expect(body.error).not.toMatch(/BREVO/i);
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('does not leak the Brevo error to the client', async () => {
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

    it('blocks too many attempts from one IP', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            status: 201,
            text: async () => '',
        } as Response);

        const call = () =>
            new Request('https://www.sjolystinnovation.no/api/contact', {
                method: 'POST',
                headers: { 'content-type': 'application/json', 'x-real-ip': '10.9.9.9' },
                body: JSON.stringify(VALID),
            });

        for (let i = 0; i < 5; i += 1) {
            expect((await POST(call())).status).toBe(200);
        }

        expect((await POST(call())).status).toBe(429);
    });
});

describe('POST /api/contact limits', () => {
    it('rejects a body over the limit with 413', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch');
        const huge = { ...VALID, message: 'x'.repeat(40_000) };

        const res = await POST(request(huge));

        expect(res.status).toBe(413);
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('rejects a lying content-length by counting the bytes', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch');
        counter += 1;
        const req = new Request('https://www.sjolystinnovation.no/api/contact', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'content-length': '10',
                'x-real-ip': `10.1.0.${counter}`,
            },
            body: JSON.stringify({ ...VALID, message: 'x'.repeat(40_000) }),
        });

        expect((await POST(req)).status).toBe(413);
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('rejects control characters in the name', async () => {
        const fetchSpy = vi.spyOn(globalThis, 'fetch');

        const res = await POST(request({ ...VALID, name: 'Kari\r\nBcc: alle@example.no' }));

        expect(res.status).toBe(400);
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('strips carriage returns but keeps newlines', async () => {
        const fetchSpy = vi
            .spyOn(globalThis, 'fetch')
            .mockResolvedValue({ ok: true, status: 201, text: async () => '' } as Response);

        await POST(request({ ...VALID, message: 'linje1\r\nlinje2' }));

        const sent = JSON.parse(fetchSpy.mock.calls[0][1]?.body as string);
        expect(sent.htmlContent).toContain('linje1<br/>linje2');
        expect(sent.htmlContent).not.toContain('\r');
    });

    it('does not log the Brevo response body', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: false,
            status: 401,
            text: async () => '{"message":"Key not found: xkeysib-hemmelig"}',
        } as Response);

        await POST(request(VALID));

        const logged = errorSpy.mock.calls.flat().join(' ');
        expect(logged).not.toMatch(/xkeysib/);
    });

    it('prefers x-real-ip over x-forwarded-for', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue({
            ok: true,
            status: 201,
            text: async () => '',
        } as Response);

        const forged = () =>
            new Request('https://www.sjolystinnovation.no/api/contact', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'x-real-ip': '10.7.7.7',
                    'x-forwarded-for': `1.2.3.${Math.floor(Math.random() * 250)}`,
                },
                body: JSON.stringify(VALID),
            });

        for (let i = 0; i < 5; i += 1) {
            expect((await POST(forged())).status).toBe(200);
        }

        expect((await POST(forged())).status).toBe(429);
    });
});
