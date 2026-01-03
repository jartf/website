"use client"

import type React from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { ExternalLink } from "lucide-react"
import { useMounted } from "@/hooks"
import type { IconComponent } from "@/lib/icons"

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
  /** Optional subtitle below description */
  subtitle?: React.ReactNode
}

/**
 * Translated page header with title and description
 * Common pattern used across colophon, about, contact, etc.
 */
export function TranslatedPageHeader({
  titleKey,
  descriptionKey,
  staticTitle,
  staticDescription,
  className = "text-center mb-12",
  subtitle,
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
      {subtitle}
    </div>
  )
}

// ============================================================================
// CategoryHeader - Reusable category header with icon
// ============================================================================

interface CategoryHeaderProps {
  /** Icon component to render */
  icon?: IconComponent
  /** Icon name for lookup in iconMap */
  iconName?: string
  /** Icon map for name lookup */
  iconMap?: Record<string, IconComponent>
  /** Category title */
  title: string
  /** Additional CSS classes */
  className?: string
  /** Icon container variant */
  variant?: "filled" | "subtle"
}

/**
 * Reusable category header with icon and title
 * Used across Now, Uses, and other pages with categorized content
 */
export function CategoryHeader({
  icon,
  iconName,
  iconMap,
  title,
  className = "flex items-center gap-3 mb-4",
  variant = "filled",
}: CategoryHeaderProps) {
  const Icon = icon || (iconName && iconMap ? iconMap[iconName] : null)

  const iconContainerClass = variant === "filled"
    ? "bg-primary text-primary-foreground p-2 rounded-full"
    : "bg-primary/10 p-2 rounded-full"

  return (
    <div className={className}>
      {Icon && (
        <div className={iconContainerClass}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  )
}

// ============================================================================
// ExternalLinkText - Link with external icon pattern
// ============================================================================

interface ExternalLinkTextProps {
  /** URL to link to */
  href: string
  /** Link text content */
  children: React.ReactNode
  /** Additional CSS classes for the link */
  className?: string
  /** Icon size class (default: "h-4 w-4 ml-1") */
  iconClassName?: string
  /** Whether to show the external link icon (default: true) */
  showIcon?: boolean
}

/**
 * Reusable external link with icon pattern
 * Consolidates the repeated pattern: <Link href={url} target="_blank" rel="noopener noreferrer" className="...inline-flex items-center">{text}<ExternalLink className="h-4 w-4 ml-1"/></Link>
 *
 * Usage: <ExternalLinkText href="https://example.com">Example</ExternalLinkText>
 */
export function ExternalLinkText({
  href,
  children,
  className = "text-primary hover:underline inline-flex items-center",
  iconClassName = "h-4 w-4 ml-1",
  showIcon = true,
}: ExternalLinkTextProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      {showIcon && <ExternalLink className={iconClassName} aria-hidden="true" />}
    </Link>
  )
}
