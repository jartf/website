"use client"

import { useState, useEffect, useMemo, useCallback, useRef, useSyncExternalStore } from "react"
import { useTranslation } from "react-i18next"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { SUPPORTED_LANGUAGES, THEMES, KEYBOARD_SHORTCUTS, ROUTES } from "@/lib/constants"

// ============================================================================
// useMounted - Hydration-safe mounting detection using useSyncExternalStore
// ============================================================================
const mountedSubscribe = () => () => {}
const getMountedSnapshot = () => true
const getMountedServerSnapshot = () => false

export function useMounted() {
  return useSyncExternalStore(mountedSubscribe, getMountedSnapshot, getMountedServerSnapshot)
}

// ============================================================================
// useReducedMotion - Respects user's motion preferences (optimized)
// ============================================================================
const getReducedMotionSnapshot = () => {
  if (typeof window === "undefined" || !window.matchMedia) return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === "undefined" || !window.matchMedia) return () => {}
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
  mq.addEventListener("change", callback)
  return () => mq.removeEventListener("change", callback)
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false)
}

// ============================================================================
// useViewport - Responsive breakpoints with debounced resize + platform detection (optimized)
// ============================================================================
type ViewportState = {
  windowWidth: number
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isTouch: boolean
  isMac: boolean
  isWindows: boolean
  isLinux: boolean
}

// Singleton state for viewport - prevents multiple subscriptions
let viewportState: ViewportState | null = null
let viewportListeners = new Set<() => void>()
let resizeTimeout: NodeJS.Timeout | null = null

const getViewportState = (): ViewportState => {
  if (typeof window === "undefined") {
    return { isMobile: false, isTablet: false, isDesktop: false, windowWidth: 0, isTouch: false, isMac: false, isWindows: false, isLinux: false }
  }
  if (viewportState) return viewportState

  const width = window.innerWidth
  const p = navigator.platform.toLowerCase()
  viewportState = {
    windowWidth: width,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1280,
    isDesktop: width >= 1280,
    isTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    isMac: p.includes("mac"),
    isWindows: p.includes("win"),
    isLinux: p.includes("linux") || p.includes("x11"),
  }
  return viewportState
}

const updateViewportState = () => {
  if (typeof window === "undefined") return
  const width = window.innerWidth
  viewportState = {
    ...viewportState!,
    windowWidth: width,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1280,
    isDesktop: width >= 1280,
  }
  viewportListeners.forEach(listener => listener())
}

const subscribeViewport = (callback: () => void) => {
  viewportListeners.add(callback)

  // Set up resize listener once
  if (viewportListeners.size === 1 && typeof window !== "undefined") {
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(updateViewportState, 150)
    }
    window.addEventListener("resize", handleResize, { passive: true })
  }

  return () => {
    viewportListeners.delete(callback)
    if (viewportListeners.size === 0 && resizeTimeout) {
      clearTimeout(resizeTimeout)
      resizeTimeout = null
    }
  }
}

// Cached server snapshot to avoid infinite loop
const SERVER_VIEWPORT_STATE: ViewportState = {
  isMobile: false, isTablet: false, isDesktop: false, windowWidth: 0,
  isTouch: false, isMac: false, isWindows: false, isLinux: false
}

export function useViewport() {
  return useSyncExternalStore(subscribeViewport, getViewportState, () => SERVER_VIEWPORT_STATE)
}

/** @deprecated Use useViewport instead - kept for backwards compatibility */
export const usePlatform = useViewport

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

  // Persist visited languages to localStorage
  useEffect(() => {
    if (visitedLanguages.size > 0 && typeof window !== "undefined") {
      localStorage.setItem(LANGUAGE_TRACKER_KEY, JSON.stringify([...visitedLanguages]))
    }
  }, [visitedLanguages])

  // Check if all languages visited whenever visitedLanguages changes
  useEffect(() => {
    if (visitedLanguages.size >= SUPPORTED_LANGUAGES.length) {
      const allVisited = SUPPORTED_LANGUAGES.every(lang => visitedLanguages.has(lang))
      if (allVisited && !allLanguagesVisited) {
        queueMicrotask(() => setAllLanguagesVisited(true))
      }
    }
  }, [visitedLanguages, allLanguagesVisited])

  const trackLanguage = useCallback((code: string) => {
    if (!code) return
    setVisitedLanguages(prev => new Set([...prev, code]))
  }, [])

  const checkAllLanguagesVisited = useCallback(() => {
    const allVisited = SUPPORTED_LANGUAGES.every(lang => visitedLanguages.has(lang))
    return allVisited
  }, [visitedLanguages])

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
