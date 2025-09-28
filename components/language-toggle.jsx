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
  const { i18n } = useTranslation()
  const mounted = useMounted()
  const { trackLanguage, checkAllLanguagesVisited } = useLanguageTracker()
  const [isWindows, setIsWindows] = useState(false)
  const buttonRef = useRef(null)
  const currentLanguage = useLanguageDetection()

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
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language}
            onClick={() => handleLanguageChange(language)}
            className={`${currentLanguage === language ? "bg-accent text-accent-foreground" : ""} ${LANGUAGE_FONT_CLASSES[language]}`}
          >
            {renderFlag(language)}
            {LANGUAGE_NAMES[language]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
