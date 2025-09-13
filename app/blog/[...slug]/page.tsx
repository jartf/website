import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { format } from "date-fns"
import * as locales from "date-fns/locale"
import type { Locale } from "date-fns"
import type { Metadata } from "next"
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata"
import BlogPostClient from "./BlogPostClient"
  return (
    <BlogPostClient
      post={post}
      formattedDate={formattedDate}
      navigation={navigation}
      relatedPosts={relatedPosts}
      slug={slug}
      alternateLanguages={alternateLanguages}
    />
  )
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug.split("/"),
  }))
}

// Helper to recursively get all .md files in a directory and its subdirectories
function getAllMarkdownFiles(dir: string): string[] {
  let results: string[] = []
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

// Function to get all blog posts for navigation
async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const postsDirectory = path.join(process.cwd(), "content/blog")

    if (!fs.existsSync(postsDirectory)) {
      return []
    }

    // Get all .md files recursively
    const filePaths = getAllMarkdownFiles(postsDirectory)

    if (filePaths.length === 0) {
      return []
    }

    const allPostsData = filePaths
      .map((fullPath) => {
        // Get slug relative to postsDirectory, remove .md extension, and replace backslashes with slashes
        let slug = path.relative(postsDirectory, fullPath).replace(/\.md$/, "")
        slug = slug.split(path.sep).join("/")

        // Read markdown file as string
        const matterResult = readBlogPostFile(fullPath)

        if (!matterResult) return null

        // Ensure all required metadata is present or provide defaults
        return {
          slug,
          title: matterResult.data.title || "Untitled Post",
          content: matterResult.content,
          date: matterResult.data.date || new Date().toISOString(),
          mood: matterResult.data.mood || "contemplative",
          catApproved: matterResult.data.catApproved ?? true,
          readingTime: matterResult.data.readingTime || 5,
          tags: matterResult.data.tags || [],
          category: matterResult.data.category || null,
          language: matterResult.data.language || "en",
          alternates: matterResult.data.alternates || [], // <-- add this line
        } as BlogPost
      })
      .filter((post): post is BlogPost => post !== null)

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

// Function to get a specific blog post
async function getBlogPost(slugParam: string[] | string): Promise<BlogPost> {
  try {
    const postsDirectory = path.join(process.cwd(), "content/blog")
    // Support slugs with subdirectories (e.g., 2024/07/app-defaults-2024)
    const slugArr = Array.isArray(slugParam) ? slugParam : [slugParam]
    const fullPath = path.join(postsDirectory, ...slugArr) + ".md"
    const slug = slugArr.join("/")

    const matterResult = readBlogPostFile(fullPath)

    if (!matterResult) {
      throw new Error(`Failed to read blog post: ${slug}`)
    }

    return {
      slug,
      title: matterResult.data.title || "Untitled Post",
      content: matterResult.content,
      date: matterResult.data.date || new Date().toISOString(),
      mood: matterResult.data.mood || "contemplative",
      catApproved: matterResult.data.catApproved ?? true,
      readingTime: matterResult.data.readingTime || 5,
      language: matterResult.data.language || "en",
      tags: matterResult.data.tags || [],
      category: matterResult.data.category || null,
      alternates: matterResult.data.alternates || [], // <-- add this line
    }
  } catch (error) {
    console.error(`Error getting blog post ${Array.isArray(slugParam) ? slugParam.join("/") : slugParam}:`, error)
    throw error
  }
}

// Function to get navigation links for previous and next posts
async function getPostNavigation(currentSlug: string) {
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

// Add a function to get related posts based on tags and category
async function getRelatedPosts(
  currentSlug: string,
  currentTags: string[] = [],
  currentCategory: string | null = null,
): Promise<BlogPost[]> {
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

  // Sort by score (highest first) and take top 4
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .filter((post) => post.score > 0)
    .slice(0, 4)
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string[] | string } }): Promise<Metadata> {
  try {
    const post = await getBlogPost(params.slug)
    return {
      ...baseGenerateMetadata({
        title: post.title,
        description: post.content.substring(0, 160),
      }),
      openGraph: {
        title: post.title,
        description: post.content.substring(0, 160),
        type: "article",
        publishedTime: post.date,
        authors: ["Jarema"],
        tags: post.tags,
      },
    }
  } catch (error) {
    return baseGenerateMetadata({ title: "Blog Post Not Found" })
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string[] | string } }) {
  const slugArr = Array.isArray(params.slug) ? params.slug : [params.slug]
  const slug = slugArr.join("/")
  let post: BlogPost
  let navigation: any
  let relatedPosts: BlogPost[]
  let allPosts: BlogPost[]
  try {
    post = await getBlogPost(slugArr)
    navigation = await getPostNavigation(slug)
    relatedPosts = post.tags?.length || post.category ? await getRelatedPosts(slug, post.tags, post.category) : []
    allPosts = await getAllBlogPosts()
  } catch (error) {
    console.error("Error rendering blog post:", error)
    notFound()
    return null
  }
  const baseSlugParts = [...slugArr]
  if (baseSlugParts[baseSlugParts.length - 1] === post.language) {
    baseSlugParts.pop()
  }
  const baseSlug = baseSlugParts.join("/")
  let alternateLanguages
  if (post.alternates && Array.isArray(post.alternates) && post.alternates.length > 0) {
    alternateLanguages = post.alternates
      .filter((alt: any) => alt.language !== post.language)
      .map((alt: any) => ({
        language: alt.language,
        slug: alt.slug,
        title: allPosts.find((p: BlogPost) => p.slug === alt.slug)?.title || alt.slug,
      }))
  } else {
    alternateLanguages = allPosts
      .filter((p: BlogPost) => {
        const pSlugParts = p.slug.split("/")
        if (pSlugParts[pSlugParts.length - 1] === p.language) {
          pSlugParts.pop()
        }
        const pBaseSlug = pSlugParts.join("/")
        return (
          pBaseSlug === baseSlug &&
          p.language !== post.language
        )
      })
      .map((p: BlogPost) => ({
        language: p.language,
        slug: p.slug,
        title: p.title,
      }))
  }
  const localeMap: Record<string, Locale | undefined> = {
    en: locales.enUS,
    vi: locales.vi,
    et: locales.et,
    ru: locales.ru,
    da: locales.da,
    tr: locales.tr,
    zh: locales.zhCN,
  }
  const postLocale: Locale = localeMap[post.language || "en"] || locales.enUS
  const formattedDate = format(new Date(post.date), "MMMM d, yyyy", { locale: postLocale })
