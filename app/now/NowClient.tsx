"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import { Firefly } from "@/components/firefly"
import { nowItems } from "@/content/now-items"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function NowClientPage() {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [lastfmTrack, setLastfmTrack] = useState<{
    name: string
    artist: string
    url?: string
    nowplaying: boolean
    date?: string
  } | null>(null)
  const [lastfmError, setLastfmError] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fetch Last.fm recent tracks for "listening" section
  useEffect(() => {
    let interval: NodeJS.Timeout
    const fetchLastfm = async () => {
      try {
        const res = await fetch(
          "https://fm.jarema.me"
        )
        if (!res.ok) throw new Error("Failed to fetch Last.fm")
        const xml = await res.text()
        // Parse XML
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, "application/xml")
        const tracks = doc.getElementsByTagName("track")
        if (!tracks.length) return
        let track: Element | null = null
        let nowplaying = false
        // Find nowplaying track if exists
        for (let i = 0; i < tracks.length; i++) {
          if (tracks[i].getAttribute("nowplaying") === "true") {
            track = tracks[i]
            nowplaying = true
            break
          }
        }
        // Otherwise, use the first track
        if (!track) {
          track = tracks[0]
        }
        if (!track) return
        const name = track.getElementsByTagName("name")[0]?.textContent || ""
        const artist = track.getElementsByTagName("artist")[0]?.textContent || ""
        const url = track.getElementsByTagName("url")[0]?.textContent || ""
        let date: string | undefined = undefined
        if (!nowplaying) {
          const dateElem = track.getElementsByTagName("date")[0]
          if (dateElem) {
            // Use the "uts" attribute for timestamp
            const uts = dateElem.getAttribute("uts")
            if (uts) {
              date = new Date(Number(uts) * 1000).toLocaleString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: "short"
              })
            }
          }
        }
        setLastfmTrack({ name, artist, url, nowplaying, date })
        setLastfmError(false)
      } catch (e) {
        setLastfmError(true)
      }
    }
    fetchLastfm()
    interval = setInterval(fetchLastfm, 60000)
    return () => clearInterval(interval)
  }, [])

  // Add keyboard event listener for category navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle number keys 1-7
      if (e.key >= "1" && e.key <= "7") {
        e.preventDefault()
        const index = Number.parseInt(e.key) - 1
        const categories = Object.keys(groupedItems)

        if (index < categories.length) {
          const category = categories[index]
          const element = categoryRefs.current[category]

          if (element) {
            // Scroll to the category
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })

            // Add a brief highlight effect
            element.classList.add("ring-2", "ring-primary", "ring-offset-2")
            setTimeout(() => {
              element.classList.remove("ring-2", "ring-primary", "ring-offset-2")
            }, 1000)

            // Announce to screen readers
            const announcement = document.getElementById("category-announcement")
            if (announcement) {
              announcement.textContent = `Jumped to ${t(`now.categories.${category}`)} category`
              setTimeout(() => {
                announcement.textContent = ""
              }, 1000)
            }
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [t])

  if (!mounted) return null

  // Get the current language, default to English if not supported
  const currentLang = (() => {
    // Get the detected language
    const detectedLang = i18n.language || window.navigator.language?.split("-")[0] || "en"

    // Check if it's one of our supported languages
    if (["en", "vi", "et", "ru", "da", "tr", "zh"].includes(detectedLang)) {
      return detectedLang
    }

    // Handle language variants (e.g., en-US, en-GB)
    if (detectedLang.startsWith("en")) return "en"
    if (detectedLang.startsWith("vi")) return "vi"
    if (detectedLang.startsWith("et")) return "et"
    if (detectedLang.startsWith("ru")) return "ru"
    if (detectedLang.startsWith("da")) return "da"
    if (detectedLang.startsWith("tr")) return "tr"
    if (detectedLang.startsWith("zh")) return "zh"

    // Default fallback
    return "en"
  })()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Group items by category
  const groupedItems = nowItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, typeof nowItems>,
  )

  // Get unique categories with their icons
  const categories = Object.keys(groupedItems).map((category) => {
    const categoryItem = nowItems.find((item) => item.category === category)
    return {
      name: category,
      icon: categoryItem?.icon,
    }
  })

  // Compute latest last updated date, excluding "listening" if Lastfm is active
  const getLastUpdatedDate = () => {
    let items = nowItems
    if (lastfmTrack && !lastfmError) {
      items = nowItems.filter(item => item.category !== "listening")
    }
    const latest = items.reduce((acc, item) => {
      const d = new Date(item.date)
      return d > acc ? d : acc
    }, new Date(0))
    return latest
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {theme === "dark" && <Firefly count={15} />}

      {/* Screen reader announcement */}
      <div id="category-announcement" className="sr-only" aria-live="polite"></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("now.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("now.description")}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {t("now.lastUpdated")}: {getLastUpdatedDate().toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: "short"
              })}
            </p>
          </div>

          <motion.div className="space-y-8" variants={container} initial="hidden" animate="show">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <motion.div
                  key={category.name}
                  variants={item}
                  className="space-y-4"
                  ref={el => { categoryRefs.current[category.name] = el }}
                  id={`category-${category.name}`}
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className="bg-primary text-primary-foreground p-2 rounded-full">
                        <Icon className="h-5 w-5" />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold">{t(`now.categories.${category.name}`)}</h2>
                  </div>

                  <Card className="border border-border bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4">
                      {category.name === "listening" && lastfmTrack && !lastfmError ? (
                        <div className="border-b border-border last:border-0 pb-4 last:pb-0 flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span>
                              <a
                                href={lastfmTrack.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline"
                              >
                                {lastfmTrack.name}
                              </a>
                              {" "}
                              <span className="text-muted-foreground">by</span> {lastfmTrack.artist}
                            </span>
                            {lastfmTrack.nowplaying && (
                              <Badge variant="destructive" className="ml-2 animate-pulse">Live</Badge>
                            )}
                          </div>
                          {!lastfmTrack.nowplaying && lastfmTrack.date && (
                            <span className="text-xs text-muted-foreground">
                              {lastfmTrack.date}
                            </span>
                          )}
                        </div>
                      ) : category.name === "listening" && lastfmError ? (
                        // fallback to static content if error
                        groupedItems[category.name].map((item) => (
                          <div key={item.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                            <p className="mb-2">
                              {
                                item.content[currentLang as keyof typeof item.content] ||
                                  item.content.en
                              }
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                timeZoneName: "short"
                              })}
                            </p>
                          </div>
                        ))
                      ) : (
                        // ...existing code for other categories...
                        groupedItems[category.name].map((item) => (
                          <div key={item.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                            <p className="mb-2">
                              {
                                item.content[currentLang as keyof typeof item.content] ||
                                  item.content.en
                              }
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                timeZoneName: "short"
                              })}
                            </p>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
