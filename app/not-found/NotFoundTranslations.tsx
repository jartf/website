"use client"

import { useTranslation } from "react-i18next"
import { useMounted } from "@/hooks/use-mounted"

interface NotFoundTranslationsProps {
  staticTitle: string
  staticDescription: string
  staticButton: string
  staticSitemap: string
  staticEnjoycat: string
}

/**
 * Client component for translated 404 page text
 * Uses useMounted pattern to avoid hydration mismatch
 */
export function NotFoundTranslations({
  staticTitle,
  staticDescription,
  staticButton,
  staticSitemap,
  staticEnjoycat,
}: NotFoundTranslationsProps) {
  const { t } = useTranslation()
  const mounted = useMounted()

  return {
    title: mounted ? t("404.title", staticTitle) : staticTitle,
    description: mounted ? t("404.description", staticDescription) : staticDescription,
    button: mounted ? t("404.button", staticButton) : staticButton,
    sitemap: mounted ? t("404.sitemap", staticSitemap) : staticSitemap,
    enjoycat: mounted ? t("404.enjoycat", staticEnjoycat) : staticEnjoycat,
  }
}

/**
 * Translated title component
 */
export function NotFoundTitle({ fallback }: { fallback: string }) {
  const { t } = useTranslation()
  const mounted = useMounted()
  return <>{mounted ? t("404.title", fallback) : fallback}</>
}

/**
 * Translated description component
 */
export function NotFoundDescription({ fallback }: { fallback: string }) {
  const { t } = useTranslation()
  const mounted = useMounted()
  return <>{mounted ? t("404.description", fallback) : fallback}</>
}

/**
 * Translated button text component
 */
export function NotFoundButtonText({ fallback }: { fallback: string }) {
  const { t } = useTranslation()
  const mounted = useMounted()
  return <>{mounted ? t("404.button", fallback) : fallback}</>
}

/**
 * Translated sitemap text component
 */
export function NotFoundSitemapText({ fallback }: { fallback: string }) {
  const { t } = useTranslation()
  const mounted = useMounted()
  return <>{mounted ? t("404.sitemap", fallback) : fallback}</>
}

/**
 * Translated enjoy cat text component
 */
export function NotFoundEnjoycatText({ fallback }: { fallback: string }) {
  const { t } = useTranslation()
  const mounted = useMounted()
  return <>{mounted ? t("404.enjoycat", fallback) : fallback}</>
}
