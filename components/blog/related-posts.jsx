import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import * as locales from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/**
 * @typedef {Object} RelatedPost
 * @property {string} slug - The post slug
 * @property {string} title - The post title
 * @property {string} date - The post date
 * @property {number} readingTime - The post reading time in minutes
 * @property {string[]} [tags] - Optional post tags
 * @property {string} [category] - Optional post category
 */

/**
 * Related Posts component that displays a grid of related blog posts
 * @param {Object} props - Component props
 * @param {RelatedPost[]} props.posts - Array of related posts
 */
  if (!posts.length) return null

  // Use the language of the first post as a fallback
  const fallbackLang = posts[0]?.language || "en"
  const localeMap = {
    en: locales.enUS,
    vi: locales.vi,
    et: locales.et,
    ru: locales.ru,
    da: locales.da,
    tr: locales.tr,
    zh: locales.zhCN,
  }

  return (
    <div className="mt-12 pt-6 border-t">
      <h3 className="text-xl font-bold mb-6">Related Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => {
          const postLocale = localeMap[post.language] || localeMap[fallbackLang] || locales.enUS
          return (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="no-underline">
              <Card className="h-full card-hover-effect">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      <span>{format(new Date(post.date), "MMM d, yyyy", { locale: postLocale })}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{post.readingTime} min read</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.category && (
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                    )}
                    {post.tags &&
                      post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    {post.tags && post.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 2} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
