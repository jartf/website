import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { ROUTES } from "@/lib/constants"

/**
 * @typedef {'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'} ChangeFrequency
 */

/**
 * @typedef {Object} SitemapEntry
 * @property {string} url - The URL of the page
 * @property {Date|string} lastModified - When the page was last modified
 * @property {ChangeFrequency} changeFrequency - How frequently the page changes
 * @property {number} priority - The priority of the page (0.0 to 1.0)
 */

// Define static pages
const STATIC_PAGES = Object.values(ROUTES)

/**
 * Recursively get all .md files in a directory and its subdirectories
 * @param {string} dir
 * @returns {string[]}
 */
function getAllMarkdownFiles(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(filePath))
    } else if (file.endsWith(".md")) {
      results.push(filePath)
    }
  })
  return results
}

/**
 * Get all blog post slugs and their modification dates
 * @returns {Array<{slug: string, lastModified: Date}>}
 */
function getBlogPosts() {
  const postsDirectory = path.join(process.cwd(), "content/blog")

  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  try {
    // Get all .md files recursively
    const filePaths = getAllMarkdownFiles(postsDirectory)

    return filePaths.map((fullPath) => {
      // Get slug relative to postsDirectory, remove .md extension, and replace backslashes with slashes
      let slug = path.relative(postsDirectory, fullPath).replace(/\.md$/, "")
      slug = slug.split(path.sep).join("/")

      // Get file stats for last modification date
      const stats = fs.statSync(fullPath)

      // Parse frontmatter to get the publication date
      const fileContents = fs.readFileSync(fullPath, "utf8")
      const { data } = matter(fileContents)

      // Use the more recent of publication date or file modification date
      let lastModified = stats.mtime
      if (data.date) {
        const pubDate = new Date(data.date)
        if (pubDate > lastModified) {
          lastModified = pubDate
        }
      }

      return {
        slug,
        lastModified,
      }
    })
  } catch (error) {
    console.error("Error getting blog posts for sitemap:", error)
    return []
  }
}

/**
 * Get all static pages and their modification dates
 * @returns {Array<{path: string, lastModified: Date}>}
 */
function getStaticPages() {
  return STATIC_PAGES.map((page) => {
    let filePath

    // Check if it's the home page
    if (page === "/") {
      filePath = path.join(process.cwd(), "app/page.tsx")
    } else {
      filePath = path.join(process.cwd(), `app${page}/page.tsx`)
    }

    // Get file stats for last modification date
    let lastModified = new Date()
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath)
      lastModified = stats.mtime
    }

    return {
      path: page,
      lastModified,
    }
  })
}

/**
 * Get change frequency and priority for a URL
 * @param {string} url - The URL to get change frequency and priority for
 * @returns {{changeFrequency: ChangeFrequency, priority: number}}
 */
function getChangeFreqAndPriority(url) {
  if (url === "/") {
    return { changeFrequency: "weekly", priority: 1.0 }
  } else if (url === "/blog") {
    return { changeFrequency: "weekly", priority: 0.8 }
  } else if (url.startsWith("/blog/")) {
    return { changeFrequency: "monthly", priority: 0.6 }
  } else if (["/about", "/projects"].includes(url)) {
    return { changeFrequency: "monthly", priority: 0.8 }
  } else {
    return { changeFrequency: "monthly", priority: 0.7 }
  }
}

/**
 * Generate the sitemap for the website
 * @returns {Array<SitemapEntry>}
 */
export default function sitemap() {
  const baseUrl = "https://jarema.me"

  try {
    // Get all static pages
    const staticPages = getStaticPages().map(({ path, lastModified }) => {
      const { changeFrequency, priority } = getChangeFreqAndPriority(path)
      return {
        url: `${baseUrl}${path}`,
        lastModified,
        changeFrequency,
        priority,
      }
    })

    // Get all blog posts
    const blogPosts = getBlogPosts().map(({ slug, lastModified }) => {
      const { changeFrequency, priority } = getChangeFreqAndPriority(`/blog/${slug}`)
      return {
        url: `${baseUrl}/blog/${slug}`,
        lastModified,
        changeFrequency,
        priority,
      }
    })

    // Combine all URLs
    return [...staticPages, ...blogPosts]
  } catch (error) {
    console.error("Error generating sitemap:", error)
    // Return a minimal sitemap with just the homepage in case of error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 1.0,
      },
    ]
  }
}
