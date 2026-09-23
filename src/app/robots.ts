import { MetadataRoute } from 'next';
import { COMPANY } from '@/lib/company';
import { isIndexableEnvironment } from '@/lib/seo/environment';

// Read per request, so the same image can be deployed to either environment.
export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
    if (!isIndexableEnvironment()) {
        return { rules: { userAgent: '*', disallow: '/' } };
    }

    return {
        rules: { userAgent: '*', allow: '/' },
        sitemap: `${COMPANY.url}/sitemap.xml`,
        host: COMPANY.url,
    };
}
