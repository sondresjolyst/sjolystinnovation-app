import { MetadataRoute } from 'next';
import { COMPANY } from '@/lib/company';

export default function sitemap(): MetadataRoute.Sitemap {
    // Section anchors are not separate URLs.
    return [
        {
            url: `${COMPANY.url}/`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 1,
        },
    ];
}
