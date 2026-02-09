import { getCollection, type CollectionEntry } from "astro:content";
import { hrefLangLanguages, supportedLanguages, siteDescription, siteName, siteUrl, author } from "@/lib/constants";

// Helper to get language name from code
function getLanguageName(code: string): string {
  const lang = supportedLanguages.find((l) => l.code === code);
  return lang ? lang.name : code.toUpperCase();
}

export interface FeedPost {
  slug: string;
  title: string;
  excerpt: string;
  date: Date;
  tags: string[];
  language: string;
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

let allFeedPostsPromise: Promise<FeedPost[]> | null = null;

async function getAllFeedPosts(): Promise<FeedPost[]> {
  const posts = await getCollection("blog", (entry: CollectionEntry<"blog">) => !entry.data.draft);

  return posts
    .map((post: CollectionEntry<"blog">) => ({
      slug: post.slug,
      title: post.data.title,
      excerpt: post.data.excerpt ?? "",
      date: post.data.date,
      tags: post.data.tags ?? [],
      language: post.data.language ?? "en",
    }))
    .sort((a: FeedPost, b: FeedPost) => b.date.getTime() - a.date.getTime());
}

function getAllFeedPostsCached(): Promise<FeedPost[]> {
  return (allFeedPostsPromise ??= getAllFeedPosts());
}

type FeedMode = "all" | "en-only";

function postsForLanguage(allPosts: FeedPost[], language: string | undefined, mode: FeedMode): FeedPost[] {
  if (language) return allPosts.filter((p) => p.language === language);
  return mode === "en-only" ? allPosts.filter((p) => p.language === "en") : allPosts;
}

function feedTitle(language: string | undefined) {
  return language && language !== "en" ? `${siteName} - ${getLanguageName(language)}` : siteName;
}

function feedDescription(language: string | undefined) {
  return language && language !== "en" ? `${siteDescription} - ${getLanguageName(language)}` : siteDescription;
}

interface FeedOptions {
  posts: FeedPost[];
  title: string;
  description: string;
  language: string;
  feedUrl: string;
}

export function generateRSSFeed({ posts, title, description, language, feedUrl }: FeedOptions): string {
  const languageLinks = hrefLangLanguages
    .filter((l) => l.code !== language)
    .map(
      (l) =>
        `  <atom:link href="${siteUrl}/rss/${l.code}.xml" rel="alternate" type="application/rss+xml" hreflang="${l.code}" />`,
    )
    .join("\n");

  const items = posts
    .map(
      (post) => `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${siteUrl}/blog/${post.slug}/</link>
    <guid isPermaLink="true">${siteUrl}/blog/${post.slug}/</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <description>${escapeXml(post.excerpt)}</description>
    ${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n    ")}
  </item>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/rss.xsl" type="text/xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(title)}</title>
  <link>${siteUrl}</link>
  <description>${escapeXml(description)}</description>
  <language>${language}</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${languageLinks}${items}
</channel>
</rss>`;
}

export function generateAtomFeed({ posts, title, description, language, feedUrl }: FeedOptions): string {
  const languageLinks = hrefLangLanguages
    .filter((l) => l.code !== language)
    .map(
      (l) =>
        `  <link href="${siteUrl}/atom/${l.code}.xml" rel="alternate" type="application/atom+xml" hreflang="${l.code}" />`,
    )
    .join("\n");

  const entries = posts
    .map(
      (post) => `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${siteUrl}/blog/${post.slug}/" rel="alternate" type="text/html"/>
    <id>${siteUrl}/blog/${post.slug}/</id>
    <published>${new Date(post.date).toISOString()}</published>
    <updated>${new Date(post.date).toISOString()}</updated>
    <summary type="html">${escapeXml(post.excerpt)}</summary>
    ${post.tags.map((tag) => `<category term="${escapeXml(tag)}"/>`).join("\n    ")}
  </entry>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/atom.xsl" type="text/xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <link href="${siteUrl}" rel="alternate" type="text/html"/>
  <link href="${feedUrl}" rel="self" type="application/atom+xml"/>
  <updated>${new Date().toISOString()}</updated>
  <author><name>${author.name}</name></author>
  <id>${siteUrl}/</id>
  <subtitle>${escapeXml(description)}</subtitle>
${languageLinks}${entries}
</feed>`;
}

export function generateJSONFeed({ posts, title, description, language, feedUrl }: FeedOptions) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title,
    home_page_url: siteUrl,
    feed_url: feedUrl,
    description,
    authors: [{ name: author.name, url: siteUrl }],
    language,
    items: posts.map((post) => ({
      id: `${siteUrl}/blog/${post.slug}/`,
      url: `${siteUrl}/blog/${post.slug}/`,
      title: post.title,
      content_html: post.excerpt,
      summary: post.excerpt,
      date_published: new Date(post.date).toISOString(),
      date_modified: new Date(post.date).toISOString(),
      tags: post.tags || [],
    })),
  };
}

function cacheHeaders(contentType?: string) {
  const headers: Record<string, string> = {
    "Cache-Control": "public, max-age=3600, s-maxage=3600",
  };
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

export async function getRSSResponse(language?: string) {
  const allPosts = await getAllFeedPostsCached();
  const posts = postsForLanguage(allPosts, language, "all");
  const feedUrl = language ? `${siteUrl}/rss/${language}.xml` : `${siteUrl}/rss.xml`;

  return new Response(
    generateRSSFeed({
      posts,
      title: feedTitle(language),
      description: feedDescription(language),
      language: language || "en",
      feedUrl,
    }),
    {
      headers: cacheHeaders("application/xml"),
    },
  );
}

export async function getAtomResponse(language?: string) {
  const allPosts = await getAllFeedPostsCached();
  const posts = postsForLanguage(allPosts, language, "all");

  if (posts.length === 0 && language) {
    return new Response("No posts found for this language", { status: 404 });
  }

  const feedUrl = language ? `${siteUrl}/atom/${language}.xml` : `${siteUrl}/atom.xml`;

  return new Response(generateAtomFeed({ posts, title: feedTitle(language), description: siteDescription, language: language || "en", feedUrl }), {
    headers: cacheHeaders("application/atom+xml"),
  });
}

export async function getJSONFeedResponse(language?: string) {
  const allPosts = await getAllFeedPostsCached();
  const posts = postsForLanguage(allPosts, language, "en-only");

  if (language && posts.length === 0) {
    return new Response("No posts found for this language", { status: 404 });
  }

  const feedUrl = language ? `${siteUrl}/feed/${language}.json` : `${siteUrl}/feed.json`;

  return Response.json(generateJSONFeed({ posts, title: feedTitle(language), description: feedDescription(language), language: language || "en", feedUrl }), {
    headers: cacheHeaders(),
  });
}
