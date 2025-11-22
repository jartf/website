import { getAllBlogPosts } from "@/lib/blog-utils"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SUPPORTED_LANGUAGES } from "@/lib/constants"
import { escapeXml } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get all posts and filter for English posts (default language)
    const allPosts = await getAllBlogPosts()
    const posts = allPosts.filter((post) => !post.language || post.language === "en")

    // Create RSS feed
    const rss = generateRSSFeed({
      posts,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      language: "en",
      feedUrl: `${SITE_URL}/rss.xml`,
    })

    // Return the RSS feed with the appropriate content type
    return new NextResponse(rss, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating RSS feed:", error)
    return new NextResponse("Error generating RSS feed", { status: 500 })
  }
}

/**
 * Helper function to generate RSS feed content
 * @param {Object} params - Parameters for generating the RSS feed
 * @param {Array} params.posts - Array of blog posts
 * @param {string} params.title - Feed title
 * @param {string} params.description - Feed description
 * @param {string} params.language - Feed language
 * @param {string} params.feedUrl - URL of the feed
 * @returns {string} - The generated RSS XML
 */
export function generateRSSFeed({ posts, title, description, language, feedUrl }) {
  // Create RSS feed header
  let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(title)}</title>
  <link>${SITE_URL}</link>
  <description>${escapeXml(description)}</description>
  <language>${language}</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
`

  // Add language-specific feed links
  SUPPORTED_LANGUAGES.forEach((lang) => {
    if (lang !== language) {
      rss += `  <atom:link href="${SITE_URL}/rss/${lang}.xml" rel="alternate" type="application/rss+xml" hreflang="${lang}" />\n`
    }
  })

  // Add each post to the feed
  posts.forEach((post) => {
    // Format the date according to RFC 822
    const pubDate = new Date(post.date).toUTCString()

    // Add item to RSS feed
    rss += `
  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${SITE_URL}/blog/${post.slug}</link>
    <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${escapeXml(post.excerpt)}</description>
    ${post.tags?.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n    ") || ""}
  </item>`
  })

  // Close RSS feed
  rss += `
</channel>
</rss>`

  return rss
}
