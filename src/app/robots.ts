import { site } from '@/lib/seo/site';

// Read per request, so the same image can be deployed to either environment.
export const dynamic = 'force-dynamic';

export default function robots() {
    return site.robots();
}
