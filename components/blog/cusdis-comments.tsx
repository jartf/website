"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useMounted } from "@/hooks"

declare global {
  interface Window {
    CUSDIS?: {
      initial: () => void
      setTheme: (theme: "light" | "dark" | "auto") => void
    }
  }
}

interface CusdisCommentsProps {
  pageId: string
  pageUrl: string
  pageTitle: string
}

export function CusdisComments({ pageId, pageUrl, pageTitle }: CusdisCommentsProps) {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()
  const containerRef = useRef<HTMLDivElement>(null)

  // Load Cusdis script
  useEffect(() => {
    if (!mounted) return

    const existingScript = document.querySelector('script[src="https://cusdis.com/js/cusdis.es.js"]')
    if (existingScript) {
      // Script already loaded, reinitialize
      window.CUSDIS?.initial()
      return
    }

    const script = document.createElement("script")
    script.src = "https://cusdis.com/js/cusdis.es.js"
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      window.CUSDIS?.initial()
    }

    return () => {
      // Don't remove script on unmount to avoid reloading on navigation
    }
  }, [mounted])

  // Update theme when it changes
  useEffect(() => {
    if (!mounted || !window.CUSDIS) return

    const theme = resolvedTheme === "dark" ? "dark" : "light"
    window.CUSDIS.setTheme(theme)
  }, [resolvedTheme, mounted])

  if (!mounted) {
    return (
      <div className="h-0 animate-pulse bg-muted rounded-lg" />
    )
  }

  const theme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      <div
        ref={containerRef}
        id="cusdis_thread"
        className="[&_iframe]:min-h-[380px] [&_iframe]:w-full"
        data-host="https://cusdis.com"
        data-app-id="2a38d0a9-34a3-4f5e-b985-63fc014e30e5"
        data-page-id={pageId}
        data-page-url={pageUrl}
        data-page-title={pageTitle}
        data-theme={theme}
      />
    </section>
  )
}
