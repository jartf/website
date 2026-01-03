"use client"

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { useCurrentLanguage, useMounted } from "@/hooks"
import { Calendar, Clock, Cat, Search, Filter, SortDesc, SortAsc, X, Tag, Globe, Rss } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES } from "@/lib/constants"
import type { BlogPostMetadata } from "@/lib/blog"
import styles from "./list.module.css"

// Static fallback content for SSR
const STATIC_CONTENT = {
  title: "Blog",
  noPosts: "No posts yet. Check back soon!",
  search: "Search posts...",
  minRead: "min read",
  mood: "Mood",
  cat: "Cat Approved",
}

type BlogListProps = {
  blogPosts: BlogPostMetadata[]
}

type SortOption = "newest" | "oldest" | "readingTime" | "alphabetical"

// Memoized blog post card to prevent re-renders when list changes
const BlogPostCard = memo(function BlogPostCard({
  post,
  index,
  isFocused,
  currentLang,
  getLanguageName,
  t,
}: {
  post: BlogPostMetadata
  index: number
  isFocused: boolean
  currentLang: string
  getLanguageName: (code: string) => string
  t: ReturnType<typeof useTranslation>['t']
}) {
  return (
    <div
      className={`relative transition-all duration-300 h-entry ${
        isFocused ? "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-lg" : ""
      } ${styles.visible}`}
    >
      {/* Post number indicator for keyboard navigation */}
      {index < 9 && (
        <div className="absolute -left-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs">
          {index + 1}
        </div>
      )}

      <Link href={`/blog/${post.slug}`} className="block group u-url" passHref>
        <Card
          className={`transition-all duration-300 hover:shadow-md relative overflow-hidden cursor-pointer border border-border group-hover:border-primary/50 ${styles.visibleOpacity}`}
        >
          {/* Hover effect background */}
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Card content */}
          <CardContent className="p-6 relative z-10">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors p-name">
              {post.title}
            </h2>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span><time className="dt-published" dateTime={post.date}>{formatDate(post.date, currentLang)}</time></span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>
                  {post.readingTime} {t("blog.minRead", "min read")}
                </span>
              </div>
              <Badge variant="outline" className="group-hover:bg-muted/80 transition-colors">
                {t("blog.mood", "Mood")}: {post.mood}
              </Badge>
              {post.language && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  {getLanguageName(post.language)}
                </Badge>
              )}
              {post.catApproved && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
                >
                  <Cat className="h-3 w-3" />
                  {t("blog.cat", "Cat Approved")}
                </Badge>
              )}
            </div>

            {/* Category and Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {post.category && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                >
                  {post.category}
                </Badge>
              )}
              {post.tags &&
                post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1 text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
            </div>

            <p className="text-muted-foreground p-summary">{post.excerpt}</p>
          </CardContent>
        </Card>
      </Link>
      {/* Hidden h-card for author information - outside Link to avoid nested anchors */}
      <div className="p-author h-card" style={{ display: 'none' }}>
        <span className="p-name" data-url="https://jarema.me">Jarema</span>
      </div>
    </div>
  )
})

export default function BlogList({ blogPosts = [] }: BlogListProps) {
  const { t } = useTranslation()
  const [focusedPostIndex, setFocusedPostIndex] = useState<number>(-1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [filterMoods, setFilterMoods] = useState<string[]>([])
  const [filterTags, setFilterTags] = useState<string[]>([])
  const [filterCategories, setFilterCategories] = useState<string[]>([])
  const [filterCatApproved, setFilterCatApproved] = useState<boolean | null>(null)
  const mounted = useMounted()

  const postRefs = useRef<(HTMLDivElement | null)[]>([])
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Ensure blogPosts is always an array
  const safeBlogPosts = useMemo(() => Array.isArray(blogPosts) ? blogPosts : [], [blogPosts])
  const currentLang = useCurrentLanguage()

  // Compute default language filter based on current language
  const defaultLanguageFilter = useMemo(() => {
    if (safeBlogPosts.length === 0) return ["en"]

    const baseLanguage = currentLang.split("-")[0]
    const hasPostsInCurrentLanguage = safeBlogPosts.some(
      (post) => post.language === currentLang || post.language === baseLanguage,
    )

    // Special case: if currentLang or baseLanguage is "vih", include both "vi" and "vih"
    if (baseLanguage === "vih" || currentLang === "vih") {
      return ["vi", "vih"]
    } else if (hasPostsInCurrentLanguage) {
      return [baseLanguage]
    } else {
      return ["en"]
    }
  }, [currentLang, safeBlogPosts])

  // Track if user has manually modified the language filter
  const [userModifiedLanguageFilter, setUserModifiedLanguageFilter] = useState(false)
  const [manualFilterLanguages, setManualFilterLanguages] = useState<string[]>([])

  // Use manual filter if user modified it, otherwise use default
  const filterLanguages = userModifiedLanguageFilter ? manualFilterLanguages : defaultLanguageFilter

  // Get unique values from all blog posts
  const uniqueMoods = Array.from(new Set(safeBlogPosts.map((post) => post.mood).filter(Boolean)))
  const uniqueTags = Array.from(new Set(safeBlogPosts.flatMap((post) => post.tags || []).filter(Boolean)))
  const uniqueCategories = Array.from(new Set(safeBlogPosts.map((post) => post.category).filter(Boolean) as string[]))
  const uniqueLanguages = Array.from(new Set(safeBlogPosts.map((post) => post.language || "en").filter(Boolean)))

  // Filter and sort posts using useMemo
  const filteredPosts = useMemo(() => {
    let result = [...safeBlogPosts]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (post) =>
          post.title?.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.mood?.toLowerCase().includes(query) ||
          (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(query))) ||
          (post.category && post.category.toLowerCase().includes(query)) ||
          (post.language && post.language.toLowerCase().includes(query)),
      )
    }

    // Apply mood filter
    if (filterMoods.length > 0) {
      result = result.filter((post) => post.mood && filterMoods.includes(post.mood))
    }

    // Apply tags filter
    if (filterTags.length > 0) {
      result = result.filter((post) => post.tags && post.tags.some((tag) => filterTags.includes(tag)))
    }

    // Apply categories filter
    if (filterCategories.length > 0) {
      result = result.filter((post) => post.category && filterCategories.includes(post.category))
    }

    // Apply language filter
    if (filterLanguages.length > 0) {
      result = result.filter((post) => post.language && filterLanguages.includes(post.language))
    }

    // Apply cat approved filter
    if (filterCatApproved !== null) {
      result = result.filter((post) => post.catApproved === filterCatApproved)
    }

    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case "readingTime":
        result.sort((a, b) => a.readingTime - b.readingTime)
        break
      case "alphabetical":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }

    return result
  }, [
    safeBlogPosts,
    searchQuery,
    sortOption,
    filterMoods,
    filterTags,
    filterCategories,
    filterLanguages,
    filterCatApproved,
  ])

  // Initialize refs array
  useEffect(() => {
    postRefs.current = postRefs.current.slice(0, filteredPosts.length)
  }, [filteredPosts.length])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      if (e.key === "s" && searchInputRef.current) {
        e.preventDefault()
        searchInputRef.current.focus()
        return
      }

      if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault()
        setFocusedPostIndex((prev) => {
          const newIndex = prev <= 0 ? filteredPosts.length - 1 : prev - 1
          postRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth", block: "center" })
          return newIndex
        })
      } else if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault()
        setFocusedPostIndex((prev) => {
          const newIndex = prev === -1 ? 0 : prev >= filteredPosts.length - 1 ? 0 : prev + 1
          postRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth", block: "center" })
          return newIndex
        })
      } else if (e.key === "Enter" && focusedPostIndex !== -1) {
        e.preventDefault()
        router.push(`/blog/${filteredPosts[focusedPostIndex].slug}`)
      } else if (/^[1-9]$/.test(e.key) && Number.parseInt(e.key) <= filteredPosts.length) {
        e.preventDefault()
        const index = Number.parseInt(e.key) - 1
        setFocusedPostIndex(index)
        postRefs.current[index]?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [filteredPosts, focusedPostIndex, router])

  // Announce to screen readers when focus changes
  useEffect(() => {
    if (focusedPostIndex !== -1 && filteredPosts[focusedPostIndex]) {
      const post = filteredPosts[focusedPostIndex]
      const announcement = `Focused on post: ${post.title}. Press Enter to read.`

      const liveRegion = document.createElement("div")
      liveRegion.setAttribute("aria-live", "assertive")
      liveRegion.setAttribute("class", "sr-only")
      liveRegion.textContent = announcement
      document.body.appendChild(liveRegion)

      setTimeout(() => {
        if (document.body.contains(liveRegion)) {
          document.body.removeChild(liveRegion)
        }
      }, 1000)
    }
  }, [focusedPostIndex, filteredPosts])

  // Handle filter toggles with useCallback for stable references
  const toggleMoodFilter = useCallback((mood: string) => {
    setFilterMoods((prev) => (prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]))
    setFocusedPostIndex(-1)
  }, [])

  const toggleTagFilter = useCallback((tag: string) => {
    setFilterTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
    setFocusedPostIndex(-1)
  }, [])

  const toggleCategoryFilter = useCallback((category: string) => {
    setFilterCategories((prev) => (prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]))
    setFocusedPostIndex(-1)
  }, [])

  const toggleLanguageFilter = useCallback((language: string) => {
    // If this is the first modification, start with current filter languages
    setUserModifiedLanguageFilter((wasModified) => {
      if (!wasModified) {
        setManualFilterLanguages((prev) => {
          const currentFilters = prev.length > 0 ? prev : defaultLanguageFilter
          return currentFilters.includes(language)
            ? currentFilters.filter((l) => l !== language)
            : [...currentFilters, language]
        })
      } else {
        setManualFilterLanguages((prev) => (prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]))
      }
      return true
    })
    setFocusedPostIndex(-1)
  }, [defaultLanguageFilter])

  // Reset all filters with useCallback
  const resetFilters = useCallback(() => {
    setSearchQuery("")
    setSortOption("newest")
    setFilterMoods([])
    setFilterTags([])
    setFilterCategories([])
    setManualFilterLanguages([])
    setUserModifiedLanguageFilter(false)
    setFilterCatApproved(null)
    setFocusedPostIndex(-1)
    if (searchInputRef.current) {
      searchInputRef.current.value = ""
    }
  }, [])

  // Get current language for RSS feed
  const currentLanguage = currentLang
  const isValidLanguage = SUPPORTED_LANGUAGES.includes(currentLanguage as any)
  const rssLanguage = isValidLanguage ? currentLanguage : "en"

  // Map language codes to display names with i18n + safe fallback to endonyms
  const getLanguageName = useCallback((code: string): string => {
    if (!mounted) return LANGUAGE_NAMES[code as keyof typeof LANGUAGE_NAMES] || code
    return t(`language.${code}`, LANGUAGE_NAMES[code as keyof typeof LANGUAGE_NAMES] || code).toString()
  }, [mounted, t])

  // Helper to format date consistently
  const formatPostDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const locale = mounted ? currentLang : "en"
    return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (safeBlogPosts.length === 0) {
    return (
      <div className={`container mx-auto px-4 py-16 ${styles.visible}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">{mounted ? t("blog.title", STATIC_CONTENT.title) : STATIC_CONTENT.title}</h1>
          <p className="text-muted-foreground mb-8">{mounted ? t("blog.noPosts", STATIC_CONTENT.noPosts) : STATIC_CONTENT.noPosts}</p>
        </div>
      </div>
    )
  }

  // Count active filters
  const activeFilterCount =
    filterMoods.length +
    filterTags.length +
    filterCategories.length +
    filterLanguages.length +
    (filterCatApproved !== null ? 1 : 0)

  // Static fallback for no-JS: render a simple list of all English posts sorted by date
  if (!mounted) {
    // Filter to English posts for SSR, sorted by date
    const staticPosts = safeBlogPosts
      .filter(post => post.language === "en")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold">{STATIC_CONTENT.title}</h1>
            {/* Simple RSS link for no-JS users */}
            <a
              href="/rss.xml"
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <Rss className="h-4 w-4" />
              RSS
            </a>
          </div>

          {/* No-JS notice */}
          <noscript>
            <div className="mb-6 p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm text-muted-foreground">
                Enable JavaScript for search, filtering, and language selection features.
              </p>
            </div>
          </noscript>

          {/* Static blog post list */}
          <div className="space-y-6">
            {staticPosts.map((post) => (
              <div key={post.slug} className="h-entry">
                <Link href={`/blog/${post.slug}`} className="block group u-url">
                  <Card className="transition-all duration-300 hover:shadow-md border border-border group-hover:border-primary/50">
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors p-name">
                        {post.title}
                      </h2>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          <time className="dt-published" dateTime={post.date}>{formatPostDate(post.date)}</time>
                        </div>
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{post.readingTime} {STATIC_CONTENT.minRead}</span>
                      </div>
                      <Badge variant="outline">
                        {STATIC_CONTENT.mood}: {post.mood}
                      </Badge>
                      {post.language && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Globe className="h-3 w-3 mr-1" />
                          {getLanguageName(post.language)}
                        </Badge>
                      )}
                      {post.catApproved && (
                        <Badge variant="outline" className="flex items-center gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                          <Cat className="h-3 w-3" />
                          <span>{STATIC_CONTENT.cat}</span>
                        </Badge>
                      )}
                    </div>
                    {/* Category and Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.category && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 p-category">
                          {post.category}
                        </Badge>
                      )}
                      {post.tags?.map((tag) => (
                        <Badge key={tag} variant="outline" className="flex items-center gap-1 text-xs p-category">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground p-summary">{post.excerpt}</p>
                  </CardContent>
                </Card>
              </Link>
              {/* Hidden h-card for author information - outside Link to avoid nested anchors */}
              <div className="p-author h-card" style={{ display: 'none' }}>
                <span className="p-name" data-url="https://jarema.me">Jarema</span>
              </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`container mx-auto px-4 py-16 ${styles.fadeInFast}`}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">{t("blog.title", "Blog")}</h1>

          {/* RSS Feed Links */}
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1.5 bg-transparent">
                  <Rss className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("blog.rss", "RSS")}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72" align="end">
                <div className="space-y-4">
                  <h3 className="font-medium">{t("blog.subscribeRSS", "Subscribe via RSS")}</h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t("blog.allPosts", "All Posts")}</span>
                      <a
                        href="/rss.xml"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 px-2 py-1 rounded-md hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors flex items-center gap-1"
                      >
                        <Rss className="h-3 w-3" />
                        RSS
                      </a>
                    </div>

                    <div className="border-t pt-2">
                      <h4 className="text-sm font-medium mb-2">{t("blog.languageFeeds", "Language-specific feeds")}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <a
                            key={lang}
                            href={`/rss/${lang}.xml`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-xs px-2 py-1 rounded-md flex items-center justify-between hover:bg-muted transition-colors ${
                              lang === rssLanguage ? "bg-primary/10 font-medium" : ""
                            }`}
                          >
                            <span>{LANGUAGE_NAMES[lang as keyof typeof LANGUAGE_NAMES]}</span>
                            <Rss className="h-3 w-3 text-orange-600 dark:text-orange-400" />
                          </a>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mt-2">
                      {t(
                        "blog.rssDescription",
                        "Subscribe to these feeds in your favorite RSS reader to get notified about new posts.",
                      )}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Search and filter bar */}
        <div className={`mb-8 space-y-4 ${styles.visible}`} role="search" aria-label={t("blog.searchAndFilter", "Search and filter blog posts")}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <label htmlFor="blog-search" className="sr-only">{t("blog.search", "Search posts")}</label>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                ref={searchInputRef}
                id="blog-search"
                type="search"
                placeholder={t("blog.search", "Search posts...")}
                className="pl-10"
                value={searchQuery}
                aria-describedby="search-results-count"
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setFocusedPostIndex(-1)
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  onClick={() => {
                    setSearchQuery("")
                    setFocusedPostIndex(-1)
                  }}
                  aria-label={t("blog.clearSearch", "Clear search")}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>

            <Select value={sortOption} onValueChange={(value) => {
              setSortOption(value as SortOption)
              setFocusedPostIndex(-1)
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">
                  <div className="flex items-center">
                    <SortDesc className="mr-2 h-4 w-4" />
                    <span>{t("blog.sortNew", "Newest first")}</span>
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center">
                    <SortAsc className="mr-2 h-4 w-4" />
                    <span>{t("blog.sortOld", "Oldest first")}</span>
                  </div>
                </SelectItem>
                <SelectItem value="readingTime">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{t("blog.sortReadTime", "Reading time")}</span>
                  </div>
                </SelectItem>
                <SelectItem value="alphabetical">
                  <div className="flex items-center">
                    <SortAsc className="mr-2 h-4 w-4" />
                    <span>{t("blog.sortABC", "Alphabetical")}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  <span>{t("blog.filter", "Filter")}</span>
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                  <h3 className="font-medium">{t("blog.filterDescription", "Filter posts")}</h3>

                  {uniqueCategories.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">{t("blog.category", "Category")}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {uniqueCategories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${category}`}
                              checked={filterCategories.includes(category)}
                              onCheckedChange={() => toggleCategoryFilter(category)}
                            />
                            <Label htmlFor={`category-${category}`} className="text-sm">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {uniqueTags.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">{t("blog.tag", "Tags")}</h4>
                      <div className="flex flex-wrap gap-2">
                        {uniqueTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={filterTags.includes(tag) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleTagFilter(tag)}
                          >
                            {tag}
                            {filterTags.includes(tag) && (
                              <X
                                className="ml-1 h-3 w-3"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleTagFilter(tag)
                                }}
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">{t("blog.mood", "Mood")}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {uniqueMoods.map((mood) => (
                        <div key={mood} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mood-${mood}`}
                            checked={filterMoods.includes(mood)}
                            onCheckedChange={() => toggleMoodFilter(mood)}
                          />
                          <Label htmlFor={`mood-${mood}`} className="text-sm">
                            {mood}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {uniqueLanguages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">{t("blog.language", "Language")}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {uniqueLanguages.map((language) => (
                          <div key={language} className="flex items-center space-x-2">
                            <Checkbox
                              id={`language-${language}`}
                              checked={filterLanguages.includes(language)}
                              onCheckedChange={() => toggleLanguageFilter(language)}
                            />
                            <Label htmlFor={`language-${language}`} className="text-sm">
                              {getLanguageName(language)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">{t("blog.cat", "Cat Approved")}</h4>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cat-approved-yes"
                          checked={filterCatApproved === true}
                          onCheckedChange={() => {
                            setFilterCatApproved(filterCatApproved === true ? null : true)
                            setFocusedPostIndex(-1)
                          }}
                        />
                        <Label htmlFor="cat-approved-yes" className="text-sm">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="cat-approved-no"
                          checked={filterCatApproved === false}
                          onCheckedChange={() => {
                            setFilterCatApproved(filterCatApproved === false ? null : false)
                            setFocusedPostIndex(-1)
                          }}
                        />
                        <Label htmlFor="cat-approved-no" className="text-sm">
                          No
                        </Label>
                      </div>
                    </div>
                  </div>

                  <Button variant="ghost" size="sm" className="w-full" onClick={resetFilters}>
                    {t("blog.clearFilter", "Reset filters")}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Active filters display */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm text-muted-foreground">{t("blog.activeFilter", "Active filters:")}</span>

              {filterCategories.map((category) => (
                <Badge
                  key={`cat-${category}`}
                  variant="outline"
                  className="flex items-center gap-1 text-foreground"
                >
                  <span className="font-medium">{t("blog.category", "Category")}:</span> {category}
                  <button
                    onClick={() => toggleCategoryFilter(category)}
                    className="ml-1 hover:text-foreground"
                    aria-label={`Remove ${category} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              {filterTags.map((tag) => (
                <Badge
                  key={`tag-${tag}`}
                  variant="outline"
                  className="flex items-center gap-1 text-foreground"
                >
                  <span className="font-medium">{t("blog.tag", "Tag")}:</span> {tag}
                  <button
                    onClick={() => toggleTagFilter(tag)}
                    className="ml-1 hover:text-foreground"
                    aria-label={`Remove ${tag} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              {filterMoods.map((mood) => (
                <Badge key={`mood-${mood}`} variant="outline" className="flex items-center gap-1 text-foreground">
                  <span className="font-medium">{t("blog.mood", "Mood")}:</span> {mood}
                  <button
                    onClick={() => toggleMoodFilter(mood)}
                    className="ml-1 hover:text-foreground"
                    aria-label={`Remove ${mood} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              {filterLanguages.map((language) => (
                <Badge
                  key={`lang-${language}`}
                  variant="outline"
                  className="flex items-center gap-1 text-foreground"
                >
                  <span className="font-medium">{t("blog.language", "Language")}:</span> {getLanguageName(language)}
                  <button
                    onClick={() => toggleLanguageFilter(language)}
                    className="ml-1 hover:text-foreground"
                    aria-label={`Remove ${getLanguageName(language)} filter`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              {filterCatApproved !== null && (
                <Badge variant="outline" className="flex items-center gap-1 text-foreground">
                  <span className="font-medium">{t("blog.cat", "Cat Approved")}:</span>{" "}
                  {filterCatApproved ? "Yes" : "No"}
                  <button
                    onClick={() => {
                      setFilterCatApproved(null)
                      setFocusedPostIndex(-1)
                    }}
                    className="ml-1 hover:text-foreground"
                    aria-label="Remove cat approved filter"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={resetFilters}>
                {t("blog.clearFilter", "Clear all")}
              </Button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div id="search-results-count" className="mb-4 text-sm text-muted-foreground" aria-live="polite" aria-atomic="true">
          {filteredPosts.length === 0
            ? t("blog.noPosts", "No posts found")
            : t("blog.showingPosts", { current: filteredPosts.length, total: safeBlogPosts.length })}
        </div>

        {filteredPosts.length === 0 ? (
          <div
            className={`text-center py-12 bg-muted/20 rounded-lg ${styles.visible}`}
          >
            <p className="text-muted-foreground">
              {t("blog.filterNoMatch", "No posts match your filters. Try adjusting your search criteria.")}
            </p>
            <Button variant="link" onClick={resetFilters} className="mt-2">
              {t("blog.clearFilter", "Reset all filters")}
            </Button>
          </div>
        ) : (
          <div className={`space-y-6 ${styles.fadeIn}`}>
            {filteredPosts.map((post, index) => (
              <div
                key={post.slug}
                ref={el => { postRefs.current[index] = el }}
              >
                <BlogPostCard
                  post={post}
                  index={index}
                  isFocused={focusedPostIndex === index}
                  currentLang={currentLang}
                  getLanguageName={getLanguageName}
                  t={t}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
