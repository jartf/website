// i18n configuration and utilities
import { atom, computed } from "nanostores";
import { supportedLanguages, completedLanguages, type SupportedLanguage } from "@/lib/constants";

// Global window types for i18n
declare global {
  interface Window {
    __INITIAL_LANG__?: string;
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

// Apply translations to DOM elements marked with data attributes.
// This is needed because Astro View Transitions swaps HTML without re-executing
// page/component scripts, so we must re-apply i18n after navigation.
export function applyDomTranslations(root: ParentNode | Document = document) {
  if (typeof window === "undefined") return;

  const doc = root as Document;
  const html = (doc.documentElement || document.documentElement) as HTMLElement | null;

  try {
    html?.classList.add("i18n-updating");

    const lang = languageStore.get();

    // Update text content for [data-i18n] and [data-t-key] elements.
    // Elements with data-t-texts (from <T> component) use pre-rendered translations;
    // others fall back to the t() lookup.
    root.querySelectorAll?.("[data-i18n], [data-t-key]")?.forEach((el) => {
      const key = el.getAttribute("data-i18n") || el.getAttribute("data-t-key");
      if (!key) return;

      // Fast path: use pre-rendered translations embedded by <T> component
      const textsAttr = el.getAttribute("data-t-texts");
      if (textsAttr) {
        try {
          const texts = JSON.parse(textsAttr);
          const text = texts[lang] || texts["en"] || key;
          if (el.textContent !== text) el.textContent = text;
          return;
        } catch {}
      }

      // Slow path: dynamic lookup
      const translated = t(key);
      if (translated !== key && el.textContent !== translated) {
        el.textContent = translated;
      }
    });

    root.querySelectorAll?.("[data-i18n-placeholder]")?.forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const translated = t(key);
      if (translated !== key && (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) {
        if (el.placeholder !== translated) el.placeholder = translated;
      }
    });
  } finally {
    requestAnimationFrame(() => html?.classList.remove("i18n-updating"));
  }
}

// Initialize language from localStorage or browser
export function initLanguage() {
  if (typeof window === "undefined") return "en";

  const stored = localStorage.getItem("i18nextLng");
  if (stored && translations[stored]) {
    languageStore.set(stored as SupportedLanguage);
    document.documentElement.lang = stored === "vih" ? "vi" : stored;
    return stored;
  }

  // Detect from browser, only auto-switch to completed languages
  const browserLang = navigator.language.split("-")[0];
  if (translations[browserLang] && (completedLanguages as readonly string[]).includes(browserLang)) {
    languageStore.set(browserLang as SupportedLanguage);
    document.documentElement.lang = browserLang;
    return browserLang;
  }

  return "en";
}

// Set language
export function setLanguage(lang: SupportedLanguage) {
  if (translations[lang]) {
    languageStore.set(lang);
    // Note: localStorage and document.documentElement.lang are updated
    // by the languageStore.subscribe handler above
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
