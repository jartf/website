"use client"

import { useTranslation } from "react-i18next"
import { useMounted } from "@/hooks/use-mounted"

interface ColophonTranslationsProps {
  staticTitle: string
  staticDescription: string
}

/**
 * Client component that renders translated colophon page header
 * Uses useMounted pattern to avoid hydration mismatch
 */
export function ColophonTranslations({ staticTitle, staticDescription }: ColophonTranslationsProps) {
  const { t } = useTranslation()
  const mounted = useMounted()

  // Use static content for SSR, translated content when mounted
  const title = mounted ? t("colophon.title", staticTitle) : staticTitle
  const description = mounted ? t("colophon.description", staticDescription) : staticDescription

  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{description}</p>
    </div>
  )
}

interface TranslatedTextProps {
  i18nKey: string
  fallback: string
}

/**
 * Client component for translating individual text elements
 * Uses useMounted pattern to avoid hydration mismatch
 */
export function TranslatedText({ i18nKey, fallback }: TranslatedTextProps) {
  const { t } = useTranslation()
  const mounted = useMounted()

  return <>{mounted ? t(i18nKey, fallback) : fallback}</>
}
