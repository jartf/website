"use client"

import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useMounted } from "@/hooks/use-mounted"

/**
 * Client component that translates the colophon page content
 * Uses data-i18n attributes to find and replace text content
 */
export function ColophonTranslations() {
  const { t } = useTranslation()
  const mounted = useMounted()

  useEffect(() => {
    if (!mounted) return

    // Find all elements with data-i18n attribute and translate them
    const elements = document.querySelectorAll("[data-i18n]")
    elements.forEach((el) => {
      const key = el.getAttribute("data-i18n")
      if (key) {
        const translation = t(key)
        // Only update if translation exists and is different from key
        if (translation && translation !== key) {
          el.textContent = translation
        }
      }
    })
  }, [mounted, t])

  // Render the page header
  const title = mounted ? t("colophon.title") : "Colophon"
  const description = mounted
    ? t("colophon.description")
    : "Curious about how this site was built? Here's the behind-the-scenes."

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
    </div>
  )
}
