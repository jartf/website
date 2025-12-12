"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Search, Filter } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"

interface Badge {
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

export default function BadgesClientWrapper({ badges, categories }: BadgesClientWrapperProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const mounted = useMounted()

  const filteredBadges = useMemo(() => {
    return badges.filter((badge) => {
      const matchesSearch =
        badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || badge.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, badges])

  const personalBadge = badges.find((badge) => badge.category === "personal")

  // Static content for no-JS users - show all badges without search/filter
  if (!mounted) {
    return (
      <div className="container max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-6">Classic web badges collection</h1>

        <p className="text-muted-foreground mb-8">
          A collection of classic web badges and buttons used on my website. These nostalgic 88x31 pixel badges from the time of Geocities represent the spirit of the early web. The badges listed here represent various things I support or use.
        </p>

        {/* Personal Badge Section */}
        {personalBadge && (
          <section className="mb-12 border p-6 rounded-lg bg-muted/30">
            <h2 className="text-2xl font-semibold mb-4" id="my-badge">
              My badge
            </h2>
            <p className="mb-4">Feel free to use this badge to link to my website:</p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="border p-2 bg-background rounded-md">
                <Image
                  src={personalBadge.src}
                  alt={personalBadge.alt}
                  width={personalBadge.width}
                  height={personalBadge.height}
                  className="pixelated"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Right-click and save this image to use it on your site.</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">HTML Code</h3>
              <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
                <code>{`<a href="https://jarema.me/">
  <img src="https://jarema.me/badge.png"
       alt="Jarema's personal badge"
       width="88" height="31"
       style="image-rendering: pixelated;">
</a>`}</code>
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Suggestions for embedding</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Use <code className="bg-muted px-1 rounded">image-rendering: pixelated;</code> in your CSS to preserve the
                  pixel art style.
                </li>
                <li>
                  Please link directly to my homepage at <code className="bg-muted px-1 rounded">https://jarema.me/</code>
                </li>
                <li>The badge is 88×31 pixels, double the width and height in your HTML to <code className="bg-muted px-1 rounded">width=&quot;176&quot; height=&quot;62&quot;</code> to make them easier to read on higher-resolution screens.</li>
              </ul>
            </div>
          </section>
        )}

        {/* Badges Collection */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Badges collection</h2>

          <p className="text-sm text-muted-foreground mb-4">
            Showing {badges.length} badges
          </p>

          {/* Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="border rounded-md p-4 flex flex-col">
                <div className="mb-2">
                  {badge.url ? (
                    <a href={badge.url} target="_blank" rel="noopener noreferrer" className="inline-block" aria-label={`Visit ${badge.name}`}>
                      <Image
                        src={badge.src}
                        alt={badge.alt}
                        width={badge.width}
                        height={badge.height}
                        className="pixelated hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ) : (
                    <Image
                      src={badge.src}
                      alt={badge.alt}
                      width={badge.width}
                      height={badge.height}
                      className="pixelated"
                    />
                  )}
                </div>
                <h3 className="font-medium">{badge.name}</h3>
                <p className="text-sm text-muted-foreground">{badge.description}</p>
                <div className="mt-2">
                  <span className="inline-block text-xs bg-muted px-2 py-1 rounded-full">{badge.category}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <style jsx global>{`
          .pixelated {
            image-rendering: pixelated;
            image-rendering: -moz-crisp-edges;
            image-rendering: crisp-edges;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Classic web badges collection</h1>

      <p className="text-muted-foreground mb-8">
        A collection of classic web badges and buttons used on my website. These nostalgic 88x31 pixel badges from the time of Geocities represent the spirit of the early web. The badges listed here represent various things I support or use.
      </p>

      {/* Personal Badge Section */}
      {personalBadge && (
        <section className="mb-12 border p-6 rounded-lg bg-muted/30">
          <h2 className="text-2xl font-semibold mb-4" id="my-badge">
            My badge
          </h2>
          <p className="mb-4">Feel free to use this badge to link to my website:</p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="border p-2 bg-background rounded-md">
              <Image
                src={personalBadge.src}
                alt={personalBadge.alt}
                width={personalBadge.width}
                height={personalBadge.height}
                className="pixelated"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Right-click and save this image to use it on your site.</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">HTML Code</h3>
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
              <code>{`<a href="https://jarema.me/">
  <img src="https://jarema.me/badge.png"
       alt="Jarema's personal badge"
       width="88" height="31"
       style="image-rendering: pixelated;">
</a>`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Suggestions for embedding</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Use <code className="bg-muted px-1 rounded">image-rendering: pixelated;</code> in your CSS to preserve the
                pixel art style.
              </li>
              <li>
                Please link directly to my homepage at <code className="bg-muted px-1 rounded">https://jarema.me/</code>
              </li>
              <li>The badge is 88×31 pixels, double the width and height in your HTML to <code className="bg-muted px-1 rounded">width=&quot;176&quot; height=&quot;62&quot;</code> to make them easier to read on higher-resolution screens.</li>
            </ul>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Badges collection</h2>

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

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <select
              className="pl-10 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm appearance-none pr-8"
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
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing {filteredBadges.length} of {badges.length} badges
        </p>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredBadges.map((badge) => (
            <div key={badge.id} className="border rounded-md p-4 flex flex-col">
              <div className="mb-2">
                {badge.url ? (
                  <a href={badge.url} target="_blank" rel="noopener noreferrer" className="inline-block" aria-label={`Visit ${badge.name}`}>
                    <Image
                      src={badge.src}
                      alt={badge.alt}
                      width={badge.width}
                      height={badge.height}
                      className="pixelated hover:opacity-90 transition-opacity"
                    />
                  </a>
                ) : (
                  <Image
                    src={badge.src}
                    alt={badge.alt}
                    width={badge.width}
                    height={badge.height}
                    className="pixelated"
                  />
                )}
              </div>
              <h3 className="font-medium">{badge.name}</h3>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
              <div className="mt-2">
                <span className="inline-block text-xs bg-muted px-2 py-1 rounded-full">{badge.category}</span>
              </div>
            </div>
          ))}
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-12 border rounded-md">
            <p className="text-muted-foreground">No badges found matching your search criteria</p>
          </div>
        )}
      </section>

      <style jsx global>{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  )
}
