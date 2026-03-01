import { getAllBlogPosts } from "@/lib/blog"
import BlogList from "./client"
import { generateMetadata } from "@/lib/metadata"
import { generateItemListSchema, generateBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data"
import { siteUrl } from "@/lib/constants"

export const metadata = generateMetadata({
  title: "Blog",
  description: "Thoughts, reflections, and occasional rants.",
  path: "blog",
})

export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts()

  // Generate structured data for blog list page
  const itemListSchema = generateItemListSchema(
    "Blog posts",
    "Thoughts, reflections, and occasional rants by Jarema",
    blogPosts.map(post => ({
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
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
