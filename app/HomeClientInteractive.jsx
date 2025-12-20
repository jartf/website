"use client"

import { useEffect, useState, memo } from "react"
import { useTranslation } from "react-i18next"
import { useMounted, useReducedMotion } from "@/hooks"
import { nowItems } from "@/content/now-items"
import { LucideHeadphones, Activity } from "lucide-react"

// Memoized activity card component to prevent re-renders
const ActivityCard = memo(function ActivityCard({ activity }) {
  return (
    <div className="flex items-center gap-3">
      {activity.assets?.large_image && (
        <div className="relative w-12 h-12 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activity.assets.large_image}
            alt={activity.assets.large_text || activity.name}
            className="w-12 h-12 rounded-lg"
            title={activity.assets.large_text}
            loading="lazy"
          />
          {activity.assets?.small_image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activity.assets.small_image}
              alt={activity.assets.small_text || ""}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-1 border-background bg-background"
              title={activity.assets.small_text}
              loading="lazy"
            />
          )}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className="font-semibold break-words">{activity.name}</span>
        {activity.details && <p className="text-sm break-words">{activity.details}</p>}
        {activity.state && <p className="text-sm text-muted-foreground break-words">{activity.state}</p>}
      </div>
    </div>
  )
})

/**
 * Client component for the "What I'm up to now" section that requires API fetching
 * This is separated from the main Home page to keep the parent server-rendered
 */
export function NowSection({ initialData }) {
  const { t, i18n } = useTranslation()
  const [latestNow, setLatestNow] = useState(null)
  const [lastfmTrack, setLastfmTrack] = useState(null)
  const [lastfmError, setLastfmError] = useState(false)
  const [premidActivities, setPremidActivities] = useState([])
  const [premidError, setPremidError] = useState(false)
  const mounted = useMounted()

  // Fetch Last.fm recent track with AbortController for cleanup
  useEffect(() => {
    if (!mounted) return

    let ignore = false
    const controller = new AbortController()

    const fetchLastfm = async () => {
      try {
        const res = await fetch("/api/lastfm", { signal: controller.signal })
        if (!res.ok) throw new Error("Failed to fetch Last.fm")
        const xml = await res.text()
        const parser = new window.DOMParser()
        const doc = parser.parseFromString(xml, "application/xml")
        const tracks = doc.getElementsByTagName("track")
        if (!tracks.length) return

        let track = null
        let nowplaying = false
        for (let i = 0; i < tracks.length; i++) {
          if (tracks[i].getAttribute("nowplaying") === "true") {
            track = tracks[i]
            nowplaying = true
            break
          }
        }
        if (!track) track = tracks[0]
        if (!track) return

        const name = track.getElementsByTagName("name")[0]?.textContent || ""
        const artist = track.getElementsByTagName("artist")[0]?.textContent || ""
        const url = track.getElementsByTagName("url")[0]?.textContent || ""
        let date = undefined
        let dateObj = undefined

        if (!nowplaying) {
          const dateElem = track.getElementsByTagName("date")[0]
          if (dateElem) {
            const uts = dateElem.getAttribute("uts")
            if (uts) {
              dateObj = new Date(Number(uts) * 1000)
              date = dateObj.toLocaleString(undefined, {
                year: "numeric", month: "long", day: "numeric",
                hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short"
              })
            }
          }
        } else {
          dateObj = new Date()
        }

        if (!ignore) {
          setLastfmTrack({ name, artist, url, nowplaying, date, dateObj })
          setLastfmError(false)
        }
      } catch (e) {
        if (!ignore && e.name !== 'AbortError') setLastfmError(true)
      }
    }

    fetchLastfm()
    return () => {
      ignore = true
      controller.abort()
    }
  }, [mounted])

  // Fetch PreMID activity with AbortController for cleanup
  useEffect(() => {
    if (!mounted) return

    let ignore = false
    const controller = new AbortController()

    const fetchPremid = async () => {
      try {
        const res = await fetch("/api/premid", { signal: controller.signal })
        if (!res.ok) throw new Error("Failed to fetch PreMID")
        const data = await res.json()

        if (!ignore) {
          if (data.activities && data.activities.length > 0) {
            setPremidActivities(data.activities.map((a) => a.activity))
            setPremidError(false)
          } else {
            setPremidActivities([])
          }
        }
      } catch (e) {
        if (!ignore && e.name !== 'AbortError') setPremidError(true)
      }
    }

    fetchPremid()
    return () => {
      ignore = true
      controller.abort()
    }
  }, [mounted])

  // Compute latest 3 now entries (compare with Last.fm and PreMID)
  useEffect(() => {
    if (!mounted) return

    const currentLang = i18n.language?.split("-")[0] || "en"
    let filteredNow = nowItems.filter(item =>
      (item.content && (item.content[currentLang] || item.content.en))
    )
    if (lastfmTrack && !lastfmError) {
      filteredNow = filteredNow.filter(item => item.category !== "listening")
    }
    if (premidActivities.length > 0 && !premidError) {
      filteredNow = filteredNow.filter(item => item.category !== "premid")
    }

    // Get latest 3 items sorted by date
    const latestItems = filteredNow
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map(item => ({
        type: "nowitem",
        icon: item.icon,
        title: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        content: item.content[currentLang] || item.content.en,
        date: item.date,
      }))

    const items = []
    const lastfmLive = lastfmTrack && lastfmTrack.nowplaying && !lastfmError
    const premidLive = premidActivities.length > 0 && !premidError

    // Add live Last.fm if available
    if (lastfmLive) {
      items.push({
        type: "lastfm",
        name: lastfmTrack.name,
        artist: lastfmTrack.artist,
        url: lastfmTrack.url,
        nowplaying: lastfmTrack.nowplaying,
        date: lastfmTrack.date,
        dateObj: lastfmTrack.dateObj
      })
    } else if (lastfmTrack && lastfmTrack.dateObj && !lastfmError) {
      // Add recent Last.fm track if not live
      items.push({
        type: "lastfm",
        name: lastfmTrack.name,
        artist: lastfmTrack.artist,
        url: lastfmTrack.url,
        nowplaying: false,
        date: lastfmTrack.date,
        dateObj: lastfmTrack.dateObj
      })
    }

    // Add live PreMID if available
    if (premidLive) {
      items.push({
        type: "premid",
        activities: premidActivities
      })
    }

    // Add the latest now items
    items.push(...latestItems)

    // Take only the first 3 items
    setLatestNow(items.slice(0, 3))
  }, [mounted, i18n.language, lastfmTrack, lastfmError, premidActivities, premidError])

  // Display server-rendered content before JavaScript loads
  if (!mounted) {
    if (!initialData || !Array.isArray(initialData) || initialData.length === 0) return null

    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-center">
          <a href="/now" tabIndex={-1} className="no-underline hover:underline focus:underline" style={{ color: "inherit" }}>
            What I&apos;m up to now
          </a>
        </h2>
        <div className="border rounded-lg p-5 bg-card space-y-4">
          {initialData.map((item, index) => (
            <div key={index} className={index < initialData.length - 1 ? "border-b border-border pb-4" : ""}>
              <div className="flex items-center gap-2 font-semibold mb-1">
                {item.title}
              </div>
              <div className="mb-1">{item.content}</div>
              <div className="text-xs text-muted-foreground">
                {/* Use ISO date string to avoid hydration mismatch from toLocaleString */}
                {item.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!latestNow || !Array.isArray(latestNow) || latestNow.length === 0) {
    return null
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-center">
        <a href="/now" tabIndex={-1} className="no-underline hover:underline focus:underline" style={{ color: "inherit" }}>
          {t("home.latestNow", "What I&apos;m up to now")}
        </a>
      </h2>
      <div className="border rounded-lg p-5 bg-card space-y-4 max-h-[415px] lg:overflow-y-auto">
        {latestNow.map((item, index) => {
          const isLast = index === latestNow.length - 1

          if (item.type === "lastfm") {
            return (
              <div key={index} className={!isLast ? "border-b border-border pb-4" : ""}>
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <LucideHeadphones className="w-5 h-5 text-primary" />
                  {t("now.categories.listening", "Listening")}
                  {item.nowplaying && (
                    <span className="ml-2 text-s text-red-500">Live</span>
                  )}
                </div>
                <span>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline font-semibold"
                  >
                    {item.name}
                  </a>
                  {" "}
                  <span className="text-muted-foreground">by</span> {item.artist}
                </span>
                {item.date && !item.nowplaying && (
                  <div className="text-xs text-muted-foreground mt-1">{item.date}</div>
                )}
              </div>
            )
          } else if (item.type === "premid") {
            return (
              <div key={index} className={!isLast ? "border-b border-border pb-4" : ""}>
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <Activity className="w-5 h-5 text-primary" />
                  {t("now.categories.premid", "PreMID")}
                  <span className="ml-2 text-s text-red-500">Live</span>
                </div>
                <div className="space-y-3">
                  {item.activities.map((activity, idx) => (
                    <ActivityCard key={idx} activity={activity} />
                  ))}
                </div>
              </div>
            )
          } else {
            return (
              <div key={index} className={!isLast ? "border-b border-border pb-4" : ""}>
                <div className="flex items-center gap-2 font-semibold mb-1">
                  {item.icon && <item.icon className="w-5 h-5 text-primary" />}
                  {item.title}
                </div>
                <div className="mb-1">{item.content}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(item.date).toLocaleString(i18n.language || "en", {
                    year: "numeric", month: "long", day: "numeric",
                    hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short"
                  })}
                </div>
              </div>
            )
          }
        })}
      </div>
    </div>
  )
}

/**
 * Client component for greeting that depends on time of day
 */
export const Greeting = memo(function Greeting() {
  const { t } = useTranslation()
  const mounted = useMounted()
  const [greeting, setGreeting] = useState("Welcome, traveler.")

  // Update greeting after mount to avoid hydration mismatch
  useEffect(() => {
    if (!mounted) return

    const hour = new Date().getHours()
    let newGreeting
    if (hour >= 5 && hour < 12) {
      newGreeting = t("greetings.morning", "Good morning, traveler.")
    } else if (hour >= 12 && hour < 18) {
      newGreeting = t("greetings.afternoon", "Good afternoon, wanderer.")
    } else if (hour >= 18 && hour < 22) {
      newGreeting = t("greetings.evening", "Good evening, explorer.")
    } else {
      newGreeting = t("greetings.night", "Still awake? Me too.")
    }
    queueMicrotask(() => setGreeting(newGreeting))
  }, [t, mounted])

  return <p className="text-lg md:text-xl text-muted-foreground mb-4">{greeting}</p>
})

/**
 * Client component for animated hero section elements - uses CSS animations instead of framer-motion
 */
export const AnimatedHeroContent = memo(function AnimatedHeroContent({ children, delay = 0 }) {
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()

  if (!mounted || prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <div
      className="animate-fade-in-up"
      style={{
        animationDelay: `${delay}s`,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  )
})

/**
 * Client component for translated text with hydration safety
 */
export const TranslatedText = memo(function TranslatedText({ i18nKey, fallback }) {
  const { t } = useTranslation()
  const mounted = useMounted()

  if (!mounted) {
    return <>{fallback}</>
  }

  return <>{t(i18nKey, fallback)}</>
})

/**
 * Loading spinner for translation loading state
 */
export function TranslationLoadingSpinner() {
  const mounted = useMounted()

  if (!mounted) return null

  return null // Translations load synchronously, no spinner needed
}
