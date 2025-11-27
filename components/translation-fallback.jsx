"use client"

import { useTranslation } from "react-i18next"
import { useEffect, useState, useMemo } from "react"

/**
 * @typedef {Object} TranslationFallbackProps
 * @property {string} i18nKey - The translation key to look up
 * @property {string} [fallback] - Optional fallback text if translation is not found
 * @property {React.ReactNode} [children] - Optional children to render as fallback
 */

/**
 * Component that renders a translation or falls back to provided content
 * @param {TranslationFallbackProps} props
 */
export function TranslationFallback({ i18nKey, fallback, children }) {
  const { t, i18n } = useTranslation()
  const [isLoaded, setIsLoaded] = useState(false)

  const translatedText = useMemo(() => {
    if (i18n.isInitialized) {
      return t(i18nKey)
    }
    return ""
  }, [i18nKey, t, i18n.isInitialized, i18n.language])

  useEffect(() => {
    // Check if i18n is ready
    if (i18n.isInitialized && !isLoaded) {
      queueMicrotask(() => setIsLoaded(true))
    }
  }, [i18n.isInitialized, isLoaded])

  // If translations are loaded, show the translated text
  if (isLoaded && translatedText && translatedText !== i18nKey) {
    return <>{translatedText}</>
  }

  // If children are provided, use them as fallback
  if (children) {
    return <>{children}</>
  }

  // Use the provided fallback or the key itself
  return <>{fallback || i18nKey}</>
}
