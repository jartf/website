"use client"

import { useEffect } from "react"
import i18n from "i18next"
import { initReactI18next, I18nextProvider } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Import translations statically to ensure they're available immediately
import enTranslations from "@/translations/en.json"
import viTranslations from "@/translations/vi.json"
import etTranslations from "@/translations/et.json"
import ruTranslations from "@/translations/ru.json"
import daTranslations from "@/translations/da.json"
import trTranslations from "@/translations/tr.json"
import zhTranslations from "@/translations/zh.json"
import plTranslations from "@/translations/pl.json"
import svTranslations from "@/translations/sv.json"
import fiTranslations from "@/translations/fi.json"
import tokTranslations from "@/translations/tok.json"

// Pre-bundled translations to avoid loading delay
const bundledTranslations = {
  en: { translation: enTranslations },
  vi: { translation: viTranslations },
  et: { translation: etTranslations },
  ru: { translation: ruTranslations },
  da: { translation: daTranslations },
  tr: { translation: trTranslations },
  zh: { translation: zhTranslations },
  pl: { translation: plTranslations },
  sv: { translation: svTranslations },
  fi: { translation: fiTranslations },
  tok: { translation: tokTranslations },
}

// Initialize i18next once
const initializeI18n = async () => {
  if (i18n.isInitialized) return i18n

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: bundledTranslations,
      fallbackLng: "en",
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
        lookupQuerystring: "lng",
        lookupCookie: "i18next",
        lookupLocalStorage: "i18nextLng",
        caches: ["localStorage", "cookie"],
        cookieExpirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
      },
      react: {
        useSuspense: false,
      },
    })

  return i18n
}

// Initialize i18n on the client side
if (typeof window !== "undefined") {
  initializeI18n()
}

/**
 * Provider component for i18next internationalization
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 */
export function I18nProvider({ children }) {
  useEffect(() => {
    // Initialize i18n on the client side
    const init = async () => {
      await initializeI18n()
    }

    init()
  }, [])

  // Render children directly without loading screen
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
