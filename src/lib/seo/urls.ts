import { COMPANY } from '@/lib/company';

/** Leading-slashed, never trailing-slashed. `''` and `'/'` both mean the front page. */
export function normalizePath(path: string): string {
    if (path === '' || path === '/') return '';
    const withSlash = path.startsWith('/') ? path : `/${path}`;
    return withSlash.endsWith('/') ? withSlash.slice(0, -1) : withSlash;
}

/** Absolute URL on the canonical host, for consumers that cannot resolve a relative one. */
export function absoluteUrl(path = ''): string {
    return new URL(normalizePath(path) || '/', COMPANY.url).toString().replace(/\/$/, '') || COMPANY.url;
}
