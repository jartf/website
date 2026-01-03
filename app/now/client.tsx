"use client"

import { useState, useEffect, useRef, memo } from "react"
import { useTranslation } from "react-i18next"
import { DarkModeFirefly } from "@/components/firefly"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMounted, useCurrentLanguage, useReducedMotion } from "@/hooks"
import { CategoryHeader, TranslatedPageHeader } from "@/components/translated-text"
import { NOW_ICONS, NOW_STATIC_CATEGORIES } from "@/lib/icons"
import type { NowItemContent } from "@/content/now-items"

// Types for serializable data from server
export type SerializableNowItem = {
  id: number
  category: string
  iconName: string
  content: NowItemContent
  date: string
}

export type CategoryData = {
  name: string
  iconName: string
}

interface NowClientWrapperProps {
  items: SerializableNowItem[]
  groupedItems: Record<string, SerializableNowItem[]>
  categories: CategoryData[]
}

// Icon map for rendering - use shared NOW_ICONS
const iconMap = NOW_ICONS

// Static category name mappings - use shared NOW_STATIC_CATEGORIES
const staticCategoryNames = NOW_STATIC_CATEGORIES

function CategoryCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="border border-border bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">{children}</CardContent>
    </Card>
  )
}

function getLatestUpdateDate(items: SerializableNowItem[]) {
  return items.reduce((acc, item) => {
    const d = new Date(item.date)
    return d > acc ? d : acc
  }, new Date(0))
}

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

export default memo(function NowClientWrapper({
  items,
  groupedItems,
  categories,
}: NowClientWrapperProps) {
  const { t } = useTranslation()
  const mounted = useMounted()
  const currentLang = useCurrentLanguage()
  const prefersReducedMotion = useReducedMotion()
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

  // Fetch Last.fm recent tracks
  useEffect(() => {
    const fetchLastfm = async () => {
      try {
        const res = await fetch("/api/lastfm")
        if (!res.ok) throw new Error("Failed to fetch Last.fm")
        const xml = await res.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(xml, "application/xml")
        const tracks = doc.getElementsByTagName("track")
        if (!tracks.length) return
        let track: Element | null = null
        let nowplaying = false
        for (let i = 0; i < tracks.length; i++) {
          if (tracks[i].getAttribute("nowplaying") === "true") {
            track = tracks[i]
            nowplaying = true
            break
          }
        }
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
          setPremidActivities(
            data.activities.map((a: { activity: unknown }) => a.activity)
          )
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
    const interval = setInterval(fetchPremid, 10000)
    return () => clearInterval(interval)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "7") {
        e.preventDefault()
        const index = Number.parseInt(e.key) - 1
        const categoryNames = Object.keys(groupedItems)

        if (index < categoryNames.length) {
          const category = categoryNames[index]
          const element = categoryRefs.current[category]

          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })

            element.classList.add("ring-2", "ring-primary", "ring-offset-2")
            setTimeout(() => {
              element.classList.remove(
                "ring-2",
                "ring-primary",
                "ring-offset-2"
              )
            }, 1000)

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

  // Static content for no-JS users
  if (!mounted) {
    const lastUpdated = getLatestUpdateDate(items)

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
                Last updated:{" "}
                {lastUpdated.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="space-y-8">
              {categories.map((category) => (
                <div key={category.name} className="space-y-4">
                  <CategoryHeader
                    iconName={category.iconName}
                    iconMap={iconMap}
                    title={staticCategoryNames[category.name] || category.name}
                  />

                  <CategoryCard>
                    {groupedItems[category.name]?.map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-border last:border-0 pb-4 last:pb-0"
                      >
                        <p className="mb-2">{item.content.en}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    ))}
                  </CategoryCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  const getLastUpdatedDate = () => {
    let filteredItems = items
    if (lastfmTrack && !lastfmError) {
      filteredItems = items.filter((item) => item.category !== "listening")
    }
    return getLatestUpdateDate(filteredItems)
  }

  const renderNowItem = (item: SerializableNowItem) => (
    <div
      key={item.id}
      className="border-b border-border last:border-0 pb-4 last:pb-0"
    >
      <p className="mb-2">
        {item.content[currentLang as keyof typeof item.content] ||
          item.content.en}
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
  )

  const renderPremidActivity = (
    premidActivity: (typeof premidActivities)[0],
    activityIndex: number
  ) => (
    <div
      key={activityIndex}
      className="border-b border-border last:border-0 pb-4 last:pb-0"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          {premidActivity.assets?.large_image && (
            <div className="relative w-16 h-16 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={premidActivity.assets.large_image}
                alt={premidActivity.assets.large_text || premidActivity.name}
                className="w-16 h-16 rounded-lg"
                title={premidActivity.assets.large_text}
              />
              {premidActivity.assets.small_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={premidActivity.assets.small_image}
                  alt={premidActivity.assets.small_text || ""}
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
              <Badge variant="default" className="animate-pulse flex-shrink-0">
                Live
              </Badge>
            </div>
            {premidActivity.details && (
              <p className="text-sm">{premidActivity.details}</p>
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
        {premidActivity.timestamps?.start && premidActivity.timestamps?.end && (
          <ProgressBar
            start={premidActivity.timestamps.start}
            end={premidActivity.timestamps.end}
            currentTime={currentTime}
          />
        )}
        {premidActivity.buttons && premidActivity.buttons.length > 0 && (
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
  )

  const renderLastfmTrack = () => (
    <div className="border-b border-border last:border-0 pb-4 last:pb-0 flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span>
          <a
            href={lastfmTrack?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {lastfmTrack?.name}
          </a>{" "}
          <span className="text-muted-foreground">by</span>{" "}
          {lastfmTrack?.artist}
        </span>
        {lastfmTrack?.nowplaying && (
          <Badge variant="destructive" className="ml-2 animate-pulse">
            Live
          </Badge>
        )}
      </div>
      {!lastfmTrack?.nowplaying && lastfmTrack?.date && (
        <span className="text-xs text-muted-foreground">{lastfmTrack.date}</span>
      )}
    </div>
  )

  const renderCategoryContent = (category: CategoryData) => {
    if (
      category.name === "premid" &&
      premidActivities.length > 0 &&
      !premidError
    ) {
      return premidActivities.map(renderPremidActivity)
    }

    if (category.name === "listening" && lastfmTrack && !lastfmError) {
      return renderLastfmTrack()
    }

    return groupedItems[category.name]?.map(renderNowItem)
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <DarkModeFirefly count={15} />

      <div
        id="category-announcement"
        className="sr-only"
        aria-live="polite"
      />

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

          <div className="space-y-8">
            {categories.map((category, categoryIndex) => (
              <div
                key={category.name}
                className="space-y-4"
                ref={(el) => {
                  categoryRefs.current[category.name] = el
                }}
                id={`category-${category.name}`}
                tabIndex={0}
                style={{
                  animation: prefersReducedMotion
                    ? "none"
                    : `fadeInUp 0.5s ease-out ${categoryIndex * 0.1}s both`,
                }}
              >
                <CategoryHeader
                  iconName={category.iconName}
                  iconMap={iconMap}
                  title={t(`now.categories.${category.name}`)}
                />

                <CategoryCard>{renderCategoryContent(category)}</CategoryCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
})
