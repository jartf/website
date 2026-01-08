// i18n configuration and utilities
import { atom, computed, onMount } from "nanostores";
import { supportedLanguages, type SupportedLanguage } from "@/lib/constants";

// Global window types for i18n
declare global {
  interface Window {
    __INITIAL_LANG__?: string;
    languageStore?: typeof languageStore;
  }
}

// Import all translations
import en from "./translations/en.json";
import vi from "./translations/vi.json";
import ru from "./translations/ru.json";
import et from "./translations/et.json";
import da from "./translations/da.json";
import tr from "./translations/tr.json";
import zh from "./translations/zh.json";
import pl from "./translations/pl.json";
import sv from "./translations/sv.json";
import fi from "./translations/fi.json";
import tok from "./translations/tok.json";
import viHani from "./translations/vi-Hani.json";

export { supportedLanguages, type SupportedLanguage } from "@/lib/constants";

export const translations: Record<string, Record<string, any>> = {
  en,
  vi,
  ru,
  et,
  da,
  tr,
  zh,
  pl,
  sv,
  fi,
  tok,
  vih: viHani,
};

// Persistent language store
export const languageStore = atom<SupportedLanguage>("en");

// Sync with localStorage on mount and changes
if (typeof window !== "undefined") {
  // Initialize from localStorage immediately
  const stored = localStorage.getItem("i18nextLng");
  if (stored && translations[stored]) {
    languageStore.set(stored as SupportedLanguage);
    document.documentElement.lang = stored === "vih" ? "vi" : stored;
  }

  // Persist changes to localStorage
  languageStore.subscribe((lang) => {
    localStorage.setItem("i18nextLng", lang);
    document.documentElement.lang = lang === "vih" ? "vi" : lang;
  });
}

// Get translation for the current language
export const currentTranslations = computed(languageStore, (lang) => {
  return translations[lang] || translations.en;
});

// Initialize language from localStorage or browser
export function initLanguage() {
  if (typeof window === "undefined") return "en";

  const stored = localStorage.getItem("i18nextLng");
  if (stored && translations[stored]) {
    languageStore.set(stored as SupportedLanguage);
    document.documentElement.lang = stored === "vih" ? "vi" : stored;
    return stored;
  }

  // Detect from browser
  const browserLang = navigator.language.split("-")[0];
  if (translations[browserLang]) {
    languageStore.set(browserLang as SupportedLanguage);
    document.documentElement.lang = browserLang === "vih" ? "vi" : browserLang;
    return browserLang;
  }

  return "en";
}

// Set language
export function setLanguage(lang: SupportedLanguage) {
  if (translations[lang]) {
    languageStore.set(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("i18nextLng", lang);
      document.documentElement.lang = lang === "vih" ? "vi" : lang;
    }
  }
}

// Cycle through languages
export function cycleLanguage() {
  const current = languageStore.get();
  const codes = supportedLanguages.map((l) => l.code);
  const currentIndex = codes.indexOf(current);
  const nextIndex = (currentIndex + 1) % codes.length;
  setLanguage(codes[nextIndex] as SupportedLanguage);
}

// Get nested translation value
export function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  const keys = path.split(".");
  let current = obj;

  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      return undefined;
    }
  }

  return typeof current === "string" ? current : undefined;
}

// Translate with parameter substitution
export function translateWithParams(
  value: string,
  params?: Record<string, string | number>,
): string {
  if (!params) return value;

  let result = value;
  for (const [key, val] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(val));
  }
  return result;
}

// Get translation by key
export function t(
  key: string,
  params?: Record<string, string | number>): string {
  const lang = languageStore.get();
  const trans = translations[lang] || translations.en;
  let value = getNestedValue(trans, key);

  // Fallback to English if not found
  if (!value && lang !== "en") {
    value = getNestedValue(translations.en, key);
  }

  if (!value) return key;

  return translateWithParams(value, params);
}

// Make store available globally and handle View Transitions
if (typeof window !== "undefined") {
  window.languageStore = languageStore;

  // Re-sync on View Transitions page navigation
  document.addEventListener("astro:after-swap", () => {
    const currentLang = languageStore.get();
    document.documentElement.lang = currentLang === "vih" ? "vi" : currentLang;
    window.__INITIAL_LANG__ = currentLang;
  });
}
