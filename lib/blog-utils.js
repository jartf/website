import fs from "fs"
import path from "path"
import matter from "gray-matter"

/**
 * @typedef {Object} BlogPostMetadata
 * @property {string} slug - The slug of the blog post
 * @property {string} title - The title of the blog post
 * @property {string} excerpt - A short excerpt from the blog post
 * @property {string} date - The publication date of the blog post
 * @property {string} mood - The mood associated with the blog post
 * @property {boolean} catApproved - Whether the post is approved by cats
 * @property {number} readingTime - Estimated reading time in minutes
 * @property {string} [language] - The language of the blog post
 * @property {string[]} [tags] - Tags associated with the blog post
 * @property {string} [category] - The category of the blog post
 */

/**
 * @typedef {BlogPostMetadata & {content: string}} BlogPost
 */

/**
 * @typedef {Object} BlogPostNavigation
 * @property {Object} prev - The previous blog post
 * @property {string} prev.slug - The slug of the previous blog post
 * @property {string} prev.title - The title of the previous blog post
 * @property {Object} next - The next blog post
 * @property {string} next.slug - The slug of the next blog post
 * @property {string} next.title - The title of the next blog post
 */

const BLOG_DIRECTORY = path.join(process.cwd(), "content/blog")

/**
 * Safely read a blog post file
 * @param {string} filePath - The path to the blog post file
 * @returns {Object|null} The parsed blog post file or null if an error occurred
 */
export function readBlogPostFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContents = fs.readFileSync(filePath, "utf8")
    return matter(fileContents)
  } catch (error) {
    console.error(`Error reading blog post file ${filePath}:`, error)
    return null
  }
}

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
 * Get all blog posts
 * @returns {Promise<BlogPost[]>} All blog posts
 */
export async function getAllBlogPosts() {
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(BLOG_DIRECTORY)) {
      fs.mkdirSync(BLOG_DIRECTORY, { recursive: true })
      return []
    }

    // Get all .md files recursively
    const filePaths = getAllMarkdownFiles(BLOG_DIRECTORY)

    if (filePaths.length === 0) {
      return []
    }

    const allPostsData = filePaths
      .map((fullPath) => {
        try {
          // Get slug relative to BLOG_DIRECTORY, remove .md extension, and replace backslashes with slashes
          let slug = path.relative(BLOG_DIRECTORY, fullPath).replace(/\.md$/, "")
          slug = slug.split(path.sep).join("/")

          // Read markdown file as string
          const matterResult = readBlogPostFile(fullPath)

          if (!matterResult) return null

          // Ensure all required metadata is present or provide defaults
          return {
            slug,
            title: matterResult.data.title || "Untitled Post",
            content: matterResult.content,
            excerpt: matterResult.data.excerpt || "No excerpt available",
            date: matterResult.data.date || new Date().toISOString(),
            mood: matterResult.data.mood || "contemplative",
            catApproved: matterResult.data.catApproved ?? true,
            readingTime: matterResult.data.readingTime || 5,
            language: matterResult.data.language || "en", // Default to English if not specified
            tags: matterResult.data.tags || [],
            category: matterResult.data.category || null,
          }
        } catch (error) {
          console.error(`Error processing blog post ${fullPath}:`, error)
          return null
        }
      })
      .filter((post) => post !== null)

    // Sort posts by date
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1
      } else {
        return -1
      }
    })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

/**
 * Get a specific blog post by slug
 * @param {string} slug - The slug of the blog post (may include subdirectories)
 * @returns {Promise<BlogPost>} The blog post
 */
export async function getBlogPost(slug) {
  try {
    // Support slugs with subdirectories (e.g., 2024/07/app-defaults-2024)
    const fullPath = path.join(BLOG_DIRECTORY, ...slug.split("/")) + ".md"
    const matterResult = readBlogPostFile(fullPath)

    if (!matterResult) {
      throw new Error(`Failed to read blog post: ${slug}`)
    }

    return {
      slug,
      title: matterResult.data.title || "Untitled Post",
      content: matterResult.content,
      excerpt: matterResult.data.excerpt || "No excerpt available",
      date: matterResult.data.date || new Date().toISOString(),
      mood: matterResult.data.mood || "contemplative",
      catApproved: matterResult.data.catApproved ?? true,
      readingTime: matterResult.data.readingTime || 5,
      language: matterResult.data.language || "en",
      tags: matterResult.data.tags || [],
      category: matterResult.data.category || null,
    }
  } catch (error) {
    console.error(`Error getting blog post ${slug}:`, error)
    throw error
  }
}

/**
 * Get navigation links for previous and next posts
 * @param {string} currentSlug - The slug of the current blog post
 * @returns {Promise<BlogPostNavigation>} Navigation links for previous and next posts
 */
export async function getPostNavigation(currentSlug) {
  const allPosts = await getAllBlogPosts()
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  const prev = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const next = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  return {
    prev: prev ? { slug: prev.slug, title: prev.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  }
}

/**
 * Get related posts based on tags and category
 * @param {string} currentSlug - The slug of the current blog post
 * @param {string[]} [currentTags=[]] - Tags of the current blog post
 * @param {string|null} [currentCategory=null] - Category of the current blog post
 * @param {number} [limit=4] - Maximum number of related posts to return
 * @returns {Promise<BlogPost[]>} Related blog posts
 */
export async function getRelatedPosts(currentSlug, currentTags = [], currentCategory = null, limit = 4) {
  const allPosts = await getAllBlogPosts()

  // Filter out the current post
  const otherPosts = allPosts.filter((post) => post.slug !== currentSlug)

  if (!otherPosts.length) return []

  // Score posts based on tag and category matches
  const scoredPosts = otherPosts.map((post) => {
    let score = 0

    // Category match is worth more points
    if (currentCategory && post.category === currentCategory) {
      score += 3
    }

    // Each matching tag adds a point
    if (currentTags.length && post.tags) {
      currentTags.forEach((tag) => {
        if (post.tags?.includes(tag)) {
          score += 1
        }
      })
    }

    return { ...post, score }
  })

  // Sort by score (highest first) and take top N
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .filter((post) => post.score > 0)
    .slice(0, limit)
}
