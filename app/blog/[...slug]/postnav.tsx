"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useMounted } from "@/hooks"
import { useEffect } from "react"

type NavigationProps = {
  navigation: {
    prev: { slug: string; title: string } | null
    next: { slug: string; title: string } | null
  }
}

// Static fallback labels
const STATIC_LABELS = {
  prev: "Previous",
  next: "Next",
  back: "Back to blog list",
}

/**
 * A component that displays navigation links to the previous and next blog posts.
 * Server-rendered UI with client-side keyboard navigation.
 */
export function BlogPostNavigation({ navigation }: NavigationProps) {
  const router = useRouter()
  const { prev, next } = navigation
  const { t } = useTranslation()
  const mounted = useMounted()

  // Keyboard navigation - client-side only
  useEffect(() => {
    if (!mounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      if (e.key === "h" && prev) {
        e.preventDefault()
        router.push(`/blog/${prev.slug}`)
      } else if (e.key === "l" && next) {
        e.preventDefault()
        router.push(`/blog/${next.slug}`)
      } else if (e.key === "b") {
        e.preventDefault()
        router.push("/blog")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [prev, next, router, mounted])

  if (!prev && !next) return null

  // Get translated labels or fallback to static
  const labels = {
    prev: mounted ? t("blog.prev", STATIC_LABELS.prev) : STATIC_LABELS.prev,
    next: mounted ? t("blog.next", STATIC_LABELS.next) : STATIC_LABELS.next,
    back: mounted ? t("blog.back", STATIC_LABELS.back) : STATIC_LABELS.back,
  }

  return (
    <nav className="mt-12 pt-8 border-t">
      <div className="flex justify-between items-center">
        {prev ? (
          <Link href={`/blog/${prev.slug}`} passHref>
            <Button variant="ghost" className="flex items-center gap-2 group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">{labels.prev}</div>
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
                <div className="text-xs text-muted-foreground">{labels.next}</div>
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
            {labels.back}
          </Button>
        </Link>
      </div>
    </nav>
  )
}
