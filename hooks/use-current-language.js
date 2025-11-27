"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { SUPPORTED_LANGUAGES } from "@/lib/constants"

/**
 * Hook to get the current language
 * @returns {string} The current language code
 */
export function useCurrentLanguage() {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const detectedLang = i18n.language || (typeof window !== "undefined" ? window.navigator.language?.split("-")[0] : null) || "en"

    if (SUPPORTED_LANGUAGES.includes(detectedLang)) return detectedLang

    const matchedLang = SUPPORTED_LANGUAGES.find(lang => detectedLang.startsWith(lang))
    return matchedLang || "en"
  })

  useEffect(() => {
    const detectedLang = i18n.language || "en"

    if (SUPPORTED_LANGUAGES.includes(detectedLang)) {
      setCurrentLanguage(detectedLang)
      return
    }

    const matchedLang = SUPPORTED_LANGUAGES.find(lang => detectedLang.startsWith(lang))
    setCurrentLanguage(matchedLang || "en")
  }, [i18n.language])

  return currentLanguage
}
