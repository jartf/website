"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Search, Filter } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"

// Badge categories
const CATEGORIES = ["all", "personal", "validation", "browsers", "privacy", "software", "web", "misc"]

// Badge data with categories
const BADGES = [
  {
    id: "personal-badge",
    name: "Jarema Badge",
    src: "/badge.png",
    alt: "Jarema personal badge",
    category: "personal",
    width: 88,
    height: 31,
    url: null, // No link for personal badge
    description: "My personal web badge",
  },
  {
    id: "humans-txt",
    name: "humans.txt",
    src: "/humanstxt.png",
    alt: "humans.txt",
    category: "validation",
    width: 88,
    height: 31,
    url: "https://jarema.me/humans.txt",
    description: "Information about the humans behind this website",
  },
  {
    id: "valid-rss",
    name: "Valid RSS",
    src: "/valid-rss-rogers.png",
    alt: "Valid RSS",
    category: "validation",
    width: 88,
    height: 31,
    url: "https://jarema.me/rss.xml",
    description: "Valid RSS feed",
  },
  {
    id: "valid-atom",
    name: "Valid Atom",
    src: "/valid-atom.png",
    alt: "Valid Atom Feed",
    category: "validation",
    width: 88,
    height: 31,
    url: "https://jarema.me/atom.xml",
    description: "Valid Atom feed",
  },
  {
    id: "join-logo",
    name: "Join Logo",
    src: "/join_logo.gif",
    alt: "Join Logo",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Classic web badge",
  },
  {
    id: "bannars",
    name: "Bannars",
    src: "/bannars.gif",
    alt: "The March of Bannars",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "The March of Bannars",
  },
  {
    id: "best-viewed",
    name: "Best Viewed With Eyes",
    src: "/best_viewed_with_eyes.gif",
    alt: "Best Viewed With Eyes",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Best viewed with eyes",
  },
  {
    id: "people-pledge",
    name: "People Pledge",
    src: "/people_pledge_badge_party_cream_pink_88x31.png",
    alt: "People Pledge",
    category: "web",
    width: 88,
    height: 31,
    url: "https://people.pledge.party/",
    description: "People Pledge badge",
  },
  {
    id: "internet-privacy",
    name: "Internet Privacy Now",
    src: "/internetprivacy.gif",
    alt: "Internet Privacy Now",
    category: "privacy",
    width: 88,
    height: 31,
    url: null,
    description: "Internet Privacy Now",
  },
  {
    id: "no-web3",
    name: "Say No to Web3",
    src: "/saynotoweb3_88x31.gif",
    alt: "Say No to Web3",
    category: "web",
    width: 88,
    height: 31,
    url: "https://yesterweb.org/no-to-web3/",
    description: "Say No to Web3",
  },
  {
    id: "got-html",
    name: "Got HTML",
    src: "/got_html.gif",
    alt: "Got HTML?",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Got HTML?",
  },
  {
    id: "js-warning",
    name: "JavaScript Warning",
    src: "/js-warning.gif",
    alt: "JavaScript Warning",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "JavaScript Warning",
  },
  {
    id: "fedora",
    name: "Fedora",
    src: "/fedora.gif",
    alt: "Powered by Fedora",
    category: "software",
    width: 88,
    height: 31,
    url: "https://fedoraproject.org/",
    description: "Powered by Fedora",
  },
  {
    id: "firefox",
    name: "Firefox",
    src: "/firefox4.gif",
    alt: "Firefox Browser",
    category: "browsers",
    width: 88,
    height: 31,
    url: "https://www.mozilla.org/en-US/firefox/new/",
    description: "Firefox Browser",
  },
  {
    id: "anything-but",
    name: "Anything But Chrome",
    src: "/anythingbut.gif",
    alt: "Anything But Chrome",
    category: "browsers",
    width: 88,
    height: 31,
    url: null,
    description: "Anything But Chrome",
  },
  {
    id: "bitwarden",
    name: "Bitwarden",
    src: "/bitwarden.gif",
    alt: "Bitwarden Password Manager",
    category: "software",
    width: 88,
    height: 31,
    url: null,
    description: "Bitwarden Password Manager",
  },
]

export default function BadgesClient() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const mounted = useMounted()

  // Filter badges based on search query and selected category
  const filteredBadges = useMemo(() => {
    return BADGES.filter((badge) => {
      const matchesSearch =
        badge.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        badge.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || badge.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  if (!mounted) return null

  // Get the personal badge (should be the first one with category 'personal')
  const personalBadge = BADGES.find((badge) => badge.category === "personal")

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Classic web badges collection</h1>

      <p className="text-muted-foreground mb-8">
        A collection of classic web badges and buttons used on my website. These nostalgic 88x31 pixel badges from the time of Geocities represent the spirit of the early web. The badges listed here represent various things I support or use.
      </p>

      {/* Personal Badge Section */}
      <section className="mb-12 border p-6 rounded-lg bg-muted/30">
        <h2 className="text-2xl font-semibold mb-4" id="my-badge">
          My badge
        </h2>
        <p className="mb-4">Feel free to use this badge to link to my website:</p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <div className="border p-2 bg-background rounded-md">
            <Image
              src={personalBadge.src || "/badge.png"}
              alt={personalBadge.alt}
              width={personalBadge.width || "88"}
              height={personalBadge.height || "31"}
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
            >
              {CATEGORIES.map((category) => (
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
          Showing {filteredBadges.length} of {BADGES.length} badges
        </p>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredBadges.map((badge) => (
            <div key={badge.id} className="border rounded-md p-4 flex flex-col">
              <div className="mb-2">
                {badge.url ? (
                  <a href={badge.url} target="_blank" rel="noopener noreferrer" className="inline-block">
                    <Image
                      src={badge.src || "/placeholder.svg"}
                      alt={badge.alt}
                      width={badge.width}
                      height={badge.height}
                      className="pixelated hover:opacity-90 transition-opacity"
                    />
                  </a>
                ) : (
                  <Image
                    src={badge.src || "/placeholder.svg"}
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
