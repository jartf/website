import fs from "fs"
import path from "path"
import matter from "gray-matter"
import BlogList from "./BlogList"
import { generateMetadata } from "@/lib/metadata"
import { generateItemListSchema, generateBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data"
import { SITE_URL } from "@/lib/constants"

// Types for blog posts
type BlogPostMetadata = {
  slug: string
  title: string
  excerpt: string
  date: string
  mood: string
  catApproved: boolean
  readingTime: number
  language?: string
  tags?: string[]
  category?: string
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

// Function to get all blog posts - this runs on the server
async function getBlogPosts(): Promise<BlogPostMetadata[]> {
  try {
    const postsDirectory = path.join(process.cwd(), "content/blog")

    // Create directory if it doesn't exist
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
      return []
    }

    // Get all .md files recursively
    const filePaths = getAllMarkdownFiles(postsDirectory)

    if (filePaths.length === 0) {
      return []
    }

    const allPostsData = filePaths
      .map((fullPath) => {
        try {
          // Get slug relative to postsDirectory, remove .md extension, and replace backslashes with slashes
          let slug = path.relative(postsDirectory, fullPath).replace(/\.md$/, "")
          slug = slug.split(path.sep).join("/")

          // Read markdown file as string
          const fileContents = fs.readFileSync(fullPath, "utf8")

          // Use gray-matter to parse the post metadata section
          const matterResult = matter(fileContents)

          // Ensure all required metadata is present or provide defaults
          return {
            slug,
            title: matterResult.data.title || "Untitled Post",
            excerpt: matterResult.data.excerpt || "No excerpt available",
            date: matterResult.data.date || new Date().toISOString(),
            mood: matterResult.data.mood || "contemplative",
            catApproved: matterResult.data.catApproved ?? true,
            readingTime: matterResult.data.readingTime || 5,
            language: matterResult.data.language || "en", // Default to English if not specified
            tags: matterResult.data.tags || [],
            category: matterResult.data.category || null,
          } as BlogPostMetadata
        } catch (error) {
          console.error(`Error processing blog post ${fullPath}:`, error)
          return null
        }
      })
      .filter((post): post is BlogPostMetadata => post !== null)

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

export const metadata = generateMetadata({
  title: "Blog",
  description: "Thoughts, reflections, and occasional rants.",
  path: "blog",
})

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()

  // Generate structured data for blog list page
  const itemListSchema = generateItemListSchema(
    "Blog posts",
    "Thoughts, reflections, and occasional rants by Jarema",
    blogPosts.map(post => ({
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/blog/${post.slug}`,
      date: post.date,
    }))
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
  ])

  return (
    <>
      {/* Structured Data for Google Rich Results */}
      {renderJsonLd([itemListSchema, breadcrumbSchema])}
      <BlogList blogPosts={blogPosts} />
    </>
  )
}
