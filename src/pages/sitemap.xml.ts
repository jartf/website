import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = (site?.toString() || 'https://jarema.me').replace(/\/$/, '');

  // Get all blog posts
  const blogPosts = await getCollection('blog', ({ data }) => !data.draft);

  // Define static pages
  const staticPages = [
    '',
    '2048',
    'about',
    'badges',
    'blog',
    'colophon',
    'contact',
    'guestbook',
    'now',
    'projects',
    'slashes',
    'tetris',
    'uses',
    'webrings',
  ];

  // Build URLs array
  const urls = [
    ...staticPages.map(page => `<url><loc>${siteUrl}${page ? `/${page}/` : '/'}</loc></url>`),
    ...blogPosts.map(post => `<url><loc>${siteUrl}/blog/${post.slug}/</loc></url>`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
