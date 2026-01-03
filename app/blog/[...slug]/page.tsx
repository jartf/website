import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import { Calendar, Clock, Cat, ArrowLeft, Tag, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { RelatedPosts } from "@/components/blog/related-posts"
import { generateMetadata as baseGenerateMetadata } from "@/lib/metadata"
import { generateBlogPostSchema, generateBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data"

import {
  getAllBlogPosts,
  getBlogPost,
  getPostNavigation,
  getRelatedPosts,
  getAlternateLanguages,
} from "@/lib/blog"
import { formatDate } from "@/lib/utils"
import {
  BlogReadingProgress,
  FormattedDate,
  TranslatedText,
  LanguageName,
  AnimatedSection,
  BlogPostNavigation,
  ShareButtons,
} from "./client"

const SITE_URL = "https://jarema.me"

type PageParams = { slug: string[] | string } | Promise<{ slug: string[] | string }>

// Generate metadata for the page
export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  try {
    const resolvedParams = await Promise.resolve(params)

    if (!resolvedParams?.slug) {
      return baseGenerateMetadata({ title: "Blog post not found" })
    }

    const slugArr = Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug]
    const slug = slugArr.join("/")

    const post = await getBlogPost(slug)
    const description = post.content.substring(0, 160)

    return {
      ...baseGenerateMetadata({ title: post.title, description }),
      openGraph: {
        title: post.title,
        description,
        type: "article",
        publishedTime: post.date,
        authors: ["Jarema"],
        tags: post.tags,
      },
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
    return baseGenerateMetadata({ title: "Blog post not found" })
  }
}

export default async function BlogPostPage({ params }: { params: PageParams }) {
  try {
    const resolvedParams = await Promise.resolve(params)

    if (!resolvedParams?.slug) {
      notFound()
    }

    const slugArr = Array.isArray(resolvedParams.slug) ? resolvedParams.slug : [resolvedParams.slug]
    const slug = slugArr.join("/")

    // Fetch all required data
    const [post, navigation, allPosts] = await Promise.all([
      getBlogPost(slug),
      getPostNavigation(slug),
      getAllBlogPosts(),
    ])

    const relatedPosts = post.tags?.length || post.category
      ? await getRelatedPosts(slug, post.tags, post.category)
      : []

    const alternateLanguages = await getAlternateLanguages(slugArr, post, allPosts)
    const postUrl = `${SITE_URL}/blog/${slug}`

    // Structured data for Google
    const blogPostSchema = generateBlogPostSchema({
      title: post.title,
      description: post.content.substring(0, 160),
      slug,
      date: post.date,
      tags: post.tags,
      category: post.category || undefined,
      language: post.language,
      readingTime: post.readingTime,
    })

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: post.title, url: `/blog/${slug}` },
    ])

    return (
      <main className="relative min-h-screen w-full overflow-hidden">
        {renderJsonLd([blogPostSchema, breadcrumbSchema])}
        <BlogReadingProgress />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Back link */}
            <AnimatedSection animationClass="blog-animatedX">
              <Link
                href="/blog"
                className="inline-flex items-center text-muted-foreground hover:text-primary mb-8"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                <TranslatedText i18nKey="blog.back" fallback="Back to blog list" />
              </Link>
            </AnimatedSection>

            <article className="h-entry">
              <header className="mb-10">
                {/* Title */}
                <AnimatedSection
                  className="text-4xl md:text-5xl font-bold mb-6"
                  animationClass="blog-animatedY"
                >
                  <h1 className="p-name">{post.title}</h1>
                </AnimatedSection>

                {/* Post metadata */}
                <AnimatedSection
                  className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4"
                  animationClass="blog-animatedY"
                >
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <time className="dt-published" dateTime={post.date}>
                      <FormattedDate date={post.date} fallback={formatDate(post.date)} />
                    </time>
                  </div>

                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>
                      {post.readingTime} <TranslatedText i18nKey="blog.minRead" fallback="min read" />
                    </span>
                  </div>

                  <Badge variant="outline">
                    <TranslatedText i18nKey="blog.mood" fallback="Mood" />: {post.mood}
                  </Badge>

                  {post.catApproved && (
                    <div className="flex items-center text-amber-600 dark:text-amber-400">
                      <Cat className="h-4 w-4 mr-1" />
                      <TranslatedText i18nKey="blog.cat" fallback="Cat approved" />
                    </div>
                  )}

                  {post.language && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      <LanguageName code={post.language} />
                    </Badge>
                  )}
                </AnimatedSection>

                {/* Category and Tags */}
                {(post.category || (post.tags && post.tags.length > 0)) && (
                  <AnimatedSection className="flex flex-wrap gap-2 mb-4" animationClass="blog-animatedY">
                    {post.category && (
                      <Link href={`/blog?category=${encodeURIComponent(post.category)}`}>
                        <Badge
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800 cursor-pointer"
                        >
                          {post.category}
                        </Badge>
                      </Link>
                    )}
                    {post.tags?.map((tag) => (
                      <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                        <Badge
                          variant="outline"
                          className="p-category flex items-center gap-1 text-xs hover:bg-muted cursor-pointer"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </AnimatedSection>
                )}

                {/* Share buttons */}
                <AnimatedSection className="mb-8 mt-4" animationClass="blog-animatedY">
                  <ShareButtons title={post.title} url={postUrl} />
                </AnimatedSection>

                {/* Alternate language notice */}
                {alternateLanguages.length > 0 && (
                  <AnimatedSection className="mb-6 text-sm text-muted-foreground" animationClass="blog-animatedY">
                    <TranslatedText i18nKey="blog.availableIn" fallback="This page is also available in" />{" "}
                    {alternateLanguages.map((alt, idx) => (
                      <span key={alt.language}>
                        <Link href={`/blog/${alt.slug}`} className="underline hover:text-primary">
                          <LanguageName code={alt.language} />
                        </Link>
                        {idx < alternateLanguages.length - 2 && ", "}
                        {idx === alternateLanguages.length - 2 && " and "}
                      </span>
                    ))}
                    .
                  </AnimatedSection>
                )}
              </header>

              {/* Blog content */}
              <AnimatedSection className="text-justify e-content" animationClass="blog-animatedY">
                <MarkdownRenderer content={post.content} />
              </AnimatedSection>

              {/* Microformats hidden data */}
              <div className="p-author h-card hidden">
                <a className="p-name u-url" href={SITE_URL}>Jarema</a>
              </div>
              <a className="u-url hidden" href={postUrl}>Permalink</a>

              {/* Post navigation */}
              <AnimatedSection animationClass="blog-animatedY">
                <BlogPostNavigation navigation={navigation} />
              </AnimatedSection>

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <AnimatedSection animationClass="blog-animatedY">
                  <RelatedPosts posts={relatedPosts} />
                </AnimatedSection>
              )}
            </article>
          </div>
        </div>
      </main>
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
