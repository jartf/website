"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { ArrowLeft, ArrowRight, Twitter, Facebook, LinkIcon, Check, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMounted, useCurrentLanguage } from "@/hooks"
import { formatDate } from "@/lib/utils"
import { languageNames } from "@/lib/constants"

/**
 * Client-side formatted date with user's locale
 */
export function FormattedDate({ date, fallback }: { date: string; fallback: string }) {
  const mounted = useMounted()
  const currentLang = useCurrentLanguage()

  if (!mounted) return <>{fallback}</>
  return <>{formatDate(date, currentLang)}</>
}

/**
 * Language name with i18n support
 */
export function LanguageName({ code }: { code: string }) {
  const { t } = useTranslation()
  const mounted = useMounted()

  const fallback = languageNames[code as keyof typeof languageNames] || code
  if (!mounted) return <>{fallback}</>
  return <>{t(`language.${code}`, fallback)}</>
}

// --- Post Navigation ---

type NavigationProps = {
  navigation: {
    prev: { slug: string; title: string } | null
    next: { slug: string; title: string } | null
  }
}

// Static fallback labels
const STATIC_LABELS = {
  prev: "Previous",
  next: "Next",
  back: "Back to blog list",
}

/**
 * A component that displays navigation links to the previous and next blog posts.
 * Server-rendered UI with client-side keyboard navigation.
 */
export function BlogPostNavigation({ navigation }: NavigationProps) {
  const router = useRouter()
  const { prev, next } = navigation
  const { t } = useTranslation()
  const mounted = useMounted()

  // Keyboard navigation - client-side only
  useEffect(() => {
    if (!mounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      if (e.key === "h" && prev) {
        e.preventDefault()
        router.push(`/blog/${prev.slug}`)
      } else if (e.key === "l" && next) {
        e.preventDefault()
        router.push(`/blog/${next.slug}`)
      } else if (e.key === "b") {
        e.preventDefault()
        router.push("/blog")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [prev, next, router, mounted])

  if (!prev && !next) return null

  // Get translated labels or fallback to static
  const labels = {
    prev: mounted ? t("blog.prev", STATIC_LABELS.prev) : STATIC_LABELS.prev,
    next: mounted ? t("blog.next", STATIC_LABELS.next) : STATIC_LABELS.next,
    back: mounted ? t("blog.back", STATIC_LABELS.back) : STATIC_LABELS.back,
  }

  return (
    <nav className="mt-12 pt-8 border-t">
      <div className="flex justify-between items-center">
        {prev ? (
          <Link href={`/blog/${prev.slug}`} passHref>
            <Button variant="ghost" className="flex items-center gap-2 group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">{labels.prev}</div>
                <div className="text-sm font-medium truncate max-w-[200px]">{prev.title}</div>
              </div>
            </Button>
          </Link>
        ) : (
          <div />
        )}

        {next ? (
          <Link href={`/blog/${next.slug}`} passHref>
            <Button variant="ghost" className="flex items-center gap-2 group">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{labels.next}</div>
                <div className="text-sm font-medium truncate max-w-[200px]">{next.title}</div>
              </div>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        ) : (
          <div />
        )}
      </div>

      <div className="flex justify-center mt-4">
        <Link href="/blog" passHref>
          <Button variant="outline" size="sm">
            {labels.back}
          </Button>
        </Link>
      </div>
    </nav>
  )
}

// --- Share Buttons ---

// Social media icons
const BlueSkyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="16" height="16" fill="currentColor" className="h-4 w-4">
    <path d="M111.8 62.2C170.2 105.9 233 194.7 256 242.4c23-47.6 85.8-136.4 144.2-180.2c42.1-31.6 110.3-56 110.3 21.8c0 15.5-8.9 130.5-14.1 149.2C478.2 298 412 314.6 353.1 304.5c102.9 17.5 129.1 75.5 72.5 133.5c-107.4 110.2-154.3-27.6-166.3-62.9l0 0c-1.7-4.9-2.6-7.8-3.3-7.8s-1.6 3-3.3 7.8l0 0c-12 35.3-59 173.1-166.3 62.9c-56.5-58-30.4-116 72.5-133.5C100 314.6 33.8 298 15.7 233.1C10.4 214.4 1.5 99.4 1.5 83.9c0-77.8 68.2-53.4 110.3-21.8z" />
  </svg>
)

const ThreadsIcon = () => (
  <svg aria-label="Threads" viewBox="0 0 192 192" width="16" height="16" fill="currentColor" className="h-4 w-4">
    <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
  </svg>
)

const RedditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192" width="16" height="16" fill="currentColor" className="h-4 w-4">
    <path d="m33.067 111.226 5.826 1.435a6 6 0 0 0-3.978-7.143l-1.848 5.708Zm17.548-25.068-4.728 3.694a6 6 0 0 0 8.341 1.096l-3.613-4.79Zm90.77 0-3.613 4.79a6 6 0 0 0 8.341-1.096l-4.728-3.694Zm17.548 25.068-1.848-5.708a6 6 0 0 0-3.978 7.143l5.826-1.435ZM96 174.001c18.846 0 36.138-5.722 48.855-15.259C157.573 149.203 166 135.568 166 120.001h-12c0 10.943-5.9 21.307-16.345 29.141-10.447 7.835-25.155 12.859-41.655 12.859v12Zm-70-54c0 15.567 8.427 29.202 21.145 38.741 12.717 9.537 30.01 15.259 48.855 15.259v-12c-16.5 0-31.208-5.024-41.655-12.859C43.9 141.308 38 130.944 38 120.001H26Zm1.241-10.21A42.616 42.616 0 0 0 26 120.001h12c0-2.505.306-4.956.893-7.34l-11.652-2.87ZM16 96.001c0 9.793 6.394 18.076 15.219 20.933l3.696-11.416A10.007 10.007 0 0 1 28 96.001H16Zm22-22c-12.15 0-22 9.85-22 22h12c0-5.523 4.477-10 10-10v-12Zm17.343 8.463C51.326 77.324 45.049 74 38 74v12c3.2 0 6.047 1.496 7.887 3.851l9.456-7.388ZM96 66c-18.916 0-36.268 5.764-48.998 15.367l7.226 9.58C64.682 83.063 79.438 78 96 78V66Zm48.998 15.367C132.268 71.765 114.916 66 96 66v12c16.563 0 31.318 5.062 41.772 12.947l7.226-9.58Zm1.115 8.484a9.972 9.972 0 0 1 7.887-3.85v-12c-7.05 0-13.326 3.322-17.343 8.463l9.456 7.388Zm7.887-3.85c5.523 0 10 4.477 10 10h12c0-12.15-9.85-22-22-22v12Zm10 10c0 4.438-2.895 8.215-6.915 9.517l3.696 11.416c8.825-2.857 15.219-11.14 15.219-20.933h-12Zm2 24a42.63 42.63 0 0 0-1.241-10.21l-11.652 2.87c.587 2.384.893 4.835.893 7.34h12Z" />
    <circle cx="68" cy="110.001" r="12" fill="currentColor" />
    <circle cx="124" cy="110.001" r="12" fill="currentColor" />
    <path stroke="currentColor" strokeLinecap="round" strokeWidth="12" d="M120 138.001s-8 6-24 6-24-6-24-6" />
    <circle cx="146" cy="36.001" r="12" stroke="currentColor" strokeWidth="12" />
    <path fillRule="evenodd" d="M107.177 22.118a6 6 0 0 0-7.028 4.553l-10 44a6 6 0 1 0 11.702 2.66l8.704-38.3 24.074 4.815A11.985 11.985 0 0 1 134 36c0-3.036 1.127-5.808 2.986-7.922l-29.809-5.961Z" clipRule="evenodd" />
  </svg>
)

const MastodonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="h-4 w-4">
    <path d="M21.327 8.566c0-4.339-2.843-5.61-2.843-5.61-1.433-.658-3.894-.935-6.451-.956h-.063c-2.557.021-5.016.298-6.45.956 0 0-2.843 1.272-2.843 5.61 0 .993-.019 2.181.012 3.441.103 4.243.778 8.425 4.701 9.463 1.809.479 3.362.579 4.612.51 2.268-.126 3.541-.809 3.541-.809l-.075-1.646s-1.621.511-3.441.449c-1.804-.062-3.707-.194-3.999-2.409a4.523 4.523 0 0 1-.04-.621s1.77.433 4.014.536c1.372.063 2.658-.08 3.965-.236 2.506-.299 4.688-1.843 4.962-3.254.434-2.223.398-5.424.398-5.424zm-3.353 5.59h-2.081V9.057c0-1.075-.452-1.62-1.357-1.62-1 0-1.501.647-1.501 1.927v2.791h-2.069V9.364c0-1.28-.501-1.927-1.501-1.927-.905 0-1.357.546-1.357 1.62v5.099H6.026V8.903c0-1.074.273-1.927.823-2.558.566-.631 1.307-.955 2.228-.955 1.065 0 1.872.409 2.405 1.228l.518.869.519-.869c.533-.819 1.34-1.228 2.405-1.228.92 0 1.662.324 2.228.955.549.631.822 1.484.822 2.558v5.253z" />
  </svg>
)

function getShareLinks(title: string, url: string) {
  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  return [
    { url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, icon: Twitter, label: "Share on Twitter" },
    { url: `https://bsky.app/intent/compose?text=${encodedTitle}%20${encodedUrl}`, icon: BlueSkyIcon, label: "Share on Bluesky" },
    { url: `https://threads.net/intent/post?text=${encodedTitle}%20${encodedUrl}`, icon: ThreadsIcon, label: "Share on Threads" },
    { url: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`, icon: RedditIcon, label: "Share on Reddit" },
    { url: `https://mastodon.social/share?text=${encodedTitle}%20${encodedUrl}`, icon: MastodonIcon, label: "Share on Mastodon" },
    { url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, icon: Facebook, label: "Share on Facebook" },
    { url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`, icon: Mail, label: "Share via Email" },
  ]
}

type ShareButtonProps = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  withTooltip: boolean
}

function ShareButton({ href, label, icon: Icon, withTooltip }: ShareButtonProps) {
  const button = (
    <Button variant="outline" size="icon" asChild title={!withTooltip ? label : undefined}>
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
        <Icon className="h-4 w-4" />
      </a>
    </Button>
  )

  if (!withTooltip) return button

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent><p>{label}</p></TooltipContent>
    </Tooltip>
  )
}

function CopyButton({ url, withTooltip }: { url: string; withTooltip: boolean }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const label = copied ? "Copied!" : "Copy link"

  const button = (
    <Button
      variant="outline"
      size="icon"
      onClick={copyToClipboard}
      aria-label="Copy link"
      title={!withTooltip ? label : undefined}
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />}
    </Button>
  )

  if (!withTooltip) return button

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent><p>{label}</p></TooltipContent>
    </Tooltip>
  )
}

/**
 * Share buttons component with progressive enhancement.
 * - Without JS: renders clickable link buttons with title attributes
 * - With JS: adds tooltips and copy-to-clipboard button
 */
export function ShareButtons({ title, url }: { title: string; url: string }) {
  const mounted = useMounted()
  const shareLinks = getShareLinks(title, url)

  const content = (
    <>
      {/* Copy button only shows when JS is available */}
      {mounted && <CopyButton url={url} withTooltip={mounted} />}

      {shareLinks.map(({ url: shareUrl, icon, label }) => (
        <ShareButton
          key={label}
          href={shareUrl}
          label={label}
          icon={icon}
          withTooltip={mounted}
        />
      ))}
    </>
  )

  return (
    <div className="flex flex-wrap gap-2">
      {mounted ? <TooltipProvider>{content}</TooltipProvider> : content}
    </div>
  )
}
