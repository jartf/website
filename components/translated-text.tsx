"use client"

import { useTranslation } from "react-i18next"
import { useMounted } from "@/hooks"

// ============================================================================
// TranslatedText - Simple inline translation with fallback
// ============================================================================

interface TranslatedTextProps {
  i18nKey: string
  fallback: string
}

/**
 * Client component for translating text with hydration safety
 * Uses useMounted pattern to prevent hydration mismatch
 *
 * Usage: <TranslatedText i18nKey="key" fallback="Default text" />
 */
export function TranslatedText({ i18nKey, fallback }: TranslatedTextProps) {
  const { t } = useTranslation()
  const mounted = useMounted()
  return <>{mounted ? t(i18nKey, fallback) : fallback}</>
}

// ============================================================================
// TranslatedPageHeader - Common page header pattern
// ============================================================================

interface TranslatedPageHeaderProps {
  titleKey: string
  descriptionKey: string
  staticTitle: string
  staticDescription: string
  className?: string
}

/**
 * Translated page header with title and description
 * Common pattern used across colophon, about, etc.
 */
export function TranslatedPageHeader({
  titleKey,
  descriptionKey,
  staticTitle,
  staticDescription,
  className = "text-center mb-12"
}: TranslatedPageHeaderProps) {
  const { t } = useTranslation()
  const mounted = useMounted()

  return (
    <div className={className}>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        {mounted ? t(titleKey, staticTitle) : staticTitle}
      </h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {mounted ? t(descriptionKey, staticDescription) : staticDescription}
      </p>
    </div>
  )
}
