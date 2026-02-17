import type { APIRoute } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { siteUrl as constantSiteUrl, routes } from '@/lib/constants';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = (site?.toString() || constantSiteUrl).replace(/\/$/, '');

  // Get all blog posts
  const blogPosts = await getCollection('blog', ({ data }: CollectionEntry<'blog'>) => !data.draft);

  // Get static pages from routes constant
  const staticPages = Object.values(routes).map(route =>
    route.replace(/^\/|\/$/g, '') // Remove leading/trailing slashes
  );

  // Build URLs array
  const urls = [
    ...staticPages.map(page => `  <url>\n    <loc>${siteUrl}${page ? `/${page}/` : '/'}</loc>\n  </url>`),
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
