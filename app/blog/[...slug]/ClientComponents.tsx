"use client"

import { useReducedMotion, useMounted, useCurrentLanguage } from "@/hooks"
import { useTranslation } from "react-i18next"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { formatDate } from "@/lib/utils"
import { LANGUAGE_NAMES } from "@/lib/constants"

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
 * Translated text with fallback for SSR
 */
export function TranslatedText({ i18nKey, fallback }: { i18nKey: string; fallback: string }) {
  const { t } = useTranslation()
  const mounted = useMounted()

  if (!mounted) return <>{fallback}</>
  return <>{t(i18nKey, fallback)}</>
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

/**
 * Animated wrapper - applies CSS animations when mounted and user prefers motion
 */
export function AnimatedSection({
  children,
  className,
  animationClass,
}: {
  children: React.ReactNode
  className?: string
  animationClass: string
}) {
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()

  const shouldAnimate = mounted && !prefersReducedMotion
  const classes = shouldAnimate ? `${className || ""} ${animationClass}`.trim() : className

  return <div className={classes}>{children}</div>
}
