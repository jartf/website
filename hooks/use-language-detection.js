"use client"

import { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { SUPPORTED_LANGUAGES } from "@/lib/constants"

/**
 * Hook to detect and normalize the current language
 * @returns {string} The detected language code normalized to our supported languages
 */
export function useLanguageDetection() {
  const { i18n } = useTranslation()

  const detectedLanguage = useMemo(() => {
    const rawLanguage = i18n.language || "en"

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
  }, [i18n.language])

  // keep <html lang> in sync with detection result
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", detectedLanguage)
    }
  }, [detectedLanguage])

  return detectedLanguage
}
