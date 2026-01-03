"use client"

import { useEffect, useState, memo } from "react"
import { useTranslation } from "react-i18next"
import { useMounted, useReducedMotion } from "@/hooks"
import { nowItems } from "@/content/now-items"
import { LucideHeadphones, Activity } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TranslatedText } from "@/components/translated-text"

const ActivityCard = memo(function ActivityCard({activity}) {
  return (
    <div className="flex items-center gap-3 overflow-hidden">
      {activity.assets?.large_image && (
        <div className="relative w-12 h-12 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={activity.assets.large_image} alt={activity.assets.large_text || activity.name} className="w-12 h-12 rounded-lg" title={activity.assets.large_text} loading="lazy" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {activity.assets?.small_image && <img src={activity.assets.small_image} alt={activity.assets.small_text || ""} className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-1 border-background bg-background" title={activity.assets.small_text} loading="lazy" />}
        </div>
      )}
      <div className="flex-1 min-w-0 overflow-hidden">
        <span className="font-semibold break-words overflow-wrap-anywhere block">{activity.name}</span>
        {activity.details && <p className="text-sm break-words overflow-wrap-anywhere">{activity.details}</p>}
        {activity.state && <p className="text-sm text-muted-foreground break-words overflow-wrap-anywhere">{activity.state}</p>}
      </div>
    </div>
  )
})

export function NowSection({ initialData }) {
  const { t, i18n } = useTranslation()
  const [latestNow, setLatestNow] = useState(null)
  const [lastfmTrack, setLastfmTrack] = useState(null)
  const [lastfmError, setLastfmError] = useState(false)
  const [premidActivities, setPremidActivities] = useState([])
  const [premidError, setPremidError] = useState(false)
  const mounted = useMounted()

  useEffect(() => {
    if (!mounted) return

    const controllers = [new AbortController(), new AbortController()]
    let ignore = false

    Promise.all([
      fetch("/api/lastfm", { signal: controllers[0].signal })
        .then(res => res.ok ? res.text() : Promise.reject())
        .then(xml => {
          const doc = new window.DOMParser().parseFromString(xml, "application/xml")
          const tracks = doc.getElementsByTagName("track")
          if (!tracks.length) return null

          let track = Array.from(tracks).find(t => t.getAttribute("nowplaying") === "true") || tracks[0]
          if (!track) return null

          const nowplaying = track.getAttribute("nowplaying") === "true"
          const name = track.getElementsByTagName("name")[0]?.textContent || ""
          const artist = track.getElementsByTagName("artist")[0]?.textContent || ""
          const url = track.getElementsByTagName("url")[0]?.textContent || ""

          let date, dateObj
          if (!nowplaying) {
            const uts = track.getElementsByTagName("date")[0]?.getAttribute("uts")
            if (uts) {
              dateObj = new Date(Number(uts) * 1000)
              date = dateObj.toLocaleString(undefined, {year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",timeZoneName:"short"})
            }
          } else {
            dateObj = new Date()
          }

          return { name, artist, url, nowplaying, date, dateObj }
        })
        .catch(e => e.name === 'AbortError' ? null : Promise.reject(e)),

      fetch("/api/premid", { signal: controllers[1].signal })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => data.activities?.map(a => a.activity) || [])
        .catch(e => e.name === 'AbortError' ? [] : Promise.reject(e))
    ])
    .then(([lastfm, premid]) => {
      if (ignore) return
      if (lastfm) {
        setLastfmTrack(lastfm)
        setLastfmError(false)
      }
      if (premid) {
        setPremidActivities(premid)
        setPremidError(false)
      }
    })
    .catch(() => {
      if (!ignore) {
        setLastfmError(true)
        setPremidError(true)
      }
    })

    return () => {
      ignore = true
      controllers.forEach(c => c.abort())
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return

    const lang = i18n.language?.split("-")[0] || "en"
    const items = []

    // Add Last.fm if available
    if (lastfmTrack && !lastfmError) {
      items.push({type:"lastfm", ...lastfmTrack})
    }

    // Add PreMID if available
    if (premidActivities.length && !premidError) {
      items.push({type:"premid", activities:premidActivities})
    }

    // Add now items, filtering out categories we already have
    const filtered = nowItems
      .filter(i => i.content?.[lang] || i.content?.en)
      .filter(i => {
        if (i.category === "listening" && lastfmTrack && !lastfmError) return false
        if (i.category === "premid" && premidActivities.length && !premidError) return false
        return true
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3)
      .map(i => ({
        type:"nowitem",
        icon:i.icon,
        title:i.category.charAt(0).toUpperCase() + i.category.slice(1),
        content:i.content[lang] || i.content.en,
        date:i.date,
      }))

    items.push(...filtered)
    queueMicrotask(() => setLatestNow(items.slice(0, 3)))
  }, [mounted, i18n.language, lastfmTrack, lastfmError, premidActivities, premidError])

  if (!mounted) return !initialData?.length ? null : (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-center">
        <a href="/now" tabIndex={-1} className="no-underline hover:underline focus:underline" style={{color:"inherit"}}>
          What I&apos;m up to now
        </a>
      </h2>
      <div className="border rounded-lg p-5 bg-card space-y-4 overflow-hidden">
        {initialData.map((item, i) => (
          <div key={i} className={i < initialData.length - 1 ? "border-b border-border pb-4" : ""}>
            <div className="flex items-center gap-2 font-semibold mb-1">{item.title}</div>
            <div className="mb-1">{item.content}</div>
            <div className="text-xs text-muted-foreground">{item.date}</div>
          </div>
        ))}
      </div>
    </div>
  )

  if (!latestNow?.length) return null

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-center">
        <a href="/now" tabIndex={-1} className="no-underline hover:underline focus:underline" style={{color:"inherit"}}>
          {t("home.latestNow", "What I&apos;m up to now")}
        </a>
      </h2>
      <div className="border rounded-lg p-5 bg-card space-y-4 lg:max-h-[415px] overflow-y-auto overflow-x-hidden">
        {latestNow.map((item, i) => {
          const isLast = i === latestNow.length - 1
          const divider = !isLast ? "border-b border-border pb-4" : ""

          if (item.type === "lastfm") return (
            <div key={i} className={divider}>
              <div className="flex items-center gap-2 font-semibold mb-1">
                <LucideHeadphones className="w-5 h-5 text-primary" />
                {t("now.categories.listening", "Listening")}
                {item.nowplaying && <span className="ml-2 text-sm font-bold text-red-600 dark:text-white dark:bg-red-600 px-2 py-0.5 rounded">Live</span>}
              </div>
              <span>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold">{item.name}</a>
                {" "}<span className="text-muted-foreground">by</span> {item.artist}
              </span>
              {item.date && !item.nowplaying && <div className="text-xs text-muted-foreground mt-1">{item.date}</div>}
            </div>
          )

          if (item.type === "premid") return (
            <div key={i} className={divider}>
              <div className="flex items-center gap-2 font-semibold mb-1">
                <Activity className="w-5 h-5 text-primary" />
                {t("now.categories.premid", "PreMID")}
                <span className="ml-2 text-sm font-bold text-red-600 dark:text-white dark:bg-red-600 px-2 py-0.5 rounded">Live</span>
              </div>
              <div className="space-y-3">
                {item.activities.map((a, idx) => <ActivityCard key={idx} activity={a} />)}
              </div>
            </div>
          )

          return (
            <div key={i} className={divider}>
              <div className="flex items-center gap-2 font-semibold mb-1">
                {item.icon && <item.icon className="w-5 h-5 text-primary" />}
                {item.title}
              </div>
              <div className="mb-1">{item.content}</div>
              <div className="text-xs text-muted-foreground">
                {new Date(item.date).toLocaleString(i18n.language || "en", {
                  year:"numeric", month:"long", day:"numeric",
                  hour:"2-digit", minute:"2-digit", second:"2-digit", timeZoneName:"short"
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const Greeting = memo(function Greeting() {
  const { t } = useTranslation()
  const mounted = useMounted()
  const [greeting, setGreeting] = useState("Welcome, traveler.")

  useEffect(() => {
    if (!mounted) return
    const h = new Date().getHours()
    const g = h >= 5 && h < 12 ? t("greetings.morning", "Good morning, traveler.")
      : h >= 12 && h < 18 ? t("greetings.afternoon", "Good afternoon, wanderer.")
      : h >= 18 && h < 22 ? t("greetings.evening", "Good evening, explorer.")
      : t("greetings.night", "Still awake? Me too.")
    queueMicrotask(() => setGreeting(g))
  }, [t, mounted])

  return <p className="text-lg md:text-xl text-muted-foreground mb-4">{greeting}</p>
})

export const AnimatedHeroContent = memo(function AnimatedHeroContent({children, delay = 0}) {
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()

  if (!mounted || prefersReducedMotion) return <>{children}</>

  return <div className="animate-fade-in-up" style={{animationDelay:`${delay}s`,animationFillMode:"both"}}>{children}</div>
})

export const BlogPostMeta = memo(function BlogPostMeta({date, readingTime, initialDateText, initialMinReadText}) {
  const { t, i18n } = useTranslation()
  const mounted = useMounted()
  const lang = i18n.language?.split("-")[0] || "en"

  const dateText = mounted ? formatDate(date, lang) : initialDateText
  const minReadText = mounted ? t("blog.minRead", "min read") : initialMinReadText

  return (
    <>
      <time className="dt-published" dateTime={date}>{dateText}</time>
      <span>•</span>
      <span>{readingTime} {minReadText}</span>
    </>
  )
})

export const RecentPosts = memo(function RecentPosts({ blogPosts }) {
  const { t, i18n } = useTranslation()
  const mounted = useMounted()
  const lang = i18n.language?.split("-")[0] || "en"

  const [recentPosts, setRecentPosts] = useState(() => {
    // Initial SSR/hydration: show English posts
    let posts = blogPosts.filter(p => p.language === "en").slice(0, 3)
    if (!posts.length) posts = blogPosts.slice(0, 3)
    return posts
  })

  useEffect(() => {
    if (!mounted) return

    // Combine posts from current language and English
    const currentLangPosts = blogPosts.filter(p => p.language === lang)
    const englishPosts = blogPosts.filter(p => p.language === "en")

    // If current language is English, just show English posts
    if (lang === "en") {
      setRecentPosts(englishPosts.slice(0, 3))
      return
    }

    // Otherwise, combine both languages
    // Create a Set to avoid duplicates by slug
    const seen = new Set()
    const combined = []

    // Add current language posts first
    for (const post of currentLangPosts) {
      if (!seen.has(post.slug)) {
        seen.add(post.slug)
        combined.push(post)
      }
    }

    // Then add English posts
    for (const post of englishPosts) {
      if (!seen.has(post.slug)) {
        seen.add(post.slug)
        combined.push(post)
      }
    }

    setRecentPosts(combined.slice(0, 3))
  }, [mounted, lang, blogPosts])

  if (!recentPosts.length) return null

  const T = ({k, f}) => <TranslatedText i18nKey={k} fallback={f} />

  return (
    <section className="lg:order-1" aria-labelledby="recent-posts-heading">
      <h2 id="recent-posts-heading" className="text-2xl font-bold mb-4 text-center">
        <a href="/webrings" tabIndex={-1} className="no-underline hover:underline focus:underline" style={{color:"inherit"}}>
          <T k="home.recentPosts" f="Recent blog posts" />
        </a>
      </h2>
      <div className="space-y-4">
        {recentPosts.map(post => (
          <div key={post.slug} className="h-entry">
            <Link href={`/blog/${post.slug}`} className="block group u-url">
              <div className="border rounded-lg p-4 hover:shadow-md transition-all bg-card group-hover:border-primary/50">
                <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors p-name">{post.title}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                  <BlogPostMeta
                    date={post.date}
                    readingTime={post.readingTime}
                    initialDateText={formatDate(post.date, lang)}
                    initialMinReadText={t("blog.minRead", "min read")}
                  />
                </div>
                <p className="text-muted-foreground line-clamp-2 text-sm p-summary">{post.excerpt}</p>
              </div>
            </Link>
            <div className="p-author h-card" style={{display:'none'}}>
              <span className="p-name" data-url="https://jarema.me">Jarema</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-center lg:hidden">
        <Link href="/blog">
          <Button variant="outline" className="w-full sm:w-auto">
            <T k="home.blogButton" f="Read my blog" />
          </Button>
        </Link>
      </div>
    </section>
  )
})
