"use client"

import Link from "next/link"
import { Calendar, Clock, Cat, ArrowLeft, Tag, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { BlogPostNavigation } from "./BlogPostNavigation"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { SharePost } from "@/components/blog/share-post"
import { RelatedPosts } from "@/components/blog/related-posts"
import { useReducedMotion, useMounted, useCurrentLanguage } from "@/hooks"
import { useTranslation } from "react-i18next"
import styles from "./BlogPostClient.module.css"
import { formatDate } from "@/lib/utils"
import { LANGUAGE_NAMES } from "@/lib/constants"

interface BlogPostClientProps {
  post: any
  date: string
  navigation: any
  relatedPosts: any[]
  slug: string
  alternateLanguages?: { language: string; slug: string; title: string }[]
}
/**
 * The client-side component for a blog post.
 * This component displays the blog post content, metadata, and related posts.
 * @param {BlogPostClientProps} props - The component props.
 * @returns {JSX.Element} The rendered blog post client component.
 */
export default function BlogPostClient({
  post,
  date,
  navigation,
  relatedPosts,
  slug,
  alternateLanguages = [],
}: BlogPostClientProps) {
  const currentLang = useCurrentLanguage()
  const formattedDate = formatDate(date, currentLang)
  const prefersReducedMotion = useReducedMotion()
  const { t } = useTranslation()
  const mounted = useMounted()

  // Helper function to get full language name from code (i18n + fallback to endonym)
  const getFullLanguageName = (code: string): string => {
    return String(t(`language.${code}`, LANGUAGE_NAMES[code as keyof typeof LANGUAGE_NAMES] || code))
  }

  // Static fallback values for SSR (no-JS support)
  const staticFallbacks = {
    back: "Back to blog list",
    minRead: "min read",
    mood: "Mood",
    cat: "Cat approved",
    availableIn: "This page is also available in",
  }

  // Use translated text when mounted, fallback to static for SSR
  const getText = (key: string, fallback: string) => mounted ? t(key, fallback) : fallback

  // Use animations only when mounted and user doesn't prefer reduced motion
  const shouldAnimate = mounted && !prefersReducedMotion

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {mounted && <ReadingProgress />}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div
            className={shouldAnimate ? styles.animatedX : undefined}
          >
            <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {getText("blog.back", staticFallbacks.back)}
            </Link>
          </div>

          <article>
            <header className="mb-10">
              <h1
                className={
                  shouldAnimate
                    ? `text-4xl md:text-5xl font-bold mb-6 ${styles.animatedY}`
                    : "text-4xl md:text-5xl font-bold mb-6"
                }
              >
                {post.title}
              </h1>

              <div
                className={`flex flex-wrap gap-4 text-sm text-muted-foreground mb-4 ${
                  shouldAnimate ? styles.animatedY : ""
                }`}
              >
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{post.readingTime} {getText("blog.minRead", staticFallbacks.minRead)}</span>
                </div>
                <Badge variant="outline">{getText("blog.mood", staticFallbacks.mood)}: {post.mood}</Badge>
                {post.catApproved && (
                  <div className="flex items-center text-amber-600 dark:text-amber-400">
                    <Cat className="h-4 w-4 mr-1" />
                    <span>{getText("blog.cat", staticFallbacks.cat)}</span>
                  </div>
                )}
                {post.language && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    {mounted ? getFullLanguageName(post.language) : (LANGUAGE_NAMES[post.language as keyof typeof LANGUAGE_NAMES] || post.language)}
                  </Badge>
                )}
              </div>

              {/* Category and Tags */}
              <div
                className={`flex flex-wrap gap-2 mb-4 ${
                  shouldAnimate ? styles.animatedY : ""
                }`}
              >
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
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 text-xs hover:bg-muted cursor-pointer"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Share buttons - only render when JS is available */}
              {mounted && (
                <div
                  className={`mb-8 mt-4 ${
                    shouldAnimate ? styles.animatedY : ""
                  }`}
                >
                  <SharePost title={post.title} url={`https://jarema.me/blog/${slug}`} />
                </div>
              )}

              {/* Alternate language notice */}
              {alternateLanguages.length > 0 && (
                <div className="mb-6 text-sm text-muted-foreground">
                  {getText("blog.availableIn", staticFallbacks.availableIn)}{" "}
                  {alternateLanguages.map((alt, idx) => {
                    const isLast = idx === alternateLanguages.length - 1
                    const isSecondLast = idx === alternateLanguages.length - 2
                    return (
                      <span key={alt.language}>
                        <Link
                          href={`/blog/${alt.slug}`}
                          className="underline hover:text-primary"
                        >
                          {mounted ? getFullLanguageName(alt.language) : (LANGUAGE_NAMES[alt.language as keyof typeof LANGUAGE_NAMES] || alt.language)}
                        </Link>
                        {alternateLanguages.length > 2 && !isLast && !isSecondLast && ", "}
                        {isSecondLast && " and "}
                      </span>
                    )
                  })}
                  .
                </div>
              )}
            </header>

            <div
              className={`text-justify ${
                shouldAnimate ? styles.animatedY : ""
              }`}
            >
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Add post navigation */}
            <div className={shouldAnimate ? styles.animatedY : undefined}>
              <BlogPostNavigation navigation={navigation} />
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div className={shouldAnimate ? styles.animatedY : undefined}>
                <RelatedPosts posts={relatedPosts} />
              </div>
            )}
          </article>
        </div>
      </div>
    </main>
  )
}
