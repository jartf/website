"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { SUPPORTED_LANGUAGES } from "@/lib/constants"

/**
 * Hook to detect and normalize the current language
 * @returns {string} The detected language code normalized to our supported languages
 */
export function useLanguageDetection() {
  const { i18n } = useTranslation()
  const [detectedLanguage, setDetectedLanguage] = useState(() => {
    // Get the detected language on initialization
    const rawLanguage = (typeof window !== "undefined" && i18n.language) || (typeof window !== "undefined" ? window.navigator.language : null) || "en"

    // Try exact match first
    if (SUPPORTED_LANGUAGES.includes(rawLanguage)) {
      return rawLanguage
    }

    // Try matching language code prefix (e.g., "en-US" should match "en")
    for (const lang of SUPPORTED_LANGUAGES) {
      if (rawLanguage.startsWith(lang)) {
        return lang
      }
    }

    // Default to English if no match
    return "en"
  })

  // keep <html lang> in sync with detection result
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", detectedLanguage)
    }
  }, [detectedLanguage])

  return detectedLanguage
}
