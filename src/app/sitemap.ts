import { site } from '@/lib/seo/site';

export default function sitemap() {
    // Section anchors are not separate URLs.
    return site.localeEntries('');
}
