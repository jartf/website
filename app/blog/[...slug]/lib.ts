import fs from "fs"
import path from "path"
import matter from "gray-matter"

// Types for blog posts
export type BlogPost = {
  slug: string
  title: string
  content: string
  date: string
  mood: string
  catApproved: boolean
  readingTime: number
  tags?: string[]
  category?: string
  language?: string
  alternates?: { language: string; slug: string }[]
}

export type PostNavigation = {
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}

export type AlternateLanguage = {
  language: string
  slug: string
  title: string
}

// Function to safely read a blog post file
function readBlogPostFile(filePath: string): { content: string; data: Record<string, unknown> } | null {
  try {
    const fileContents = fs.readFileSync(filePath, "utf8")
    return matter(fileContents)
  } catch {
    return null
  }
}

// Helper to recursively get all .md files in a directory
function getAllMarkdownFiles(dir: string): string[] {
  let results: string[] = []
  const list = fs.readdirSync(dir)

  for (const file of list) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(filePath))
    } else if (file.endsWith(".md")) {
      results.push(filePath)
    }
  }

  return results
}

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const postsDirectory = path.join(process.cwd(), "content/blog")

    if (!fs.existsSync(postsDirectory)) {
      return []
    }

    const filePaths = getAllMarkdownFiles(postsDirectory)

    if (filePaths.length === 0) {
      return []
    }

    const posts = filePaths
      .map((fullPath) => {
        let slug = path.relative(postsDirectory, fullPath).replace(/\.md$/, "")
        slug = slug.split(path.sep).join("/")

        const matterResult = readBlogPostFile(fullPath)
        if (!matterResult) return null

        return {
          slug,
          title: matterResult.data.title as string || "Untitled Post",
          content: matterResult.content,
          date: matterResult.data.date as string || new Date().toISOString(),
          mood: matterResult.data.mood as string || "contemplative",
          catApproved: (matterResult.data.catApproved as boolean) ?? true,
          readingTime: matterResult.data.readingTime as number || 5,
          tags: matterResult.data.tags as string[] || [],
          category: matterResult.data.category as string || null,
          language: matterResult.data.language as string || "en",
          alternates: matterResult.data.alternates as { language: string; slug: string }[] || [],
        } as BlogPost
      })
      .filter((post): post is BlogPost => post !== null)

    // Sort by date (newest first)
    return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

// Get a specific blog post by slug
export async function getBlogPost(slugParam: string[] | string | undefined): Promise<BlogPost> {
  const postsDirectory = path.join(process.cwd(), "content/blog")

  if (!slugParam || (Array.isArray(slugParam) && slugParam.length === 0)) {
    throw new Error("Invalid slug: slug is undefined or empty")
  }

  const slugArr = Array.isArray(slugParam) ? slugParam : [slugParam]
  const fullPath = path.join(postsDirectory, ...slugArr) + ".md"
  const slug = slugArr.join("/")

  const matterResult = readBlogPostFile(fullPath)

  if (!matterResult) {
    throw new Error(`Failed to read blog post: ${slug}`)
  }

  return {
    slug,
    title: matterResult.data.title as string || "Untitled Post",
    content: matterResult.content,
    date: matterResult.data.date as string || new Date().toISOString(),
    mood: matterResult.data.mood as string || "contemplative",
    catApproved: (matterResult.data.catApproved as boolean) ?? true,
    readingTime: matterResult.data.readingTime as number || 5,
    language: matterResult.data.language as string || "en",
    tags: matterResult.data.tags as string[] || [],
    category: (matterResult.data.category as string) || undefined,
    alternates: matterResult.data.alternates as { language: string; slug: string }[] || [],
  }
}

// Get navigation links for previous and next posts
export async function getPostNavigation(currentSlug: string): Promise<PostNavigation> {
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

// Get related posts based on tags and category
export async function getRelatedPosts(
  currentSlug: string,
  currentTags: string[] = [],
  currentCategory: string | null = null,
): Promise<BlogPost[]> {
  const allPosts = await getAllBlogPosts()
  const otherPosts = allPosts.filter((post) => post.slug !== currentSlug)

  if (!otherPosts.length) return []

  const scoredPosts = otherPosts.map((post) => {
    let score = 0

    if (currentCategory && post.category === currentCategory) {
      score += 3
    }

    if (currentTags.length && post.tags) {
      for (const tag of currentTags) {
        if (post.tags.includes(tag)) {
          score += 1
        }
      }
    }

    return { ...post, score }
  })

  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .filter((post) => post.score > 0)
    .slice(0, 4)
}

// Get alternate language versions of a post
export async function getAlternateLanguages(
  slugArr: string[],
  post: BlogPost,
  allPosts: BlogPost[],
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

// Format date for SSR fallback
export function formatDateFallback(date: string): string {
  return new Date(date).toLocaleDateString("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
