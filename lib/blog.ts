import fs from "fs"
import path from "path"
import matter from "gray-matter"

/**
 * Blog post metadata interface
 */
export interface BlogPostMetadata {
  slug: string
  title: string
  excerpt: string
  date: string
  mood: string
  catApproved: boolean
  readingTime: number
  language?: string
  tags?: string[]
  category?: string | null
}

/**
 * Complete blog post with content
 */
export interface BlogPost extends BlogPostMetadata {
  content: string
}

/**
 * Blog post navigation
 */
export interface BlogPostNavigation {
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}

const BLOG_DIRECTORY = path.join(process.cwd(), "content/blog")

/**
 * Read and parse a blog post file
 */
function readBlogPostFile(filePath: string): ReturnType<typeof matter> | null {
  try {
    if (!fs.existsSync(filePath)) return null
    return matter(fs.readFileSync(filePath, "utf8"))
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error reading blog post file ${filePath}:`, error)
    }
    return null
  }
}

/**
 * Recursively get all markdown files in a directory
 */
function getAllMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return []

  return fs.readdirSync(dir).flatMap(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    return stat?.isDirectory()
      ? getAllMarkdownFiles(filePath)
      : file.endsWith(".md") ? [filePath] : []
  })
}

/**
 * Get all blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPostMetadata[]> {
  try {
    if (!fs.existsSync(BLOG_DIRECTORY)) {
      fs.mkdirSync(BLOG_DIRECTORY, { recursive: true })
      return []
    }

    const filePaths = getAllMarkdownFiles(BLOG_DIRECTORY)
    if (!filePaths.length) return []

    const processPost = (fullPath: string): BlogPostMetadata | null => {
      const slug = path.relative(BLOG_DIRECTORY, fullPath).replace(/\.md$/, "").split(path.sep).join("/")
      const matterResult = readBlogPostFile(fullPath)
      if (!matterResult) return null

      return {
        slug,
        title: matterResult.data.title || "Untitled Post",
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

    return filePaths
      .map(processPost)
      .filter((post): post is BlogPostMetadata => post !== null)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching blog posts:", error)
    }
    return []
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPost(slug: string): Promise<BlogPost> {
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
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error getting blog post ${slug}:`, error)
    }
    throw error
  }
}

/**
 * Get previous and next post navigation
 */
export async function getPostNavigation(currentSlug: string): Promise<BlogPostNavigation> {
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

/**
 * Get related posts based on tags and category
 */
export async function getRelatedPosts(
  currentSlug: string,
  currentTags: string[] = [],
  currentCategory: string | null = null,
  limit: number = 4
): Promise<BlogPostMetadata[]> {
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
