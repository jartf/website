import { notFound } from "next/navigation"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { Metadata } from "next"
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata"
import BlogPostClient from "./BlogPostClient"

// Types for blog posts
type BlogPost = {
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
    console.error("Error generating metadata for blog post:", error)
    return baseGenerateMetadata({ title: "Blog Post Not Found" })
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string[] | string } }) {
  try {
    const slugArr = Array.isArray(params.slug) ? params.slug : [params.slug]
    const slug = slugArr.join("/")
    const post = await getBlogPost(slugArr)
    const navigation = await getPostNavigation(slug)
    const relatedPosts =
      post.tags?.length || post.category ? await getRelatedPosts(slug, post.tags, post.category) : []

    // Find alternate language versions
    const allPosts = await getAllBlogPosts()
    // Remove language from slug for base comparison (assume last part is language if matches post.language)
    const baseSlugParts = [...slugArr]
    if (baseSlugParts[baseSlugParts.length - 1] === post.language) {
      baseSlugParts.pop()
    }
    const baseSlug = baseSlugParts.join("/")

    // Prefer alternates from frontmatter if present
    let alternateLanguages = []
    if (post.alternates && Array.isArray(post.alternates) && post.alternates.length > 0) {
      alternateLanguages = post.alternates
        .filter((alt: any) => alt.language !== post.language)
        .map((alt: any) => ({
          language: alt.language,
          slug: alt.slug,
          title: allPosts.find(p => p.slug === alt.slug)?.title || alt.slug,
        }))
    } else {
      alternateLanguages = allPosts
        .filter(p => {
          // Remove language from candidate slug for base comparison
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
        .map(p => ({
          language: p.language,
          slug: p.slug,
          title: p.title,
        }))
    }

  // Pass the raw date to the client; let the client format it using the user's language

    // Pass all the data to the client component
    return (
      <BlogPostClient
        post={post}
        date={post.date}
        navigation={navigation}
        relatedPosts={relatedPosts}
        slug={slug}
        alternateLanguages={alternateLanguages}
      />
    )
  } catch (error) {
    console.error("Error rendering blog post:", error)
    notFound()
  }
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug.split("/"),
  }))
}
