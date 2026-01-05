"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, Filter } from "lucide-react"
import { useMounted } from "@/hooks"
import { useTranslation } from "react-i18next"
import enTranslations from "@/translations/en.json"

export interface Badge {
  id: string
  name: string
  src: string
  alt: string
  category: string
  width: number
  height: number
  url: string | null
  description: string
}

interface BadgesClientWrapperProps {
  badges: Badge[]
  categories: string[]
}

function BadgeImage({
  badge,
  showTitle = false,
  t,
}: {
  badge: Badge
  showTitle?: boolean
  t: (key: string, options?: any) => string
}) {
  const image = (
    <Image
      src={badge.src}
      alt={badge.alt}
      width={badge.width}
      height={badge.height}
      className={`pixelated ${badge.url ? "hover:opacity-90 transition-opacity" : ""}`}
    />
  )

  if (badge.url) {
    return (
      <a
        href={badge.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block"
        aria-label={t('badges.visitBadge', { name: badge.name })}
        title={showTitle ? badge.name : undefined}
      >
        {image}
      </a>
    )
  }

  if (showTitle) {
    return <div title={badge.name}>{image}</div>
  }

  return image
}

function BadgeCard({ badge, t }: { badge: Badge, t: (key: string, options?: any) => string }) {
  return (
    <div className="border rounded-md p-4 flex flex-col h-full">
      <div className="mb-2 min-h-[31px] flex items-center">
        <BadgeImage badge={badge} t={t} />
      </div>
      <h3 className="font-medium">{badge.name}</h3>
      <p className="text-sm text-muted-foreground">{badge.description}</p>
    </div>
  )
}

function BadgeGridVerbose({ badges, t }: { badges: Badge[], t: (key: string, options?: any) => string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
      {badges.map((badge) => (
        <BadgeCard key={badge.id} badge={badge} t={t} />
      ))}
    </div>
  )
}

function BadgeGridCompact({ badges, t }: { badges: Badge[], t: (key: string, options?: any) => string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <BadgeImage key={badge.id} badge={badge} showTitle t={t} />
      ))}
    </div>
  )
}

/**
 * Client wrapper for badge collection with search/filter functionality
 * Page header and personal badge section are server-rendered in page.tsx
 */
export default function BadgesClientWrapper({
  badges,
  categories,
}: BadgesClientWrapperProps) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState<"verbose" | "badge-only">("badge-only")
  const mounted = useMounted()

  const filteredBadges = useMemo(() => {
    return badges.filter((badge) => {
      const matchesSearch =
        badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || badge.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, badges])

  // Static content for no-JS users - show all badges without search/filter
  if (!mounted) {
    const staticT = (key: string, options?: any) => {
      const parts = key.split('.')
      let value: any = enTranslations
      for (const part of parts) {
        value = value[part]
      }
      if (typeof value === 'string' && options) {
        return value.replace(/\{\{(\w+)\}\}/g, (_, k) => options[k] || '')
      }
      return value
    }
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{enTranslations.badges.collectionHeading}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {enTranslations.badges.showingCount.replace('{{count}}', badges.length.toString())}
        </p>
        <BadgeGridCompact badges={badges} t={staticT} />
      </section>
    )
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">{t('badges.collectionHeading')}</h2>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t('badges.search')}
            className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative w-full sm:w-auto sm:min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            className="pl-10 w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none pr-8"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            aria-label={t('badges.filterByCategory')}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("verbose")}
            className={`h-10 px-4 rounded-md text-sm font-medium transition-colors ${
              viewMode === "verbose"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            aria-label="Verbose view"
          >
            {t('badges.verboseView')}
          </button>
          <button
            onClick={() => setViewMode("badge-only")}
            className={`h-10 px-4 rounded-md text-sm font-medium transition-colors ${
              viewMode === "badge-only"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            aria-label="Badge only view"
          >
            {t('badges.badgeOnlyView')}
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        {t('badges.showingFiltered', { filtered: filteredBadges.length, total: badges.length })}
      </p>

      {/* Badges Grid */}
      {viewMode === "verbose" && <BadgeGridVerbose badges={filteredBadges} t={t} />}
      {viewMode === "badge-only" && <BadgeGridCompact badges={filteredBadges} t={t} />}

      {filteredBadges.length === 0 && (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground">
            {t('badges.noResults')}
          </p>
        </div>
      )}
    </section>
  )
}
