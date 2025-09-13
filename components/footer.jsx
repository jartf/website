"use client"

import { useState, useEffect } from "react"
import { Heart, Mail, Github } from "lucide-react"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help"
import { usePlatform } from "@/hooks/use-platform"
import { useViewport } from "@/hooks/use-viewport"
import { useMounted } from "@/hooks/use-mounted"
import Image from "next/image"

/**
 * Footer component that displays copyright information, social links, and retro badges
 * @returns {JSX.Element} The footer component
 */
export function Footer() {
  const { t } = useTranslation()
  const pathname = usePathname()
  const isAboutPage = pathname === "/about"
  const { isDesktop } = usePlatform()
  const { isMobile } = useViewport()
  const mounted = useMounted()
  const [tapCount, setTapCount] = useState(0)

  useEffect(() => {
    if (isAboutPage && tapCount >= 5) {
      setTapCount(0)
      sessionStorage.setItem("showHiddenChapter", "true")
      window.location.reload()
    }
  }, [tapCount, isAboutPage])

  const handleTap = () => {
    if (isAboutPage) {
      setTapCount((prev) => {
        const newCount = prev + 1
        if (newCount >= 5) {
          sessionStorage.setItem("showHiddenChapter", "true")
          window.location.reload()
          return 0
        }
        return newCount
      })
    }
  }

  if (!mounted) return null

  // Show keyboard shortcuts button only if:
  // 1. Not on mobile viewport, OR
  // 2. On desktop platform (regardless of viewport size)
  const showKeyboardShortcuts = !isMobile || isDesktop

  return (
    <footer className="w-full border-t py-6 xl:py-0">
      <div
        className="container flex flex-col items-center justify-center gap-2 py-2 xl:flex-row xl:gap-1"
        onClick={handleTap}
      >
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          <span className="mr-1">🄯</span> 2025{" "}
          <a href="https://jarema.me/" className="h-card" rel="me">
            Jarema
          </a>{" "}
          • {t("footer.copyright")}
        </p>
        <div className="flex items-center gap-1">
          <span className="hidden xl:inline text-sm text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{t("footer.madeWith")}</span>
          <Heart className="h-4 w-4 text-red-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">{t("footer.andChaos")}</span>
        </div>
        {showKeyboardShortcuts && (
          <div className="absolute right-4">
            <KeyboardShortcutsHelp />
          </div>
        )}
      </div>

      {/* Social links */}
      <div className="flex justify-center gap-4 mt-2 mb-6">
        <a
          href="https://github.com/jartf"
          rel="me"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="GitHub"
        >
          <Github className="h-5 w-5" />
        </a>
        <a
          href="mailto:hello@jarema.me"
          rel="me"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Email"
        >
          <Mail className="h-5 w-5" />
        </a>
      </div>

      {/* Badges */}
      <div className="flex justify-center flex-wrap gap-2 max-w-2xl mx-auto">
        {/* 1. Join Logo */}
        <Image src="/join_logo.gif" alt="Join Logo" width={88} height={31} />

        {/* 2. Bannars */}
        <Image src="/bannars.gif" alt="The March of Bannars" width={88} height={31} />

        {/* 3. Best Viewed With Eyes (no link) */}
        <Image src="/best_viewed_with_eyes.gif" alt="Best Viewed With Eyes" width={88} height={31} />

        {/* 4. Valid RSS */}
        <a href="https://jarema.me/rss.xml" target="_blank" rel="noopener noreferrer">
          <Image
            src="/valid-rss-rogers.png"
            alt="Valid RSS"
            width={88}
            height={31}
            className="hover:opacity-90 transition-opacity"
          />
        </a>

        {/* 5. Valid Atom */}
        <a href="https://jarema.me/atom.xml" target="_blank" rel="noopener noreferrer">
          <Image
            src="/valid-atom.png"
            alt="Valid Atom Feed"
            width={88}
            height={31}
            className="hover:opacity-90 transition-opacity"
          />
        </a>

        {/* 6. Humans.txt */}
        <a href="https://jarema.me/humans.txt" target="_blank" rel="noopener noreferrer">
          <Image
            src="/humanstxt.png"
            alt="Humans.txt"
            width={88}
            height={31}
            className="hover:opacity-90 transition-opacity"
          />
        </a>

        {/* 6. People Pledge */}
        <a href="https://people.pledge.party/" target="_blank" rel="noopener noreferrer">
          <Image
            src="/people_pledge_badge_party_cream_pink_88x31.png"
            alt="People Pledge"
            width={88}
            height={31}
            className="hover:opacity-90 transition-opacity"
          />
        </a>

        {/* 7. Internet Privacy Now */}
        <Image src="/internetprivacy.gif" alt="Internet Privacy Now" width={88} height={31} />

        {/* 8. Say No to Web3 */}
        <a href="https://yesterweb.org/no-to-web3/" target="_blank" rel="noopener noreferrer">
          <Image
            src="/saynotoweb3_88x31.gif"
            alt="Say No to Web3"
            width={88}
            height={31}
            className="hover:opacity-90 transition-opacity"
          />
        </a>

        {/* 9. Got HTML */}
        <Image src="/got_html.gif" alt="Got HTML?" width={88} height={31} />

        {/* 10. JS Warning */}
        <Image src="/js-warning.gif" alt="JavaScript Warning" width={88} height={31} />

        {/* 11. Fedora */}
        <a href="https://fedoraproject.org/" target="_blank" rel="noopener noreferrer">
          <Image
            src="/fedora.gif"
            alt="Powered by Fedora"
            width={88}
            height={31}
            className="hover:opacity-90 transition-opacity"
          />
        </a>

        {/* 12. Firefox */}
        <a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank" rel="noopener noreferrer">
          <Image
            src="/firefox4.gif"
            alt="Firefox Browser"
            width={88}
            height={31}
            className="hover:opacity-90 transition-opacity"
          />
        </a>

        {/* 13. Anything But Chrome */}
        <a href="https://jarema.me/blog/2025/08/anything-but-chrome" target="_blank" rel="noopener noreferrer">
          <Image
            src="/anythingbut.gif"
            alt="Anything But Chrome"
            width={88}
            height={31}
            className="hover:opacity-90 transition-opacity"
          />
        </a>
      </div>

      {/* Personal badge - standalone at the bottom */}
      <div className="flex justify-center mt-2 pb-4">
        <Image
          src="/badge.png"
          alt="Jarema personal badge"
          width={88}
          height={31}
          className="opacity-90 hover:opacity-100 transition-opacity"
        />
      </div>
    </footer>
  )
}
