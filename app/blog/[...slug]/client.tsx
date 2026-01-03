"use client"

import { useMounted, useCurrentLanguage } from "@/hooks"
import { useTranslation } from "react-i18next"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { formatDate } from "@/lib/utils"
import { LANGUAGE_NAMES } from "@/lib/constants"

// Re-export shared components for backward compatibility
export { TranslatedText } from "@/components/translated-text"
export { AnimatedSection } from "@/components/page-animation"

/**
 * Reading progress bar - only shows when JS is available
 */
export function BlogReadingProgress() {
  const mounted = useMounted()
  if (!mounted) return null
  return <ReadingProgress />
}

/**
 * Client-side formatted date with user's locale
 */
export function FormattedDate({ date, fallback }: { date: string; fallback: string }) {
  const mounted = useMounted()
  const currentLang = useCurrentLanguage()

  if (!mounted) return <>{fallback}</>
  return <>{formatDate(date, currentLang)}</>
}

/**
 * Language name with i18n support
 */
export function LanguageName({ code }: { code: string }) {
  const { t } = useTranslation()
  const mounted = useMounted()

  const fallback = LANGUAGE_NAMES[code as keyof typeof LANGUAGE_NAMES] || code
  if (!mounted) return <>{fallback}</>
  return <>{t(`language.${code}`, fallback)}</>
}
