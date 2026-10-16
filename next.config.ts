import { defineAppConfig } from '@sjolystinnovation/app-kit/next-config';

export default defineAppConfig({
    apiUrl: undefined,
    dev: process.env.NODE_ENV !== 'production',
    // Files under public/ are served with no max-age, so every repeat view revalidates each photo.
    // They are content that changes only when a photo is replaced.
    pathHeaders: [{
        source: '/:path*.(avif|jpg|png|svg|ico|webp)',
        headers: [
            { key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' },
        ],
    }],
}, {
    // scripts/prepare-images.mjs already resizes every photo to its display size and encodes it
    // as mozjpeg, so the runtime optimizer would re-encode work that is already done. Serving the
    // files as they are also keeps the root filesystem read-only, since the optimizer's only
    // cache is on disk.
    images: {
        unoptimized: true,
    },
});
