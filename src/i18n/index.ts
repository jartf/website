// i18n configuration and utilities
import { atom, computed } from 'nanostores';

// Import all translations
import en from './translations/en.json';
import vi from './translations/vi.json';
import ru from './translations/ru.json';
import et from './translations/et.json';
import da from './translations/da.json';
import tr from './translations/tr.json';
import zh from './translations/zh.json';
import pl from './translations/pl.json';
import sv from './translations/sv.json';
import fi from './translations/fi.json';
import tok from './translations/tok.json';
import viHani from './translations/vi-Hani.json';

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

// Supported languages with metadata
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧', main: true, aliases: ['English'] },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳', main: true, aliases: ['Vietnamese', 'Tieng Viet'] },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', main: true, aliases: ['Russian', 'Russkii', 'Russkiy'] },
  { code: 'et', name: 'Eesti', flag: '🇪🇪', main: true, aliases: ['Estonian'] },
  { code: 'da', name: 'Dansk', flag: '🇩🇰', main: true, aliases: ['Danish'] },
  { code: 'zh', name: '中文', flag: '🇨🇳', main: true, aliases: ['Chinese', 'Zhongwen', 'Hanyu'] },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', beta: true, aliases: ['Turkish', 'Turkce'] },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', beta: true, aliases: ['Polish'] },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪', beta: true, aliases: ['Swedish'] },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮', beta: true, aliases: ['Finnish'] },
  { code: 'tok', name: 'toki pona', flag: '😇', other: true, aliases: ['language of the good'] },
  { code: 'vih', name: '㗂越（漢喃）', flag: '🇻🇳', other: true, aliases: ['Vietnamese', 'Han Nom', 'Hannom'] },
] as const;

export type SupportedLanguage = typeof supportedLanguages[number]['code'];

// Language store
export const languageStore = atom<SupportedLanguage>('en');

// Get translation for the current language
export const currentTranslations = computed(languageStore, (lang) => {
  return translations[lang] || translations.en;
});

// Initialize language from localStorage or browser
export function initLanguage() {
  if (typeof window === 'undefined') return 'en';

  const stored = localStorage.getItem('i18nextLng');
  if (stored && translations[stored]) {
    languageStore.set(stored as SupportedLanguage);
    return stored;
  }

  // Detect from browser
  const browserLang = navigator.language.split('-')[0];
  if (translations[browserLang]) {
    languageStore.set(browserLang as SupportedLanguage);
    return browserLang;
  }

  return 'en';
}

// Set language
export function setLanguage(lang: SupportedLanguage) {
  if (translations[lang]) {
    languageStore.set(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lang);
      document.documentElement.lang = lang === 'vih' ? 'vi' : lang;
    }
  }
}

// Cycle through languages
export function cycleLanguage() {
  const current = languageStore.get();
  const codes = supportedLanguages.map(l => l.code);
  const currentIndex = codes.indexOf(current);
  const nextIndex = (currentIndex + 1) % codes.length;
  setLanguage(codes[nextIndex] as SupportedLanguage);
}

// Get nested translation value
function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }

  return typeof current === 'string' ? current : undefined;
}

// Translation function
export function t(key: string, params?: Record<string, string | number>): string {
  const lang = languageStore.get();
  const trans = translations[lang] || translations.en;

  let value = getNestedValue(trans, key);

  // Fallback to English if not found
  if (!value && lang !== 'en') {
    value = getNestedValue(translations.en, key);
  }

  // If still not found, return the key
  if (!value) return key;

  // Replace parameters like {{name}}
  if (params) {
    for (const [paramKey, paramValue] of Object.entries(params)) {
      value = value.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(paramValue));
    }
  }

  return value;
}

// Hook-like function for reactive translations (for React components)
export function useTranslation() {
  return {
    t,
    language: languageStore,
    setLanguage,
    cycleLanguage,
    supportedLanguages,
  };
}
