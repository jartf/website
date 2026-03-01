import fs from "fs"
import path from "path"
import matter from "gray-matter"

// ============================================================================
// Types
// ============================================================================
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
  alternates?: { language: string; slug: string }[]
}

export interface AlternateLanguage {
  language: string
  slug: string
  title: string
}

export interface BlogPost extends BlogPostMetadata {
  content: string
}

export interface BlogPostNavigation {
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}

export interface ScrapbookEntry {
  date: string
  content: string
  slug: string
}

// ============================================================================
// Constants
// ============================================================================
const BLOG_DIRECTORY = path.join(process.cwd(), "content/blog")
const SCRAPBOOK_DIRECTORY = path.join(process.cwd(), "content/scrapbook")

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
        alternates: matterResult.data.alternates || [],
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

// ============================================================================
// Scrapbook Utilities
// ============================================================================
export function getScrapbookEntries(): ScrapbookEntry[] {
  if (!fs.existsSync(SCRAPBOOK_DIRECTORY)) return []

  return fs.readdirSync(SCRAPBOOK_DIRECTORY)
    .map(filename => {
      const { data, content } = matter(fs.readFileSync(path.join(SCRAPBOOK_DIRECTORY, filename), "utf8"))
      return { date: data.date, content: content.trim(), slug: filename.replace(/\.md$/, "") }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get alternate language versions of a post
 */
export async function getAlternateLanguages(
  slugArr: string[],
  post: BlogPostMetadata,
  allPosts: BlogPostMetadata[],
): Promise<AlternateLanguage[]> {
  const baseSlugParts = [...slugArr]
  if (baseSlugParts[baseSlugParts.length - 1] === post.language) {
    baseSlugParts.pop()
  }
  const baseSlug = baseSlugParts.join("/")

  // Prefer alternates from frontmatter if present
  if (post.alternates && post.alternates.length > 0) {
    return post.alternates
      .filter((alt) => alt.language !== post.language)
      .map((alt) => ({
        language: alt.language,
        slug: alt.slug,
        title: allPosts.find((p) => p.slug === alt.slug)?.title || alt.slug,
      }))
  }

  // Otherwise, find alternates by matching base slug
  return allPosts
    .filter((p) => {
      const pSlugParts = p.slug.split("/")
      if (pSlugParts[pSlugParts.length - 1] === p.language) {
        pSlugParts.pop()
      }
      const pBaseSlug = pSlugParts.join("/")
      return pBaseSlug === baseSlug && p.language !== post.language
    })
    .map((p) => ({
      language: p.language || "en",
      slug: p.slug,
      title: p.title,
    }))
}
