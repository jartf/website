"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
// Update the import to use next/navigation instead of directly manipulating window.location
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"

type NavigationProps = {
  navigation: {
    prev: { slug: string; title: string } | null
    next: { slug: string; title: string } | null
  }
}

export function BlogPostNavigation({ navigation }: NavigationProps) {
  // Inside the BlogPostNavigation component, add the router
  const router = useRouter()
  const { prev, next } = navigation
  const { t, i18n } = useTranslation()

  // Update the keyboard navigation to use router.push instead of window.location
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if inside an input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      // Navigate to previous post with 'h'
      if (e.key === "h" && prev) {
        e.preventDefault()
        router.push(`/blog/${prev.slug}`)
      }
      // Navigate to next post with 'l'
      else if (e.key === "l" && next) {
        e.preventDefault()
        router.push(`/blog/${next.slug}`)
      }
      // Back to blog list with 'b'
      else if (e.key === "b") {
        e.preventDefault()
        router.push("/blog")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [prev, next, router])

  if (!prev && !next) return null

  return (
    <nav className="mt-12 pt-8 border-t">
      <div className="flex justify-between items-center">
        {prev ? (
          <Link href={`/blog/${prev.slug}`} passHref>
            <Button variant="ghost" className="flex items-center gap-2 group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">{t("blog.prev", "Previous")}</div>
                <div className="text-sm font-medium truncate max-w-[200px]">{prev.title}</div>
              </div>
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link href={`/blog/${next.slug}`} passHref>
            <Button variant="ghost" className="flex items-center gap-2 group">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{t("blog.next", "Next")}</div>
                <div className="text-sm font-medium truncate max-w-[200px]">{next.title}</div>
              </div>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>

      <div className="flex justify-center mt-4">
        <Link href="/blog" passHref>
          <Button variant="outline" size="sm">
            {t("blog.back", "Back to blog list")}
          </Button>
        </Link>
      </div>
    </nav>
  )
}
