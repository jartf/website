// Single source of truth for i18n, optimized for fast synchronous init

import i18next from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

// Import translations statically for instant availability
import enTranslations from "@/translations/en.json"
import viTranslations from "@/translations/vi.json"
import viHaniTranslations from "@/translations/vi-Hani.json"
import etTranslations from "@/translations/et.json"
import ruTranslations from "@/translations/ru.json"
import daTranslations from "@/translations/da.json"
import trTranslations from "@/translations/tr.json"
import zhTranslations from "@/translations/zh.json"
import plTranslations from "@/translations/pl.json"
import svTranslations from "@/translations/sv.json"
import fiTranslations from "@/translations/fi.json"
import tokTranslations from "@/translations/tok.json"

const bundledTranslations = {
  en: { translation: enTranslations },
  vi: { translation: viTranslations },
  vih: { translation: viHaniTranslations },
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

// Synchronous init for fastest possible load
if (!i18next.isInitialized) {
  i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: bundledTranslations,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      detection: {
        order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
        lookupQuerystring: "lng",
        lookupCookie: "i18next",
        lookupLocalStorage: "i18nextLng",
        caches: ["localStorage", "cookie"],
        cookieExpirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      },
      react: { useSuspense: false },
      // No backend, no async loading
      initImmediate: false,
    })
}

export default i18next
