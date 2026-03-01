import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("en", { year: 'numeric', month: 'short', day: 'numeric' })

/** Related posts grid - server-renderable */
export function RelatedPosts({ posts }) {
  if (!posts.length) return null

  return (
    <div className="mt-12 pt-6 border-t">
      <h3 className="text-xl font-bold mb-6">Related Posts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="no-underline">
            <Card className="h-full card-hover-effect">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center"><Calendar className="mr-1 h-3 w-3" />{formatDate(post.date)}</div>
                  <div className="flex items-center"><Clock className="mr-1 h-3 w-3" />{post.readingTime} min read</div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.category && <Badge variant="secondary" className="text-xs">{post.category}</Badge>}
                  {post.tags?.slice(0, 2).map((tag) => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                  {post.tags?.length > 2 && <Badge variant="outline" className="text-xs">+{post.tags.length - 2} more</Badge>}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
