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
  personalBadge?: Badge
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
 * Now includes full page rendering with dynamic i18n support
 */
export default function BadgesClientWrapper({
  badges,
  categories,
  personalBadge,
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

  // Static content for no-JS users
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
    const st = enTranslations.badges
    return (
      <>
        <h1 className="text-3xl font-bold mb-6">{st.pageTitle}</h1>
        <p className="text-muted-foreground mb-6">{st.pageDescription}</p>

        {personalBadge && (
          <section className="mb-6">
            <details className="badge-details" aria-label="My badge details">
              <summary className="cursor-pointer">
                <h2 className="text-2xl font-semibold mb-0" id="my-badge">
                  {st.myBadgeTitle}
                </h2>
              </summary>

              <div className="border p-6 rounded-lg bg-muted/30 mt-4">
                <p className="mb-4">{st.myBadgeIntro}</p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                  <Image
                    src={personalBadge.src}
                    alt={personalBadge.alt}
                    width={personalBadge.width * 2}
                    height={personalBadge.height * 2}
                    className="pixelated"
                  />
                  <div>
                    <p className="text-m text-muted-foreground">{st.hotlinkUrl} <code>https://jarema.me/badge.png</code></p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">{st.htmlCodeTitle}</h3>
                  <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
                    <code>{`<a href="https://jarema.me/">
  <img src="https://jarema.me/badge.png"
       alt="A pixel art banner with a thin blue border of a smiling boy with brown hair and blue headphones, next to the word Jarema in a white, blocky pixel font. The background is black and filled with small white stars."
       width="88" height="31"
       style="image-rendering: pixelated;">
</a>`}</code>
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">{st.embeddingSuggestionsTitle}</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      {st.suggestion1} <code className="bg-muted px-1 rounded">image-rendering: pixelated;</code> {st.suggestion1b}
                    </li>
                    <li>
                      {st.suggestion2} <code className="bg-muted px-1 rounded">https://jarema.me/</code>
                    </li>
                    <li>{st.suggestion3} <code className="bg-muted px-1 rounded">width=&quot;176&quot; height=&quot;62&quot;</code> {st.suggestion3b}</li>
                  </ul>
                </div>
              </div>
            </details>
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{st.collectionHeading}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            {st.showingCount.replace('{{count}}', badges.length.toString())}
          </p>
          <BadgeGridCompact badges={badges} t={staticT} />
        </section>
      </>
    )
  }

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">{t('badges.pageTitle')}</h1>
      <p className="text-muted-foreground mb-6">{t('badges.pageDescription')}</p>

      {personalBadge && (
        <section className="mb-6">
          <details className="badge-details" aria-label="My badge details">
            <summary className="cursor-pointer">
              <h2 className="text-2xl font-semibold mb-0" id="my-badge">
                {t('badges.myBadgeTitle')}
              </h2>
            </summary>

            <div className="border p-6 rounded-lg bg-muted/30 mt-4">
              <p className="mb-4">{t('badges.myBadgeIntro')}</p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <Image
                  src={personalBadge.src}
                  alt={personalBadge.alt}
                  width={personalBadge.width * 2}
                  height={personalBadge.height * 2}
                  className="pixelated"
                />
                <div>
                  <p className="text-m text-muted-foreground">{t('badges.hotlinkUrl')} <code>https://jarema.me/badge.png</code></p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">{t('badges.htmlCodeTitle')}</h3>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
                  <code>{`<a href="https://jarema.me/">
  <img src="https://jarema.me/badge.png"
       alt="A pixel art banner with a thin blue border of a smiling boy with brown hair and blue headphones, next to the word Jarema in a white, blocky pixel font. The background is black and filled with small white stars."
       width="88" height="31"
       style="image-rendering: pixelated;">
</a>`}</code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">{t('badges.embeddingSuggestionsTitle')}</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    {t('badges.suggestion1')} <code className="bg-muted px-1 rounded">image-rendering: pixelated;</code> {t('badges.suggestion1b')}
                  </li>
                  <li>
                    {t('badges.suggestion2')} <code className="bg-muted px-1 rounded">https://jarema.me/</code>
                  </li>
                  <li>{t('badges.suggestion3')} <code className="bg-muted px-1 rounded">width=&quot;176&quot; height=&quot;62&quot;</code> {t('badges.suggestion3b')}</li>
                </ul>
              </div>
            </div>
          </details>
        </section>
      )}

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
    </>
  )
}
