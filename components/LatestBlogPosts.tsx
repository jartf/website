import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Tag, Globe, Cat } from "lucide-react"
import { useTranslation } from "react-i18next"
import { LANGUAGE_NAMES } from "@/lib/constants"

// Types for blog posts
export type BlogPostMetadata = {
  slug: string
  title: string
  excerpt: string
  date: string
  mood: string
  catApproved: boolean
  readingTime: number
  tags?: string[]
  category?: string
  language?: string
}

type LatestBlogPostsProps = {
  blogPosts: BlogPostMetadata[]
}

export function LatestBlogPosts({ blogPosts = [] }: LatestBlogPostsProps) {
  const { t } = useTranslation()
  if (!Array.isArray(blogPosts) || blogPosts.length === 0) return null

  // Sort by date descending and take 3 latest
  const latestPosts = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)

  const getLanguageName = (code: string): string => {
    return LANGUAGE_NAMES[code as keyof typeof LANGUAGE_NAMES] || code
  }

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">{t("home.latestBlogPosts", "Latest Blog Posts")}</h2>
      <div className="space-y-6">
        {latestPosts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="block group" passHref>
            <Card className="transition-all duration-300 hover:shadow-md relative overflow-hidden cursor-pointer border border-border group-hover:border-primary/50">
              <CardContent className="p-6 relative z-10">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>
                      {post.readingTime} {t("blog.minRead", "min read")}
                    </span>
                  </div>
                  <Badge variant="outline">{t("blog.mood", "Mood")}: {post.mood}</Badge>
                  {post.language && (
                    <Badge variant="outline" className="flex items-center gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100">
                      <Globe className="h-3 w-3 mr-1" />
                      {getLanguageName(post.language)}
                    </Badge>
                  )}
                  {post.catApproved && (
                    <div className="flex items-center text-amber-600 dark:text-amber-400">
                      <Cat className="h-4 w-4 mr-1" />
                      <span>{t("blog.cat", "Cat Approved")}</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.category && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {post.category}
                    </Badge>
                  )}
                  {post.tags &&
                    post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="flex items-center gap-1 text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                </div>
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
