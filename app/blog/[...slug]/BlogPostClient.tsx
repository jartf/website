"use client"

import Link from "next/link"
import { Calendar, Clock, Cat, ArrowLeft, Tag, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { BlogPostNavigation } from "./BlogPostNavigation"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { SharePost } from "@/components/blog/share-post"
import { RelatedPosts } from "@/components/blog/related-posts"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useTranslation } from "react-i18next"

import { formatDate } from "@/lib/utils"
import { useCurrentLanguage } from "@/hooks/use-current-language"

interface BlogPostClientProps {
  post: any
  date: string
  navigation: any
  relatedPosts: any[]
  slug: string
  alternateLanguages?: { language: string; slug: string; title: string }[]
}
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
  const { t, i18n } = useTranslation()

  // Helper function to get full language name from code
  const getFullLanguageName = (code: string): string => {
    const languageMap: Record<string, string> = {
      en: t("language.en", "English"),
      vi: t("language.vi", "Vietnamese"),
      et: t("language.et", "Estonian"),
      ru: t("language.ru", "Russian"),
      da: t("language.da", "Danish"),
      tr: t("language.tr", "Turkish"),
      zh: t("language.zh", "Chinese"),
    }

    return languageMap[code.toLowerCase()] || code
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <ReadingProgress />
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div style={prefersReducedMotion ? {} : { opacity: 1, transform: "translateX(0px)" }}>
            <Link href="/blog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              t("blog.back", "Back to blog list"),
            </Link>
          </div>

          <article>
            <header className="mb-10">
              <h1
                className="text-4xl md:text-5xl font-bold mb-6"
                style={prefersReducedMotion ? {} : { opacity: 1, transform: "translateY(0px)" }}
              >
                {post.title}
              </h1>

              <div
                className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4"
                style={prefersReducedMotion ? {} : { opacity: 1, transform: "translateY(0px)" }}
              >
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{post.readingTime} min read</span>
                </div>
                <Badge variant="outline">Mood: {post.mood}</Badge>
                {post.catApproved && (
                  <div className="flex items-center text-amber-600 dark:text-amber-400">
                    <Cat className="h-4 w-4 mr-1" />
                    <span>t("blog.cat", "Cat approved")</span>
                  </div>
                )}
                {post.language && (
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    {getFullLanguageName(post.language)}
                  </Badge>
                )}
              </div>

              {/* Category and Tags */}
              <div
                className="flex flex-wrap gap-2 mb-4"
                style={prefersReducedMotion ? {} : { opacity: 1, transform: "translateY(0px)" }}
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
                    {post.tags.map((tag) => (
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

              {/* Share buttons */}
              <div
                className="mb-8 mt-4"
                style={prefersReducedMotion ? {} : { opacity: 1, transform: "translateY(0px)" }}
              >
                <SharePost title={post.title} url={`https://jarema.me/blog/${slug}`} />
              </div>

              {/* Alternate language notice */}
              {alternateLanguages.length > 0 && (
                <div className="mb-6 text-sm text-muted-foreground">
                  t("blog.availableIn", "This page is also available in"){" "}
                  {alternateLanguages.map((alt, idx) => {
                    const isLast = idx === alternateLanguages.length - 1
                    const isSecondLast = idx === alternateLanguages.length - 2
                    return (
                      <span key={alt.language}>
                        <Link
                          href={`/blog/${alt.slug}`}
                          className="underline hover:text-primary"
                        >
                          {getFullLanguageName(alt.language)}
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

            <div style={prefersReducedMotion ? {} : { opacity: 1, transform: "translateY(0px)" }} className="text-justify">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Add post navigation */}
            <div style={prefersReducedMotion ? {} : { opacity: 1, transform: "translateY(0px)" }}>
              <BlogPostNavigation navigation={navigation} />
            </div>

            {/* Related posts */}
            {relatedPosts.length > 0 && (
              <div style={prefersReducedMotion ? {} : { opacity: 1, transform: "translateY(0px)" }}>
                <RelatedPosts posts={relatedPosts} />
              </div>
            )}
          </article>
        </div>
      </div>
    </main>
  )
}
