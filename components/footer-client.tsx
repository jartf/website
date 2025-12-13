"use client"

import { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { usePathname } from "next/navigation"
import { Heart } from "lucide-react"
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help"
import { usePlatform, useViewport, useMounted } from "@/hooks"

interface FooterClientProps {
  copyright: string
  madeWith: string
  andChaos: string
}

/** Client-side interactive footer with translations and easter egg */
export function FooterClient({ copyright, madeWith, andChaos }: FooterClientProps) {
  const { t } = useTranslation()
  const pathname = usePathname()
  const { isDesktop } = usePlatform()
  const { isMobile } = useViewport()
  const mounted = useMounted()
  const [tapCount, setTapCount] = useState(0)
  const isAboutPage = pathname === "/about"

  const handleTap = useCallback(() => {
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
  }, [isAboutPage, mounted])

  const text = {
    copyright: mounted ? t("footer.copyright", copyright) : copyright,
    madeWith: mounted ? t("footer.madeWith", madeWith) : madeWith,
    andChaos: mounted ? t("footer.andChaos", andChaos) : andChaos,
  }

  return (
    <>
      <p
        className={`text-center text-sm leading-loose text-muted-foreground md:text-left ${isAboutPage ? "cursor-pointer" : ""}`}
        onClick={handleTap}
      >
        <span className="mr-1" aria-label="Copyleft">🄯</span> 2025{" "}
        <a href="https://jarema.me/" className="h-card hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded" rel="me" onClick={(e) => e.stopPropagation()}>
          Jarema
        </a>{" "}
        • {text.copyright}
      </p>
      <div className="flex items-center gap-1">
        <span className="hidden xl:inline text-sm text-muted-foreground">•</span>
        <span className="text-sm text-muted-foreground">{text.madeWith}</span>
        <Heart className="h-4 w-4 text-red-500 animate-pulse" aria-hidden="true" />
        <span className="sr-only">love</span>
        <span className="text-sm text-muted-foreground">{text.andChaos}</span>
      </div>
      {mounted && (!isMobile || isDesktop) && (
        <div className="absolute right-4">
          <KeyboardShortcutsHelp />
        </div>
      )}
    </>
  )
}
