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

export function readBlogPostFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null
    return matter(fs.readFileSync(filePath, "utf8"))
  } catch (error) {
    console.error(`Error reading blog post file ${filePath}:`, error)
    return null
  }
}

function getAllMarkdownFiles(dir) {
  return fs.readdirSync(dir).flatMap(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    return stat?.isDirectory() ? getAllMarkdownFiles(filePath) : file.endsWith(".md") ? [filePath] : []
  })
}

export async function getAllBlogPosts() {
  try {
    if (!fs.existsSync(BLOG_DIRECTORY)) {
      fs.mkdirSync(BLOG_DIRECTORY, { recursive: true })
      return []
    }

    const filePaths = getAllMarkdownFiles(BLOG_DIRECTORY)
    if (!filePaths.length) return []

    const processPost = (fullPath) => {
      const slug = path.relative(BLOG_DIRECTORY, fullPath).replace(/\.md$/, "").split(path.sep).join("/")
      const matterResult = readBlogPostFile(fullPath)
      if (!matterResult) return null

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
    }

    return filePaths.map(processPost).filter(Boolean).sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getBlogPost(slug) {
  try {
    const fullPath = path.join(BLOG_DIRECTORY, ...slug.split("/")) + ".md"
    const matterResult = readBlogPostFile(fullPath)
    if (!matterResult) throw new Error(`Failed to read blog post: ${slug}`)

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

export async function getPostNavigation(currentSlug) {
  const allPosts = await getAllBlogPosts()
  const currentIndex = allPosts.findIndex(post => post.slug === currentSlug)
  if (currentIndex === -1) return { prev: null, next: null }

  const prev = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null
  const next = currentIndex > 0 ? allPosts[currentIndex - 1] : null

  return {
    prev: prev ? { slug: prev.slug, title: prev.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  }
}

export async function getRelatedPosts(currentSlug, currentTags = [], currentCategory = null, limit = 4) {
  const allPosts = await getAllBlogPosts()
  const otherPosts = allPosts.filter(post => post.slug !== currentSlug)
  if (!otherPosts.length) return []

  const scoredPosts = otherPosts.map(post => {
    let score = 0
    if (currentCategory && post.category === currentCategory) score += 3
    if (currentTags.length && post.tags) {
      score += currentTags.filter(tag => post.tags?.includes(tag)).length
    }
    return { ...post, score }
  })

  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .filter(post => post.score > 0)
    .slice(0, limit)
}
