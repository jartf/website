import { getAllBlogPosts } from "@/lib/blog-utils"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION, SUPPORTED_LANGUAGES } from "@/lib/constants"
import { escapeXml } from "@/lib/utils"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get all posts and filter for English posts (default language)
    const allPosts = await getAllBlogPosts()
    const posts = allPosts.filter((post) => !post.language || post.language === "en")

    // Create Atom feed
    const atom = generateAtomFeed({
      posts,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      language: "en",
      feedUrl: `${SITE_URL}/atom.xml`,
    })

    // Return the Atom feed with the appropriate content type
    return new NextResponse(atom, {
      headers: {
        "Content-Type": "application/atom+xml",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  } catch (error) {
    console.error("Error generating Atom feed:", error)
    return new NextResponse("Error generating Atom feed", { status: 500 })
  }
}

/**
 * Generate an Atom feed from blog posts
 * @param {Object} params - Parameters for generating the Atom feed
 * @param {Array} params.posts - Array of blog posts
 * @param {string} params.title - Feed title
 * @param {string} params.description - Feed description
 * @param {string} params.language - Feed language
 * @param {string} params.feedUrl - URL of the feed
 * @returns {string} - The generated Atom XML
 */
export function generateAtomFeed({ posts, title, description, language, feedUrl }) {
  let atomFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <link href="${feedUrl}" rel="self" type="application/atom+xml"/>
  <updated>${new Date().toISOString()}</updated>
  <author>
    <name>Jarema</name>
  </author>
  <id>${SITE_URL}/</id>
  <subtitle>${escapeXml(description)}</subtitle>
`

  // Add language-specific feed links
  SUPPORTED_LANGUAGES.forEach((lang) => {
    if (lang !== language) {
      atomFeed += `  <link href="${SITE_URL}/atom/${lang}.xml" rel="alternate" type="application/atom+xml" hreflang="${lang}" />\n`
    }
  })

  posts.forEach((post) => {
    atomFeed += `
  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${SITE_URL}/blog/${post.slug}" rel="alternate" type="text/html"/>
    <id>${SITE_URL}/blog/${post.slug}</id>
    <published>${new Date(post.date).toISOString()}</published>
    <updated>${new Date(post.date).toISOString()}</updated>
    <summary type="html">${escapeXml(post.excerpt)}</summary>
    ${post.tags?.map((tag) => `<category term="${escapeXml(tag)}"/>`).join("\n    ") || ""}
  </entry>
`
  })

  atomFeed += `
</feed>`

  return atomFeed
}
