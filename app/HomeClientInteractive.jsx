"use client"

import { useEffect, useState, useMemo, memo } from "react"
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
export function NowSection() {
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

  // Compute latest now entry (compare with Last.fm and PreMID)
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

    let latest = null
    for (const item of filteredNow) {
      if (!latest || new Date(item.date) > new Date(latest.date)) {
        latest = item
      }
    }

    const lastfmLive = lastfmTrack && lastfmTrack.nowplaying && !lastfmError
    const premidLive = premidActivities.length > 0 && !premidError

    if (lastfmLive && premidLive) {
      setLatestNow({
        type: "both-live",
        lastfm: {
          name: lastfmTrack.name,
          artist: lastfmTrack.artist,
          url: lastfmTrack.url,
          nowplaying: lastfmTrack.nowplaying,
          date: lastfmTrack.date,
          dateObj: lastfmTrack.dateObj
        },
        premid: premidActivities
      })
      return
    }

    if (premidLive) {
      setLatestNow({
        type: "premid",
        activities: premidActivities
      })
      return
    }

    if (lastfmTrack && lastfmTrack.dateObj && !lastfmError) {
      if (!latest || lastfmTrack.dateObj > new Date(latest.date)) {
        setLatestNow({
          type: "lastfm",
          name: lastfmTrack.name,
          artist: lastfmTrack.artist,
          url: lastfmTrack.url,
          nowplaying: lastfmTrack.nowplaying,
          date: lastfmTrack.date,
          dateObj: lastfmTrack.dateObj
        })
        return
      }
    }

    if (latest) {
      setLatestNow({
        type: "nowitem",
        ...latest,
        content: latest.content[currentLang] || latest.content.en
      })
    }
  }, [mounted, i18n.language, lastfmTrack, lastfmError, premidActivities, premidError])

  if (!mounted || !latestNow) {
    return null
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <a href="/now" tabIndex={-1} className="no-underline hover:underline focus:underline" style={{ color: "inherit" }}>
          {t("home.latestNow", "What I'm up to now")}
        </a>
      </h2>
      <div className="border rounded-lg p-5 bg-card space-y-4">
        {latestNow.type === "both-live" ? (
          <>
            <div className="border-b border-border pb-4">
              <div className="flex items-center gap-2 font-semibold mb-1">
                <LucideHeadphones className="w-5 h-5 text-primary" />
                {t("now.categories.listening", "Listening")}
                <span className="ml-2 text-s text-red-500">Live</span>
              </div>
              <span>
                <a
                  href={latestNow.lastfm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline font-semibold"
                >
                  {latestNow.lastfm.name}
                </a>
                {" "}
                <span className="text-muted-foreground">by</span> {latestNow.lastfm.artist}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 font-semibold mb-1">
                <Activity className="w-5 h-5 text-primary" />
                {t("now.categories.premid", "PreMID")}
                <span className="ml-2 text-s text-red-500">Live</span>
              </div>
              <div className="space-y-3">
                {latestNow.premid.map((activity, idx) => (
                  <ActivityCard key={idx} activity={activity} />
                ))}
              </div>
            </div>
          </>
        ) : latestNow.type === "lastfm" ? (
          <div>
            <div className="flex items-center gap-2 font-semibold mb-1">
              <LucideHeadphones className="w-5 h-5 text-primary" />
              {t("now.categories.listening", "Listening")}
              {latestNow.nowplaying && (
                <span className="ml-2 text-s text-red-500">Live</span>
              )}
            </div>
            <span>
              <a
                href={latestNow.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline font-semibold"
              >
                {latestNow.name}
              </a>
              {" "}
              <span className="text-muted-foreground">by</span> {latestNow.artist}
            </span>
            {latestNow.date && (
              <div className="text-xs text-muted-foreground mt-1">{latestNow.date}</div>
            )}
          </div>
        ) : latestNow.type === "premid" ? (
          <div>
            <div className="flex items-center gap-2 font-semibold mb-1">
              <Activity className="w-5 h-5 text-primary" />
              {t("now.categories.premid", "PreMID")}
              <span className="ml-2 text-s text-red-500">Live</span>
            </div>
            <div className="space-y-3">
              {latestNow.activities.map((activity, idx) => (
                <ActivityCard key={idx} activity={activity} />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 font-semibold mb-1">
              {latestNow.icon && <latestNow.icon className="w-5 h-5 text-primary" />}
              {latestNow.title}
            </div>
            <div className="mb-1">{latestNow.content}</div>
            <div className="text-xs text-muted-foreground">{new Date(latestNow.date).toLocaleString(i18n.language || "en", {
              year: "numeric", month: "long", day: "numeric",
              hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short"
            })}</div>
          </div>
        )}
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

  // Compute greeting based on current hour - this is synchronous and safe
  const greeting = useMemo(() => {
    if (!mounted) return "Welcome, traveler."

    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      return t("greetings.morning", "Good morning, traveler.")
    } else if (hour >= 12 && hour < 18) {
      return t("greetings.afternoon", "Good afternoon, wanderer.")
    } else if (hour >= 18 && hour < 22) {
      return t("greetings.evening", "Good evening, explorer.")
    } else {
      return t("greetings.night", "Still awake? Me too.")
    }
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
