"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { useTranslation } from "react-i18next"
import i18n from "@/i18n/i18n"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RefreshCw, ExternalLink } from "lucide-react"
import { useMounted, useReducedMotion } from "@/hooks"
import { type MoodCat, moodCats } from "./mood-cat"

/**
 * Memoized cat image component with CSS transitions
 */
const CatImage = memo(function CatImage({ cat, isVisible }: { cat: MoodCat; isVisible: boolean }) {
  const currentLang = i18n.language
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className={`relative h-full w-full ${prefersReducedMotion ? '' : 'transition-opacity duration-300'}`}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <Image
        src={cat.image || "/placeholder.svg"}
        alt={`Mood cat: ${cat.caption}`}
        fill
        className="object-cover"
        loading="lazy"
        priority={false}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <p className="text-white text-xl font-medium text-center">
          {currentLang === "vi" && cat.captionVi ? cat.captionVi : cat.caption}
        </p>
        {cat.attribution && (
          <p className="text-white/70 text-xs text-center mt-1">
            <a
              href={cat.attribution}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/90 transition-colors"
              title={
                currentLang === "vi" && cat.attributionNoteVi
                  ? cat.attributionNoteVi
                  : cat.attributionNote
              }
            >
              Image source
            </a>
            {((currentLang === "vi" && cat.attributionNoteVi) ||
              (currentLang !== "vi" && cat.attributionNote)) && (
              <span className="block mt-0.5 text-[10px] opacity-70">
                {currentLang === "vi" && cat.attributionNoteVi
                  ? cat.attributionNoteVi
                  : cat.attributionNote}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  )
})

/**
 * Client-side interactive component for the mood cat
 * Provides refresh functionality with progressive enhancement
 */
export function MoodCatClient({ initialCat }: { initialCat: MoodCat }) {
  const { t } = useTranslation()
  const [currentCat, setCurrentCat] = useState<MoodCat>(initialCat)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()
  const refreshButtonRef = useRef<HTMLButtonElement>(null)

  const getRandomCat = useCallback(() => {
    setIsLoading(true)

    // Start fade out
    if (!prefersReducedMotion) {
      setIsTransitioning(true)
    }

    // Get a random cat that's different from the current one
    let newCat
    do {
      newCat = moodCats[Math.floor(Math.random() * moodCats.length)]
    } while (newCat && currentCat && newCat.id === currentCat.id)

    // Use a shorter timeout for reduced motion, otherwise wait for fade
    const delay = prefersReducedMotion ? 50 : 150
    setTimeout(() => {
      setCurrentCat(newCat)
      setIsTransitioning(false)
      setIsLoading(false)
    }, delay)
  }, [currentCat, prefersReducedMotion])

  useEffect(() => {
    // Hide server-rendered content and show client version
    const serverCat = document.querySelector('[data-server-cat]')
    const serverButtons = document.querySelector('[data-server-buttons]')

    if (serverCat) {
      (serverCat as HTMLElement).style.display = 'none'
    }
    if (serverButtons) {
      (serverButtons as HTMLElement).style.display = 'none'
    }
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Client-rendered cat image */}
      <div className="relative rounded-xl overflow-hidden bg-muted">
        <div className="relative aspect-[4/3] w-full">
          <CatImage cat={currentCat} isVisible={!isTransitioning} />
        </div>
      </div>

      {/* Interactive buttons */}
      <div className="mt-4 flex justify-center gap-3">
        <Button
          ref={refreshButtonRef}
          variant="outline"
          size="sm"
          onClick={getRandomCat}
          disabled={isLoading}
          className="group"
          aria-label={t("moodCat.refresh", "Refresh mood cat")}
          aria-busy={isLoading}
          id="refresh-mood-cat-button"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} aria-hidden="true" />
          <span>{t("moodCat.refresh", "New cat, who dis?")}</span>
        </Button>
        <Button variant="outline" size="sm" asChild className="group">
          <a href="https://www.reddit.com/r/Catswithjobs/" target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4 group-hover:animate-pulse" aria-hidden="true" />
            <span>{t("moodCat.seeMore", "See more cats")}</span>
            <span className="sr-only"> (opens in new tab)</span>
          </a>
        </Button>
      </div>

      {/* Update hover text with translation */}
      <style jsx>{`
        .mood-cat-hover-text {
          content: "${t("moodCat.hover", "judging you softly")}";
        }
      `}</style>
    </>
  )
}
