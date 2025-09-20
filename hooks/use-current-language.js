"use client"

import { useTranslation } from "react-i18next"

// Supported language codes
const SUPPORTED_LANGUAGES = ["en", "vi", "et", "ru", "da", "tr", "zh"]

/**
 * Hook to get the current language
 * @returns {string} The current language code
 */
export function useCurrentLanguage() {
  const { i18n } = useTranslation()

  // Get the current language, default to English if not supported
  const currentLang = (() => {
    // Get the detected language
    const detectedLang =
      i18n.language || (typeof window !== "undefined" ? window.navigator.language?.split("-")[0] : null) || "en"

    // Check if it's one of our supported languages
    if (SUPPORTED_LANGUAGES.includes(detectedLang)) {
      return detectedLang
    }

    // Handle language variants by checking the prefix
    for (const lang of SUPPORTED_LANGUAGES) {
      if (detectedLang.startsWith(lang)) {
        return lang
      }
    }

    // Default fallback
    return "en"
  })()

  return currentLang
}
