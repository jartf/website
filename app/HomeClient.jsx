"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useTheme } from "next-themes"
import Link from "next/link"
import { MoodCat } from "@/components/mood-cat"
import { EasterEgg } from "@/components/easter-egg"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useMounted } from "@/hooks/use-mounted"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useTranslationReady } from "@/hooks/use-translation-ready"
import { nowItems } from "@/content/now-items"
import { LucideHeadphones } from "lucide-react"

/**
 * Home page client component
 * @returns {JSX.Element} The home page component
 */
export default function Home({ blogPosts = [] }) {
  const { t, i18n } = useTranslation()
  const { theme } = useTheme()
  const [greeting, setGreeting] = useState("")
  const [latestNow, setLatestNow] = useState(null)
  const [lastfmTrack, setLastfmTrack] = useState(null)
  const [lastfmError, setLastfmError] = useState(false)
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()
  const isTranslationReady = useTranslationReady()

  useEffect(() => {
    if (mounted) {
      const hour = new Date().getHours()

      if (hour >= 5 && hour < 12) {
        setGreeting(t("greetings.morning", "Good morning, traveler."))
      } else if (hour >= 12 && hour < 18) {
        setGreeting(t("greetings.afternoon", "Good afternoon, wanderer."))
      } else if (hour >= 18 && hour < 22) {
        setGreeting(t("greetings.evening", "Good evening, explorer."))
      } else {
        setGreeting(t("greetings.night", "Still awake? Me too."))
      }
    }
  }, [t, mounted])

  // Fetch Last.fm recent track
  useEffect(() => {
    let ignore = false
    const fetchLastfm = async () => {
      try {
        const res = await fetch(
          "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=jerryvu&api_key=c8526c48e3bd3c6f35e365480426f1be"
        )
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
        } else {
          dateObj = new Date()
        }
        if (!ignore) {
          setLastfmTrack({ name, artist, url, nowplaying, date, dateObj })
          setLastfmError(false)
        }
      } catch (e) {
        if (!ignore) setLastfmError(true)
      }
    }
    fetchLastfm()
    // Only fetch once on mount for homepage
    return () => { ignore = true }
  }, [])

  // Compute latest now entry (compare with Last.fm)
  useEffect(() => {
    // Get current language
    const currentLang = i18n.language?.split("-")[0] || "en"
    // Filter nowItems by language
    let filteredNow = nowItems.filter(item =>
      (item.content && (item.content[currentLang] || item.content.en))
    )
    // Exclude listening if Last.fm is available
    if (lastfmTrack && !lastfmError) {
      filteredNow = filteredNow.filter(item => item.category !== "listening")
    }
    // Find latest now entry
    let latest = null
    for (const item of filteredNow) {
      if (!latest || new Date(item.date) > new Date(latest.date)) {
        latest = item
      }
    }
    // Compare with Last.fm
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
  }, [i18n.language, lastfmTrack, lastfmError])

  if (!isTranslationReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!mounted) return null

  // Filter blog posts by current language (fallback to English)
  const currentLang = i18n.language?.split("-")[0] || "en"
  let filtered = blogPosts.filter(post => post.language === currentLang)
  if (filtered.length === 0) {
    filtered = blogPosts.filter(post => post.language === "en")
  }
  const recentPosts = filtered.slice(0, 3)

  // Helper for verbose date
  const formatVerboseDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString(i18n.language || "en", { year: 'numeric', month: 'long', day: 'numeric' })
  }

  // Define animation properties based on motion preference
  const animationProps = prefersReducedMotion ? { initial: {}, animate: {}, transition: {} } : {}

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section with Curved Shape */}
          <div className="relative pt-16 pb-24 mb-12">
            {/* Curved shape for light mode */}
            {theme === "light" && (
              <div className="absolute top-0 left-0 right-0 h-64 -z-10 overflow-hidden">
                <div className="w-full h-[500px] bg-gray-100 rounded-[100%] transform translate-y-[-70%]"></div>
              </div>
            )}

            <div className="text-center">
              <motion.p
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground mb-4"
              >
                {greeting}
              </motion.p>

              <motion.h1
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              >
                {t("home.heading", "hi there, i'm Jarema")}
              </motion.h1>

              <motion.p
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground mb-8"
              >
                {t("home.subheading", "Economics major, sometimes coder, most times cat whisperer.")}
              </motion.p>

              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/contact">
                  <Button variant="default" size="lg" className="w-full sm:w-auto">
                    {t("home.contactButton", "Contact me")}
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t("home.aboutButton", "About me")}
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t("home.blogButton", "Read my blog")}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Latest Now Entry Section */}
          {latestNow && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                {t("home.latestNow", "What I'm up to now")}
              </h2>
              <div className="border rounded-lg p-5 bg-card">
                {latestNow.type === "lastfm" ? (
                  <div>
                    <div className="flex items-center gap-2 font-semibold mb-1">
                      <LucideHeadphones className="w-5 h-5 text-primary" />
                      {t("now.categories.listening", "Listening")}
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
                      {latestNow.nowplaying && (
                        <span className="ml-2 text-xs text-red-500 animate-pulse">Live</span>
                      )}
                    </span>
                    {latestNow.date && (
                      <div className="text-xs text-muted-foreground mt-1">{latestNow.date}</div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 font-semibold mb-1">
                      {latestNow.icon ? (
                        <latestNow.icon className="w-5 h-5 text-primary" />
                      ) : null}
                      {latestNow.title}
                    </div>
                    <div className="mb-1">{latestNow.content}</div>
                    <div className="text-xs text-muted-foreground">{new Date(latestNow.date).toLocaleString(i18n.language || "en", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      timeZoneName: "short"
                    })}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Blog Posts Section */}
          {recentPosts && recentPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                {t("home.recentPosts", "Recent blog posts")}
              </h2>
              <div className="space-y-6">
                {recentPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="block group" passHref>
                    <div className="border rounded-lg p-5 hover:shadow-md transition-all bg-card group-hover:border-primary/50">
                      <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors">{post.title}</h3>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                        <span>{formatVerboseDate(post.date)}</span>
                        <span>•</span>
                        <span>{post.readingTime} {t("blog.minRead", "min read")}</span>
                        <span>•</span>
                        {post.mood && <span>{t("blog.mood", "Mood")}: {post.mood}</span>}
                        <span>•</span>
                        {post.language && <span>{post.language.toUpperCase()}</span>}
                      </div>
                      <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/blog">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t("home.blogButton", "Read my blog")}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="mt-16">
            <MoodCat />
          </div>
        </div>
      </div>

      <EasterEgg />
    </main>
  )
}
