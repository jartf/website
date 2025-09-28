"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useLanguageTracker } from "@/hooks/use-language-tracker"
import { useMounted } from "@/hooks/use-mounted"
import { useLanguageDetection } from "@/hooks/use-language-detection"
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_NAMES,
  LANGUAGE_FLAGS,
  LANGUAGE_FONT_CLASSES,
} from "@/lib/constants"
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill"

/**
 * Language toggle component that allows switching between supported languages
 * @returns {JSX.Element|null} The language toggle dropdown or null if not mounted
 */
export function LanguageToggle() {
  const { t, i18n } = useTranslation()
  const mounted = useMounted()
  const { trackLanguage, checkAllLanguagesVisited } = useLanguageTracker()
  const [isWindows, setIsWindows] = useState(false)
  const buttonRef = useRef(null)
  const currentLanguage = useLanguageDetection()
  const [search, setSearch] = useState("")

  useEffect(() => {
    // Run flag emoji polyfill on mount
    polyfillCountryFlagEmojis()

    // Check if the user is on Windows
    if (typeof window !== "undefined") {
      setIsWindows(navigator.userAgent.indexOf("Windows") !== -1)
    }
  }, [])

  if (!mounted) return null

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code)
    // keep <html lang> in sync
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", code)
    }
    trackLanguage(code)
    checkAllLanguagesVisited()
  }

  // Render flag using emoji; on Windows apply Twemoji Country Flags font
  const renderFlag = (language) => {
    if (!SUPPORTED_LANGUAGES.includes(language)) return null
    return <span className={`mr-2 ${isWindows ? "emoji-flag" : ""}`}>{LANGUAGE_FLAGS[language]}</span>
  }

  // Language classification
  const MAIN_LANGUAGES = ["en", "vi", "et", "ru", "da", "zh"]
  const OTHER_LANGUAGES = ["tok", "vih"]
  const BETA_LANGUAGES = SUPPORTED_LANGUAGES.filter(
    (lang) => !MAIN_LANGUAGES.includes(lang) && !OTHER_LANGUAGES.includes(lang)
  )

  // Filter helper
  const filterLanguages = (list) =>
    list.filter(
      (lang) =>
        LANGUAGE_NAMES[lang].toLowerCase().includes(search.toLowerCase()) ||
        lang.toLowerCase().includes(search.toLowerCase())
    )

  // Helper to render a language item
  const renderLanguageItem = (language) => (
    <DropdownMenuItem
      key={language}
      onClick={() => handleLanguageChange(language)}
      className={`${currentLanguage === language ? "bg-accent text-accent-foreground" : ""} ${LANGUAGE_FONT_CLASSES[language]}`}
    >
      {renderFlag(language)}
      {LANGUAGE_NAMES[language]}
    </DropdownMenuItem>
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Toggle language"
          id="language-toggle-button"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="grid grid-cols-1 md:grid-cols-2 gap-1"
      >
        {/* Search bar */}
        <div className="col-span-2 px-2 pb-2">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("language.search", "Search languages...")}
            className="w-full px-2 py-1 rounded border border-input bg-background text-sm"
            autoFocus
          />
        </div>

        <div className="col-span-2 px-2 py-1 text-xs font-semibold text-muted-foreground">{t("language.main", "Main languages")}</div>
        {filterLanguages(MAIN_LANGUAGES).map(renderLanguageItem)}

        {BETA_LANGUAGES.length > 0 && (
          <>
            <div className="col-span-2 px-2 py-1 text-xs font-semibold text-muted-foreground">{t("language.beta", "Languages in beta")}</div>
            {filterLanguages(BETA_LANGUAGES).map(renderLanguageItem)}
          </>
        )}

        <div className="col-span-2 px-2 py-1 text-xs font-semibold text-muted-foreground">{t("language.other", "Other languages")}</div>
        {filterLanguages(OTHER_LANGUAGES).map(renderLanguageItem)}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
