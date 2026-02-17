import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { siteUrl as constantSiteUrl } from '@/lib/constants';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = (site?.toString() || constantSiteUrl).replace(/\/$/, '');

  // Get all blog posts
  const blogPosts = await getCollection('blog', ({ data }: CollectionEntry<'blog'>) => !data.draft);

  // Get all .astro pages
  const pages = import.meta.glob('/src/pages/**/*.astro', { eager: true });

  const staticPages: string[] = [];
  for (const path of Object.keys(pages)) {
    // Convert file path to URL path
    let urlPath = path
      .replace('/src/pages', '')
      .replace(/\.astro$/, '')
      .replace(/\/index$/, '');

    // Skip API routes, 404, and dynamic routes
    if (urlPath.includes('/api/') ||
        urlPath === '/404' ||
        urlPath.includes('[') ||
        urlPath.includes(']')) {
      continue;
    }

    // Normalize path
    urlPath = urlPath || '/';
    staticPages.push(urlPath);
  }

  // Build URLs array
  const urls = [
    ...staticPages.map(page => `  <url>\n    <loc>${siteUrl}${page === '/' ? '/' : `${page}/`}</loc>\n  </url>`),
    ...blogPosts.map((post: CollectionEntry<'blog'>) => `  <url>\n    <loc>${siteUrl}/blog/${post.slug}/</loc>\n  </url>`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
