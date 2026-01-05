import { getAllBlogPosts, type BlogPostMetadata } from "./blog"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, HREFLANG_LANGUAGES, LANGUAGE_NAMES } from "./constants"
import { escapeXml } from "./utils"

// ============================================================================
// Feed Generation Types
// ============================================================================
interface FeedOptions {
  posts: BlogPostMetadata[]
  title: string
  description: string
  language: string
  feedUrl: string
}

// ============================================================================
// RSS 2.0 Feed Generator
// ============================================================================
export function generateRSSFeed({ posts, title, description, language, feedUrl }: FeedOptions): string {
  const languageLinks = HREFLANG_LANGUAGES
    .filter(l => l !== language)
    .map(l => `  <atom:link href="${SITE_URL}/rss/${l}.xml" rel="alternate" type="application/rss+xml" hreflang="${l}" />`)
    .join("\n")

  const items = posts.map(post => `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${SITE_URL}/blog/${post.slug}</link>
    <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
    <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    <description>${escapeXml(post.excerpt)}</description>
    ${post.tags?.map(tag => `<category>${escapeXml(tag)}</category>`).join("\n    ") || ""}
  </item>`).join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/rss.xsl" type="text/xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(title)}</title>
  <link>${SITE_URL}</link>
  <description>${escapeXml(description)}</description>
  <language>${language}</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${languageLinks}${items}
</channel>
</rss>`
}

// ============================================================================
// Atom Feed Generator
// ============================================================================
export function generateAtomFeed({ posts, title, description, language, feedUrl }: FeedOptions): string {
  const languageLinks = HREFLANG_LANGUAGES
    .filter(l => l !== language)
    .map(l => `  <link href="${SITE_URL}/atom/${l}.xml" rel="alternate" type="application/atom+xml" hreflang="${l}" />`)
    .join("\n")

  const entries = posts.map(post => `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${SITE_URL}/blog/${post.slug}" rel="alternate" type="text/html"/>
    <id>${SITE_URL}/blog/${post.slug}</id>
    <published>${new Date(post.date).toISOString()}</published>
    <updated>${new Date(post.date).toISOString()}</updated>
    <summary type="html">${escapeXml(post.excerpt)}</summary>
    ${post.tags?.map(tag => `<category term="${escapeXml(tag)}"/>`).join("\n    ") || ""}
  </entry>`).join("")

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/atom.xsl" type="text/xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <link href="${feedUrl}" rel="self" type="application/atom+xml"/>
  <updated>${new Date().toISOString()}</updated>
  <author><name>Jarema</name></author>
  <id>${SITE_URL}/</id>
  <subtitle>${escapeXml(description)}</subtitle>
${languageLinks}${entries}
</feed>`
}

// ============================================================================
// JSON Feed Generator
// ============================================================================
export function generateJSONFeed({ posts, title, description, language, feedUrl }: FeedOptions) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title,
    home_page_url: SITE_URL,
    feed_url: feedUrl,
    description,
    authors: [{ name: "Jarema", url: SITE_URL }],
    language,
    items: posts.map(post => ({
      id: `${SITE_URL}/blog/${post.slug}`,
      url: `${SITE_URL}/blog/${post.slug}`,
      title: post.title,
      content_html: post.excerpt,
      summary: post.excerpt,
      date_published: new Date(post.date).toISOString(),
      date_modified: new Date(post.date).toISOString(),
      tags: post.tags || [],
    })),
  }
}

// ============================================================================
// Feed Response Helpers
// ============================================================================
export async function getRSSResponse(language?: string) {
  const allPosts = await getAllBlogPosts()
  const posts = language ? allPosts.filter(p => p.language === language || (language === "en" && !p.language)) : allPosts
  const title = language && language !== "en" ? `${SITE_NAME} - ${LANGUAGE_NAMES[language] || language}` : SITE_NAME
  const description = language && language !== "en" ? `${SITE_DESCRIPTION} - ${LANGUAGE_NAMES[language] || language}` : SITE_DESCRIPTION
  const feedUrl = language ? `${SITE_URL}/rss/${language}.xml` : `${SITE_URL}/rss.xml`

  return new Response(generateRSSFeed({ posts, title, description, language: language || "en", feedUrl }), {
    headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  })
}

export async function getAtomResponse(language?: string) {
  const allPosts = await getAllBlogPosts()
  const posts = language ? allPosts.filter(p => p.language === language || (language === "en" && !p.language)) : allPosts

  if (posts.length === 0 && language) {
    return new Response("No posts found for this language", { status: 404 })
  }

  const title = language && language !== "en" ? `${SITE_NAME} (${language})` : SITE_NAME
  const feedUrl = language ? `${SITE_URL}/atom/${language}.xml` : `${SITE_URL}/atom.xml`

  return new Response(generateAtomFeed({ posts, title, description: SITE_DESCRIPTION, language: language || "en", feedUrl }), {
    headers: { "Content-Type": "application/atom+xml", "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  })
}

export async function getJSONFeedResponse() {
  const allPosts = await getAllBlogPosts()
  const posts = allPosts.filter(p => !p.language || p.language === "en")

  return Response.json(generateJSONFeed({ posts, title: SITE_NAME, description: SITE_DESCRIPTION, language: "en", feedUrl: `${SITE_URL}/feed.json` }), {
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=3600" },
  })
}
