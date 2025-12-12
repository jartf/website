"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { DarkModeFirefly } from "@/components/dark-mode-firefly"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMounted } from "@/hooks/use-mounted"
import {
  BookOpen,
  Code,
  Coffee,
  Headphones,
  Brain,
  GraduationCap,
  Lightbulb,
  Activity,
} from "lucide-react"
import type { SerializableNowItem, CategoryData } from "./types"

// Icon map for rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Code,
  Coffee,
  Headphones,
  Brain,
  GraduationCap,
  Lightbulb,
  Activity,
}

interface NowClientWrapperProps {
  items: SerializableNowItem[]
  groupedItems: Record<string, SerializableNowItem[]>
  categories: CategoryData[]
}

/**
 * Progress bar component for activities with start and end times
 */
function ProgressBar({
  start,
  end,
  currentTime,
}: {
  start: number
  end: number
  currentTime: number
}) {
  const total = end - start
  const elapsed = currentTime - start
  const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100)

  const timeRemaining = end - currentTime
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  return (
    <div className="space-y-1">
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(elapsed)}</span>
        {timeRemaining > 0 && <span>{formatTime(timeRemaining)} remaining</span>}
        {timeRemaining <= 0 && <span>Completed</span>}
      </div>
    </div>
  )
}

/**
 * The client-side wrapper component for the "Now" page.
 * Handles live API polling, animations, and keyboard navigation.
 */
export default function NowClientWrapper({
  items,
  groupedItems,
  categories,
}: NowClientWrapperProps) {
  const { t, i18n } = useTranslation()
  const mounted = useMounted()
  const categoryRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [lastfmTrack, setLastfmTrack] = useState<{
    name: string
    artist: string
    url?: string
    nowplaying: boolean
    date?: string
  } | null>(null)
  const [lastfmError, setLastfmError] = useState(false)
  const [premidActivities, setPremidActivities] = useState<
    Array<{
      name: string
      details?: string
      state?: string
      type: number
      timestamps?: {
        start?: number
        end?: number
      }
      assets?: {
        large_image?: string
        large_text?: string
        small_image?: string
        small_text?: string
      }
      buttons?: Array<{
        label: string
        url: string
      }>
    }>
  >([])
  const [premidError, setPremidError] = useState(false)
  const [currentTime, setCurrentTime] = useState(Date.now())

  // Update current time every second for progress bars
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch Last.fm recent tracks for "listening" section
  useEffect(() => {
    const fetchLastfm = async () => {
      try {
        const res = await fetch("/api/lastfm")
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
        const artist =
          track.getElementsByTagName("artist")[0]?.textContent || ""
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
                timeZoneName: "short",
              })
            }
          }
        }
        setLastfmTrack({ name, artist, url, nowplaying, date })
        setLastfmError(false)
      } catch (e) {
        console.error("Failed to fetch Last.fm data:", e)
        setLastfmError(true)
      }
    }
    fetchLastfm()
    const interval = setInterval(fetchLastfm, 15000)
    return () => clearInterval(interval)
  }, [])

  // Fetch PreMID activity
  useEffect(() => {
    const fetchPremid = async () => {
      try {
        const res = await fetch("/api/premid")
        if (!res.ok) throw new Error("Failed to fetch PreMID")
        const data = await res.json()
        if (data.activities && data.activities.length > 0) {
          setPremidActivities(data.activities.map((a: any) => a.activity))
          setPremidError(false)
        } else {
          setPremidActivities([])
        }
      } catch (e) {
        console.error("Failed to fetch PreMID data:", e)
        setPremidError(true)
      }
    }
    fetchPremid()
    const interval = setInterval(fetchPremid, 10000) // Poll every 10 seconds
    return () => clearInterval(interval)
  }, [])

  // Add keyboard event listener for category navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle number keys 1-7
      if (e.key >= "1" && e.key <= "7") {
        e.preventDefault()
        const index = Number.parseInt(e.key) - 1
        const categoryNames = Object.keys(groupedItems)

        if (index < categoryNames.length) {
          const category = categoryNames[index]
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
              element.classList.remove(
                "ring-2",
                "ring-primary",
                "ring-offset-2"
              )
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
  }, [t, groupedItems])

  if (!mounted) {
    // Static content for no-JS users
    const staticCategoryNames: Record<string, string> = {
      reading: "Reading",
      learning: "Learning",
      thinking: "Thinking",
      working: "Working",
      listening: "Listening",
      premid: "Activity",
      other: "Other",
    }

    // Compute latest last updated date for static display
    const getStaticLastUpdatedDate = () => {
      const latest = items.reduce((acc, item) => {
        const d = new Date(item.date)
        return d > acc ? d : acc
      }, new Date(0))
      return latest.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    return (
      <main className="relative min-h-screen w-full overflow-hidden">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Now</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                What I&apos;m currently doing, thinking about, and focusing on.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Last updated: {getStaticLastUpdatedDate()}
              </p>
            </div>

            <div className="space-y-8">
              {categories.map((category) => {
                const Icon = iconMap[category.iconName]
                return (
                  <div key={category.name} className="space-y-4">
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <div className="bg-primary text-primary-foreground p-2 rounded-full">
                          <Icon className="h-5 w-5" />
                        </div>
                      )}
                      <h2 className="text-2xl font-bold">
                        {staticCategoryNames[category.name] || category.name}
                      </h2>
                    </div>

                    <Card className="border border-border bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6 space-y-4">
                        {groupedItems[category.name]?.map((item) => (
                          <div
                            key={item.id}
                            className="border-b border-border last:border-0 pb-4 last:pb-0"
                          >
                            <p className="mb-2">
                              {item.content.en}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Get the current language, default to English if not supported
  const currentLang = (() => {
    // Get the detected language
    const detectedLang =
      i18n.language || window.navigator.language?.split("-")[0] || "en"

    // Check if it's one of our supported languages
    if (
      ["en", "vi", "et", "ru", "da", "tr", "zh", "pl", "sv", "fi", "tok", "vih"].includes(
        detectedLang
      )
    ) {
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
    if (detectedLang.startsWith("pl")) return "pl"
    if (detectedLang.startsWith("sv")) return "sv"
    if (detectedLang.startsWith("fi")) return "fi"

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

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Compute latest last updated date, excluding "listening" if Lastfm is active
  const getLastUpdatedDate = () => {
    let filteredItems = items
    if (lastfmTrack && !lastfmError) {
      filteredItems = items.filter((item) => item.category !== "listening")
    }
    const latest = filteredItems.reduce((acc, item) => {
      const d = new Date(item.date)
      return d > acc ? d : acc
    }, new Date(0))
    return latest
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <DarkModeFirefly count={15} />

      {/* Screen reader announcement */}
      <div
        id="category-announcement"
        className="sr-only"
        aria-live="polite"
      ></div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("now.title")}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("now.description")}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t("now.lastUpdated")}:{" "}
              {getLastUpdatedDate().toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                timeZoneName: "short",
              })}
            </p>
          </div>

          <motion.div
            className="space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {categories.map((category) => {
              const Icon = iconMap[category.iconName]
              return (
                <motion.div
                  key={category.name}
                  variants={itemVariant}
                  className="space-y-4"
                  ref={(el) => {
                    categoryRefs.current[category.name] = el
                  }}
                  id={`category-${category.name}`}
                  tabIndex={0}
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className="bg-primary text-primary-foreground p-2 rounded-full">
                        <Icon className="h-5 w-5" />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold">
                      {t(`now.categories.${category.name}`)}
                    </h2>
                  </div>

                  <Card className="border border-border bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-6 space-y-4">
                      {category.name === "premid" &&
                      premidActivities.length > 0 &&
                      !premidError ? (
                        premidActivities.map((premidActivity, activityIndex) => (
                          <div
                            key={activityIndex}
                            className="border-b border-border last:border-0 pb-4 last:pb-0"
                          >
                            <div className="flex flex-col gap-3">
                              {/* Activity header */}
                              <div className="flex items-start gap-3">
                                {premidActivity.assets?.large_image && (
                                  <div className="relative w-16 h-16 flex-shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={premidActivity.assets.large_image}
                                      alt={
                                        premidActivity.assets.large_text ||
                                        premidActivity.name
                                      }
                                      className="w-16 h-16 rounded-lg"
                                      title={premidActivity.assets.large_text}
                                    />
                                    {premidActivity.assets.small_image && (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={premidActivity.assets.small_image}
                                        alt={
                                          premidActivity.assets.small_text || ""
                                        }
                                        className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-1 border-background bg-background"
                                        title={premidActivity.assets.small_text}
                                      />
                                    )}
                                  </div>
                                )}
                                <div className="flex-1 min-w-0 -mt-1.5">
                                  <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-semibold break-words">
                                      {premidActivity.name}
                                    </span>
                                    <Badge
                                      variant="default"
                                      className="animate-pulse flex-shrink-0"
                                    >
                                      Live
                                    </Badge>
                                  </div>
                                  {premidActivity.details && (
                                    <p className="text-sm">
                                      {premidActivity.details}
                                    </p>
                                  )}
                                  {premidActivity.state && (
                                    <p className="text-sm text-muted-foreground">
                                      {premidActivity.state}
                                    </p>
                                  )}
                                  {premidActivity.assets?.small_text && (
                                    <p className="text-xs text-muted-foreground italic">
                                      {premidActivity.assets.small_text}
                                    </p>
                                  )}
                                  {/* Timestamps */}
                                  {premidActivity.timestamps && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {premidActivity.timestamps.start && (
                                        <>
                                          Started:{" "}
                                          {new Date(
                                            premidActivity.timestamps.start
                                          ).toLocaleTimeString()}
                                        </>
                                      )}
                                      {premidActivity.timestamps.end && (
                                        <>
                                          {" "}
                                          • Ends:{" "}
                                          {new Date(
                                            premidActivity.timestamps.end
                                          ).toLocaleTimeString()}
                                        </>
                                      )}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {/* Progress bar for activities with start and end times */}
                              {premidActivity.timestamps?.start &&
                                premidActivity.timestamps?.end && (
                                  <ProgressBar
                                    start={premidActivity.timestamps.start}
                                    end={premidActivity.timestamps.end}
                                    currentTime={currentTime}
                                  />
                                )}
                              {/* Buttons */}
                              {premidActivity.buttons &&
                                premidActivity.buttons.length > 0 && (
                                  <div className="flex gap-2 flex-wrap">
                                    {premidActivity.buttons.map((button, idx) => (
                                      <a
                                        key={idx}
                                        href={button.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                                      >
                                        {button.label}
                                      </a>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </div>
                        ))
                      ) : category.name === "listening" &&
                        lastfmTrack &&
                        !lastfmError ? (
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
                              </a>{" "}
                              <span className="text-muted-foreground">by</span>{" "}
                              {lastfmTrack.artist}
                            </span>
                            {lastfmTrack.nowplaying && (
                              <Badge
                                variant="destructive"
                                className="ml-2 animate-pulse"
                              >
                                Live
                              </Badge>
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
                          <div
                            key={item.id}
                            className="border-b border-border last:border-0 pb-4 last:pb-0"
                          >
                            <p className="mb-2">
                              {item.content[
                                currentLang as keyof typeof item.content
                              ] || item.content.en}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                timeZoneName: "short",
                              })}
                            </p>
                          </div>
                        ))
                      ) : (
                        // Default rendering for other categories
                        groupedItems[category.name].map((item) => (
                          <div
                            key={item.id}
                            className="border-b border-border last:border-0 pb-4 last:pb-0"
                          >
                            <p className="mb-2">
                              {item.content[
                                currentLang as keyof typeof item.content
                              ] || item.content.en}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(item.date).toLocaleString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                timeZoneName: "short",
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
