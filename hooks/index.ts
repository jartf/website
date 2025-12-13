"use client"

import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { SUPPORTED_LANGUAGES, THEMES, KEYBOARD_SHORTCUTS, ROUTES } from "@/lib/constants"

// ============================================================================
// useMounted - Hydration-safe mounting detection
// ============================================================================
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    queueMicrotask(() => setMounted(true))
  }, [])
  return mounted
}

// ============================================================================
// useReducedMotion - Respects user's motion preferences
// ============================================================================
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  return prefersReducedMotion
}

// ============================================================================
// useViewport - Responsive breakpoints with debounced resize
// ============================================================================
export function useViewport() {
  const [viewport, setViewport] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    windowWidth: 0,
  })

  useEffect(() => {
    let timeout: NodeJS.Timeout
    const checkViewport = () => {
      const width = window.innerWidth
      setViewport({
        windowWidth: width,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1280,
        isDesktop: width >= 1280,
      })
    }
    checkViewport()
    const debouncedCheck = () => {
      clearTimeout(timeout)
      timeout = setTimeout(checkViewport, 150)
    }
    window.addEventListener("resize", debouncedCheck)
    return () => {
      clearTimeout(timeout)
      window.removeEventListener("resize", debouncedCheck)
    }
  }, [])

  return viewport
}

// ============================================================================
// usePlatform - OS and device detection
// ============================================================================
export function usePlatform() {
  const [platform] = useState(() => {
    if (typeof window === "undefined") {
      return { isMac: false, isWindows: false, isLinux: false, isMobile: false, isTouch: false, isDesktop: false }
    }
    const p = navigator.platform.toLowerCase()
    const ua = navigator.userAgent.toLowerCase()
    const width = window.innerWidth
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(ua) || width < 768
    return {
      isMac: p.includes("mac"),
      isWindows: p.includes("win"),
      isLinux: p.includes("linux") || p.includes("x11"),
      isMobile,
      isTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      isDesktop: width >= 1280,
    }
  })
  return platform
}

// ============================================================================
// useCurrentLanguage - Normalized language detection (replaces useLanguageDetection and useCurrentLanguage)
// ============================================================================
export function useCurrentLanguage(syncHtmlLang = false) {
  const { i18n } = useTranslation()

  const currentLanguage = useMemo(() => {
    const rawLang = i18n.language || "en"
    if (SUPPORTED_LANGUAGES.includes(rawLang)) return rawLang
    const match = SUPPORTED_LANGUAGES.find(lang => rawLang.startsWith(lang))
    return match || "en"
  }, [i18n.language])

  // Optionally sync <html lang> attribute
  useEffect(() => {
    if (syncHtmlLang && typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", currentLanguage)
    }
  }, [currentLanguage, syncHtmlLang])

  return currentLanguage
}

// ============================================================================
// useLanguageTracker - Track visited languages for easter egg
// ============================================================================
const LANGUAGE_TRACKER_KEY = "language-tracker"

export function useLanguageTracker() {
  const { i18n } = useTranslation()
  const lastTrackedLang = useRef<string | null>(null)

  const [visitedLanguages, setVisitedLanguages] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    try {
      const stored = localStorage.getItem(LANGUAGE_TRACKER_KEY)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  const [allLanguagesVisited, setAllLanguagesVisited] = useState(false)

  useEffect(() => {
    if (visitedLanguages.size > 0 && typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_TRACKER_KEY, JSON.stringify([...visitedLanguages]))
    }
  }, [visitedLanguages])

  const trackLanguage = useCallback((code: string) => {
    if (!code) return
    setVisitedLanguages(prev => new Set([...prev, code]))
  }, [])

  const checkAllLanguagesVisited = useCallback(() => {
    const allVisited = SUPPORTED_LANGUAGES.every(lang => visitedLanguages.has(lang))
    if (allVisited && !allLanguagesVisited) setAllLanguagesVisited(true)
    return allVisited
  }, [visitedLanguages, allLanguagesVisited])

  const resetLanguageTracker = useCallback(() => {
    setVisitedLanguages(new Set())
    setAllLanguagesVisited(false)
    if (typeof window !== "undefined") localStorage.removeItem(LANGUAGE_TRACKER_KEY)
  }, [])

  useEffect(() => {
    if (i18n.language && i18n.language !== lastTrackedLang.current) {
      lastTrackedLang.current = i18n.language
      queueMicrotask(() => trackLanguage(i18n.language))
    }
  }, [i18n.language, trackLanguage])

  return { visitedLanguages, allLanguagesVisited, trackLanguage, checkAllLanguagesVisited, resetLanguageTracker }
}

// ============================================================================
// useKeyboardNavigation - Global keyboard shortcuts
// ============================================================================
const NAVIGATION_SHORTCUTS: Record<string, string> = {
  [KEYBOARD_SHORTCUTS.HOME]: ROUTES.HOME,
  [KEYBOARD_SHORTCUTS.ABOUT]: ROUTES.ABOUT,
  [KEYBOARD_SHORTCUTS.BLOG]: ROUTES.BLOG,
  [KEYBOARD_SHORTCUTS.PROJECTS]: ROUTES.PROJECTS,
  [KEYBOARD_SHORTCUTS.NOW]: ROUTES.NOW,
  [KEYBOARD_SHORTCUTS.USES]: ROUTES.USES,
  [KEYBOARD_SHORTCUTS.CONTACT]: ROUTES.CONTACT,
  [KEYBOARD_SHORTCUTS.COLOPHON]: ROUTES.COLOPHON,
  [KEYBOARD_SHORTCUTS.SLASHES]: ROUTES.SLASHES,
  [KEYBOARD_SHORTCUTS.SCRAPBOOK]: ROUTES.SCRAPBOOK,
  [KEYBOARD_SHORTCUTS.GAME_2048]: ROUTES.GAME_2048,
  [KEYBOARD_SHORTCUTS.TETRIS]: ROUTES.TETRIS,
}

export function useKeyboardNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [refreshCatEl, setRefreshCatEl] = useState<Element | null>(null)

  useEffect(() => {
    const find = () => setRefreshCatEl(document.querySelector('button[aria-label="Refresh mood cat"]'))
    find()
    const t = setTimeout(find, 1000)
    return () => clearTimeout(t)
  }, [pathname])

  const cycleTheme = useCallback(() => {
    const idx = THEMES.indexOf(theme || "system")
    setTheme(THEMES[(idx + 1) % THEMES.length])
  }, [theme, setTheme])

  const cycleLanguage = useCallback(() => {
    const curr = i18n.language || "en"
    let idx = SUPPORTED_LANGUAGES.indexOf(curr)
    if (idx === -1) idx = SUPPORTED_LANGUAGES.findIndex(l => curr.startsWith(l))
    if (idx === -1) idx = 0
    const next = SUPPORTED_LANGUAGES[(idx + 1) % SUPPORTED_LANGUAGES.length]
    i18n.changeLanguage(next)
    document.documentElement?.setAttribute("lang", next)
  }, [i18n])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el?.getAttribute("contenteditable") === "true") return
      if (e.ctrlKey) return

      const isGame = pathname?.includes(ROUTES.GAME_2048) || pathname?.includes(ROUTES.TETRIS)

      if (isGame) {
        if (e.key === "h" && !e.metaKey && !e.altKey) { e.preventDefault(); router.push("/") }
        else if (e.key === "m" && !e.metaKey && !e.altKey) { e.preventDefault(); cycleTheme() }
        else if (e.key === "g" && !e.metaKey && !e.altKey) { e.preventDefault(); cycleLanguage() }
        return
      }

      if (!e.metaKey && !e.altKey) {
        if (e.key in NAVIGATION_SHORTCUTS) {
          e.preventDefault()
          router.push(NAVIGATION_SHORTCUTS[e.key])
          return
        }
        if (e.key === "m") { e.preventDefault(); cycleTheme() }
        else if (e.key === "g") { e.preventDefault(); cycleLanguage() }
        else if (e.key === "r" && refreshCatEl) { e.preventDefault(); (refreshCatEl as HTMLButtonElement).click() }
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [router, pathname, theme, setTheme, i18n, cycleTheme, cycleLanguage, refreshCatEl])

  return null
}

// ============================================================================
// useDebounce - Debounced value hook
// ============================================================================
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
