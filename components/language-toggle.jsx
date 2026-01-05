"use client"

import { useState, useEffect, useRef, useCallback, memo } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useLanguageTracker, useMounted, useCurrentLanguage } from "@/hooks"
import {
  supportedLanguages,
  languageNames,
  languageFlags,
  languageFontClasses,
  mainLanguages,
  otherLanguages,
  betaLanguages,
  languageAliases,
} from "@/lib/constants"
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill"
import fuzzysort from "fuzzysort"

// Build fuzzy search list
const buildSearchList = (list) =>
  list.map(lang => ({
    lang,
    terms: [
      languageNames[lang] || "",
      lang,
      ...(languageAliases[lang] || [])
    ].join(" ")
  }))

/**
 * Language toggle component that allows switching between supported languages
 * @returns {JSX.Element|null} The language toggle dropdown or null if not mounted
 */
export const LanguageToggle = memo(function LanguageToggle() {
  const { t, i18n } = useTranslation()
  const mounted = useMounted()
  const { trackLanguage, checkAllLanguagesVisited } = useLanguageTracker()
  const [isWindows, setIsWindows] = useState(false)
  const buttonRef = useRef(null)
  const currentLanguage = useCurrentLanguage(true) // syncHtmlLang=true
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const searchInputRef = useRef(null)
  const dropdownContentRef = useRef(null)
  const languageItemsRef = useRef([])

  // Fuzzy filter helper
  const filterLanguages = useCallback((list) => {
    if (!search.trim()) return list
    const searchList = buildSearchList(list)
    const results = fuzzysort.go(search, searchList, { key: "terms" })
    return results.map(r => r.obj.lang)
  }, [search])

  // Get all visible language items in order
  const getVisibleLanguages = useCallback(() => {
    const mainLangs = filterLanguages(mainLanguages)
    const betaLangs = filterLanguages(betaLanguages)
    const otherLangs = filterLanguages(otherLanguages)
    return [...mainLangs, ...betaLangs, ...otherLangs]
  }, [filterLanguages])

  const handleLanguageChange = useCallback((code) => {
    i18n.changeLanguage(code)
    // keep <html lang> in sync
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", code)

      // Conditionally load Noto Sans SC font for Chinese (zh) or Hán-Nôm (vih)
      if (code === "zh" || code === "vih") {
        // Check if font is already loaded
        if (!document.getElementById("noto-sans-sc-font")) {
          const link = document.createElement("link")
          link.id = "noto-sans-sc-font"
          link.rel = "stylesheet"
          link.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap"
          document.head.appendChild(link)

          // Add CSS variable for the font if not already present
          if (!document.getElementById("noto-sans-sc-var")) {
            const style = document.createElement("style")
            style.id = "noto-sans-sc-var"
            style.textContent = ':root { --font-noto-sans-sc: "Noto Sans SC", sans-serif; }'
            document.head.appendChild(style)
          }
        }
      }
    }
    trackLanguage(code)
    checkAllLanguagesVisited()
    setIsOpen(false)
  }, [i18n, trackLanguage, checkAllLanguagesVisited])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return

    const visibleLanguages = getVisibleLanguages()
    const totalItems = visibleLanguages.length

    if (totalItems === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setFocusedIndex((prev) => {
          const next = prev < totalItems - 1 ? prev + 1 : 0
          // Scroll into view
          setTimeout(() => {
            languageItemsRef.current[next]?.scrollIntoView({ block: "nearest", behavior: "smooth" })
          }, 0)
          return next
        })
        break

      case "ArrowUp":
        e.preventDefault()
        setFocusedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : totalItems - 1
          // Scroll into view
          setTimeout(() => {
            languageItemsRef.current[next]?.scrollIntoView({ block: "nearest", behavior: "smooth" })
          }, 0)
          return next
        })
        break

      case "Enter":
      case " ":
        e.preventDefault()
        if (focusedIndex >= 0 && focusedIndex < totalItems) {
          const selectedLang = visibleLanguages[focusedIndex]
          handleLanguageChange(selectedLang)
          setIsOpen(false)
        }
        break

      case "Escape":
        e.preventDefault()
        setIsOpen(false)
        buttonRef.current?.focus()
        break

      case "Tab":
        e.preventDefault()
        // Keep focus trapped in dropdown, cycle back to search input
        if (e.shiftKey) {
          searchInputRef.current?.focus()
          setFocusedIndex(-1)
        } else {
          // If on search input or no focus, move to first item
          if (focusedIndex === -1) {
            setFocusedIndex(0)
          } else {
            searchInputRef.current?.focus()
            setFocusedIndex(-1)
          }
        }
        break

      default:
        // If typing and not focused on search, focus search input
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          searchInputRef.current?.focus()
        }
        break
    }
  }, [isOpen, focusedIndex, getVisibleLanguages, handleLanguageChange])

  useEffect(() => {
    // Run flag emoji polyfill on mount
    polyfillCountryFlagEmojis()

    // Check if the user is on Windows
    if (typeof window !== "undefined") {
      setIsWindows(navigator.userAgent.indexOf("Windows") !== -1)
    }
  }, [])

  // Reset search and focus when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearch("")
      setFocusedIndex(-1)
      languageItemsRef.current = []
    }
  }, [isOpen])

  // Attach keyboard event listener when dropdown is open
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  if (!mounted) return null

  // Render flag using emoji; on Windows apply Twemoji Country Flags font
  const renderFlag = (language) => {
    if (!supportedLanguages.includes(language)) return null
    return <span className={`mr-2 ${isWindows ? "emoji-flag" : ""}`}>{languageFlags[language]}</span>
  }

  // Helper to render a language item
  const renderLanguageItem = (language, index) => (
    <DropdownMenuItem
      key={language}
      ref={(el) => {
        if (el) languageItemsRef.current[index] = el
      }}
      onClick={() => handleLanguageChange(language)}
      onMouseEnter={() => setFocusedIndex(index)}
      className={`${currentLanguage === language ? "bg-accent text-accent-foreground" : ""} ${focusedIndex === index ? "bg-accent text-accent-foreground" : ""} ${languageFontClasses[language]}`}
    >
      {renderFlag(language)}
      {languageNames[language]}
    </DropdownMenuItem>
  )

  // Render language sections with proper indexing
  const renderLanguageSections = () => {
    const mainLangs = filterLanguages(mainLanguages)
    const betaLangs = filterLanguages(betaLanguages)
    const otherLangs = filterLanguages(otherLanguages)

    let currentIndex = 0
    const sections = []

    if (mainLangs.length > 0) {
      sections.push(
        <div key="main-header" className="col-span-2 px-2 py-1 text-xs font-semibold text-muted-foreground">
          {t("language.main", "Main languages")}
        </div>
      )
      mainLangs.forEach((lang) => {
        sections.push(renderLanguageItem(lang, currentIndex))
        currentIndex++
      })
    }

    if (betaLangs.length > 0) {
      sections.push(
        <div key="beta-header" className="col-span-2 px-2 py-1 text-xs font-semibold text-muted-foreground">
          {t("language.beta", "Languages in beta")}
        </div>
      )
      betaLangs.forEach((lang) => {
        sections.push(renderLanguageItem(lang, currentIndex))
        currentIndex++
      })
    }

    if (otherLangs.length > 0) {
      sections.push(
        <div key="other-header" className="col-span-2 px-2 py-1 text-xs font-semibold text-muted-foreground">
          {t("language.other", "Other languages")}
        </div>
      )
      otherLangs.forEach((lang) => {
        sections.push(renderLanguageItem(lang, currentIndex))
        currentIndex++
      })
    }

    return sections
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Toggle language"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          id="language-toggle-button"
        >
          <Globe className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Toggle language, current: {languageNames[currentLanguage] || currentLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        ref={dropdownContentRef}
        align="end"
        className="grid grid-cols-1 md:grid-cols-2 gap-1"
        role="menu"
        aria-label={t("language.selectLanguage", "Select language")}
        onCloseAutoFocus={(e) => {
          // Return focus to button when closing
          e.preventDefault()
          buttonRef.current?.focus()
        }}
      >
        {/* Search bar */}
        <div className="col-span-2 px-2 pt-1 pb-2">
          <label htmlFor="language-search" className="sr-only">{t("language.search", "Search languages")}</label>
          <input
            ref={searchInputRef}
            id="language-search"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("language.search", "Search languages...")}
            className="w-full px-2 py-1 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            autoFocus
            aria-label={t("language.search", "Search languages")}
            aria-controls="language-list"
            onKeyDown={(e) => {
              // Let global handler manage navigation
              if (["ArrowDown", "ArrowUp", "Enter", "Escape", "Tab"].includes(e.key)) {
                e.preventDefault()
              }
            }}
          />
        </div>

        {renderLanguageSections()}
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
