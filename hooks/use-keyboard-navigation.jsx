"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useTheme } from "next-themes"
import { SUPPORTED_LANGUAGES } from "@/lib/constants"

// Define supported themes
const SUPPORTED_THEMES = ["light", "dark", "system"]

// Define navigation shortcuts
const NAVIGATION_SHORTCUTS = {
  h: "/",
  a: "/about",
  b: "/blog",
  p: "/projects",
  n: "/now",
  u: "/uses",
  c: "/contact",
  l: "/colophon",
  "/": "/slashes",
  d: "/scrapbook",
  z: "/2048",
  t: "/tetris",
}

/**
 * Hook that handles keyboard navigation throughout the site
 * @returns {null} This hook doesn't return anything, it just sets up event listeners
 */
export function useKeyboardNavigation() {
  const router = useRouter()
  const pathname = usePathname()
  const { i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [uiElements, setUIElements] = useState({
    themeToggle: null,
    languageToggle: null,
    refreshCat: null,
  })

  /**
   * Find UI elements that can be controlled via keyboard
   */
  const findUIElements = useCallback(() => {
    const langToggle = document.querySelector('button[aria-label="Toggle language"]')
    const themeToggle = document.querySelector('button[aria-label="Toggle theme"]')
    const refreshCat = document.querySelector('button[aria-label="Refresh mood cat"]')

    setUIElements({
      languageToggle: langToggle,
      themeToggle: themeToggle,
      refreshCat: refreshCat,
    })
  }, [])

  // Find elements on mount and when pathname changes
  useEffect(() => {
    // Try immediately
    findUIElements()

    // And also after a delay to ensure DOM is loaded
    const timer = setTimeout(findUIElements, 1000)

    return () => clearTimeout(timer)
  }, [pathname, findUIElements])

  /**
   * Handle theme cycling
   */
  const cycleTheme = useCallback(() => {
    const currentTheme = theme || "system"
    const themeIndex = SUPPORTED_THEMES.indexOf(currentTheme)
    const nextTheme = SUPPORTED_THEMES[(themeIndex + 1) % SUPPORTED_THEMES.length]
    setTheme(nextTheme)
  }, [theme, setTheme])

  /**
   * Handle language cycling
   */
  const cycleLanguage = useCallback(() => {
    const currentLang = i18n.language || "en"
    // Try exact match first
    let langIndex = SUPPORTED_LANGUAGES.indexOf(currentLang)
    // If not found, fallback to prefix match
    if (langIndex === -1) {
      langIndex = SUPPORTED_LANGUAGES.findIndex((lang) => currentLang.startsWith(lang))
    }
    if (langIndex === -1) langIndex = 0
    const nextLangIndex = (langIndex + 1) % SUPPORTED_LANGUAGES.length
    const nextLang = SUPPORTED_LANGUAGES[nextLangIndex]
    i18n.changeLanguage(nextLang)
    // keep <html lang> in sync
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", nextLang)
    }
  }, [i18n])

  /**
   * Navigate to a specific path
   * @param {string} path - The path to navigate to
   */
  const navigateTo = useCallback(
    (path) => {
      router.push(path)
    },
    [router],
  )

  useEffect(() => {
    /**
     * Handle keydown events for navigation
     * @param {KeyboardEvent} e - The keyboard event
     */
    const handleKeyDown = (e) => {

      // Skip if user is typing in an input, textarea, or contentEditable element
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        (document.activeElement && document.activeElement.getAttribute("contenteditable") === "true")
      ) {
        return
      }

      // Skip all site keyboard shortcuts if Ctrl is held
      if (e.ctrlKey) {
        return
      }

      // Check if we're in a game page
      const isGamePage = pathname?.includes("/2048") || pathname?.includes("/tetris")

      // Only allow specific shortcuts in game pages
      if (isGamePage) {
        // Only allow 'h' shortcut in game pages
        if (e.key === "h" && !e.metaKey && !e.altKey) {
          e.preventDefault()
          navigateTo("/")
        }
        // Allow theme toggle with 'm'
        else if (e.key === "m" && !e.metaKey && !e.altKey) {
          e.preventDefault()
          cycleTheme()
        }
        // Allow language toggle with 'g'
        else if (e.key === "g" && !e.metaKey && !e.altKey) {
          e.preventDefault()
          cycleLanguage()
        }
        return
      }

      // Navigation shortcuts
      if (!e.metaKey && !e.altKey) {
        // Check if the key is a navigation shortcut
        if (e.key in NAVIGATION_SHORTCUTS) {
          e.preventDefault()
          navigateTo(NAVIGATION_SHORTCUTS[e.key])
          return
        }

        // Handle other special shortcuts
        switch (e.key) {
          case "m":
            e.preventDefault()
            cycleTheme()
            break
          case "g":
            e.preventDefault()
            cycleLanguage()
            break
          case "r":
            // Refresh mood cat if on a page with the mood cat
            if (uiElements.refreshCat) {
              e.preventDefault()
              uiElements.refreshCat.click()
            }
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [router, pathname, uiElements, theme, setTheme, i18n, cycleTheme, cycleLanguage, navigateTo])

  return null
}
