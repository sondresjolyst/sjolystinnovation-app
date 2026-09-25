import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    poweredByHeader: false,

    // scripts/prepare-images.mjs already resizes every photo to its display size and encodes it
    // as mozjpeg, so the runtime optimizer would re-encode work that is already done. Serving the
    // files as they are also keeps the root filesystem read-only, since the optimizer's only
    // cache is on disk.
    images: {
        unoptimized: true,
    },

    // Next writes revalidated pages to .next/server/app rather than to .next/cache, which the
    // read-only root filesystem does not allow. Keep the incremental cache in memory.
    experimental: { isrFlushToDisk: false },

    async headers() {
        const isDev = process.env.NODE_ENV !== 'production';
        const scriptSrc = isDev
            ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
            : "script-src 'self' 'unsafe-inline'";

        const csp = [
            "default-src 'self'",
            scriptSrc,
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data:",
            "connect-src 'self'",
            "frame-src 'self'",
            "object-src 'none'",
            "font-src 'self'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            "upgrade-insecure-requests",
        ].join('; ');

        return [
            {
                // Files under public/ are served with no max-age, so every repeat view revalidates
                // each photo. They are content that changes only when a photo is replaced.
                source: '/:path*.(avif|jpg|png|svg|ico|webp)',
                headers: [
                    { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
                ],
            },
            {
                source: '/:path*',
                headers: [
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-DNS-Prefetch-Control', value: 'on' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                    { key: 'Content-Security-Policy', value: csp },
                ],
            },
        ];
    },
};

export default nextConfig;
