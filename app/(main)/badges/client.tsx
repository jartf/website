"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, Filter } from "lucide-react"
import { useMounted } from "@/hooks"

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
}: {
  badge: Badge
  showTitle?: boolean
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
        aria-label={`Visit ${badge.name}`}
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

function BadgeCard({ badge }: { badge: Badge }) {
  return (
    <div className="border rounded-md p-4 flex flex-col h-full">
      <div className="mb-2 min-h-[31px] flex items-center">
        <BadgeImage badge={badge} />
      </div>
      <h3 className="font-medium">{badge.name}</h3>
      <p className="text-sm text-muted-foreground">{badge.description}</p>
    </div>
  )
}

function BadgeGridVerbose({ badges }: { badges: Badge[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
      {badges.map((badge) => (
        <BadgeCard key={badge.id} badge={badge} />
      ))}
    </div>
  )
}

function BadgeGridCompact({ badges }: { badges: Badge[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <BadgeImage key={badge.id} badge={badge} showTitle />
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
    return (
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Badges collection</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Showing {badges.length} badges
        </p>
        <BadgeGridCompact badges={badges} />
      </section>
    )
  }

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Badges collection</h2>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search badges..."
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
            aria-label="Filter by category"
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
            Verbose
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
            Badge only
          </button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredBadges.length} of {badges.length} badges
      </p>

      {/* Badges Grid */}
      {viewMode === "verbose" && <BadgeGridVerbose badges={filteredBadges} />}
      {viewMode === "badge-only" && <BadgeGridCompact badges={filteredBadges} />}

      {filteredBadges.length === 0 && (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground">
            No badges found matching your search criteria
          </p>
        </div>
      )}
    </section>
  )
}
