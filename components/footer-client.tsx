"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { usePathname } from "next/navigation"
import { Heart } from "lucide-react"
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help"
import { usePlatform } from "@/hooks/use-platform"
import { useViewport } from "@/hooks/use-viewport"
import { useMounted } from "@/hooks/use-mounted"

interface FooterClientProps {
  staticCopyright: string
  staticMadeWith: string
  staticAndChaos: string
}

/**
 * Client-side interactive parts of the footer
 * - Translated text (requires i18n)
 * - Hidden chapter easter egg on about page
 * - Keyboard shortcuts button
 */
export function FooterClient({
  staticCopyright,
  staticMadeWith,
  staticAndChaos,
}: FooterClientProps) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const isAboutPage = pathname === "/about"
  const { isDesktop } = usePlatform()
  const { isMobile } = useViewport()
  const mounted = useMounted()
  const [tapCount, setTapCount] = useState(0)

  const handleTap = () => {
    if (!isAboutPage || !mounted) return
    setTapCount((prev) => {
      if (prev + 1 >= 5) {
        queueMicrotask(() => {
          sessionStorage.setItem("showHiddenChapter", "true")
          window.location.reload()
        })
        return 0
      }
      return prev + 1
    })
  }

  // Use translated text when mounted, static fallback otherwise
  const copyrightText = mounted ? t("footer.copyright", staticCopyright) : staticCopyright
  const madeWithText = mounted ? t("footer.madeWith", staticMadeWith) : staticMadeWith
  const andChaosText = mounted ? t("footer.andChaos", staticAndChaos) : staticAndChaos

  // Show keyboard shortcuts button only if mounted and not on mobile (unless on desktop platform)
  const showKeyboardShortcuts = mounted && (!isMobile || isDesktop)

  return (
    <>
      {/* Main footer text with easter egg */}
      <p
        className={`text-center text-sm leading-loose text-muted-foreground md:text-left ${isAboutPage ? "cursor-pointer" : ""}`}
        onClick={handleTap}
      >
        <span className="mr-1" aria-label="Copyleft">🄯</span> 2025{" "}
        <a
          href="https://jarema.me/"
          className="h-card hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
          rel="me"
          onClick={(e) => e.stopPropagation()}
        >
          Jarema
        </a>{" "}
        • {copyrightText}
      </p>

      <div className="flex items-center gap-1">
        <span className="hidden xl:inline text-sm text-muted-foreground">•</span>
        <span className="text-sm text-muted-foreground">{madeWithText}</span>
        <Heart className="h-4 w-4 text-red-500 animate-pulse" aria-hidden="true" />
        <span className="sr-only">love</span>
        <span className="text-sm text-muted-foreground">{andChaosText}</span>
      </div>

      {showKeyboardShortcuts && (
        <div className="absolute right-4">
          <KeyboardShortcutsHelp />
        </div>
      )}
    </>
  )
}
