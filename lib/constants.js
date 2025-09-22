import { kk } from "date-fns/locale"

// Add these constants if they don't already exist
export const SITE_URL = "https://jarema.me"
export const SITE_NAME = "Jarema's digital garden"
export const SITE_DESCRIPTION = "Personal blog and portfolio website"

// Language constants
export const SUPPORTED_LANGUAGES = ["en", "vi", "et", "ru", "da", "tr", "zh", "pl", "sv", "fi", "tok"]

/**
 * @typedef {"en" | "vi" | "et" | "ru" | "da" | "tr" | "zh" | "pl" | "sv" | "fi" | "tok"} SupportedLanguage
 */

/**
 * @type {Object.<SupportedLanguage, string>}
 */
export const LANGUAGE_NAMES = {
  en: "English",
  vi: "Tiếng Việt",
  et: "Eesti",
  ru: "Русский",
  da: "Dansk",
  tr: "Türkçe",
  zh: "简体中文",
  pl: "Polski",
  sv: "Svenska",
  fi: "Suomi",
  tok: "toki pona",
  el: "Ελληνικά",
  cs: "Čeština",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  ja: "日本語",
  eo: "Esperanto",
  ms: "Bahasa Melayu",
  id: "Bahasa Indonesia",
  no: "Norsk",
  lt: "Lietuvių",
  lv: "Latviski",
  hu: "Magyar",
  kk: "Қазақша",
  ia: "Interlingua",
  tlh: "tlhIngan Hol",
}

/**
 * @type {Object.<SupportedLanguage, string>}
 */
export const LANGUAGE_FLAGS = {
  en: "🇺🇸",
  vi: "🇻🇳",
  et: "🇪🇪",
  ru: "🇷🇺",
  da: "🇩🇰",
  tr: "🇹🇷",
  zh: "🇨🇳",
  pl: "🇵🇱",
  sv: "🇸🇪",
  fi: "🇫🇮",
  tok: "😇",
  el: "🇬🇷",
  cs: "🇨🇿",
  fr: "🇫🇷",
  de: "🇩🇪",
  es: "🇪🇸",
  it: "🇮🇹",
  ja: "🇯🇵",
  eo: "🌍",
  ms: "🇲🇾",
  id: "🇮🇩",
  no: "🇳🇴",
  lt: "🇱🇹",
  lv: "🇱🇻",
  hu: "🇭🇺",
  kk: "🇰🇿",
  ia: "🌍",
  tlh: "🛸",
}

/**
 * @type {Object.<SupportedLanguage, string>}
 */
export const LANGUAGE_COUNTRY_CODES = {
  en: "US",
  vi: "VN",
  et: "EE",
  ru: "RU",
  da: "DK",
  tr: "TR",
  zh: "CN",
  pl: "PL",
  sv: "SE",
  fi: "FI",
  tok: "AQ",
  el: "GR",
  cs: "CZ",
  fr: "FR",
  de: "DE",
  es: "ES",
  it: "IT",
  ja: "JP",
  eo: "AQ",
  ms: "MY",
  id: "ID",
  no: "NO",
  lt: "LT",
  lv: "LV",
  hu: "HU",
  kk: "KZ",
  ia: "AQ",
  tlh: "AQ",
}

/**
 * @type {Object.<SupportedLanguage, string>}
 */
export const LANGUAGE_FONT_CLASSES = {
  en: "",
  vi: "",
  et: "",
  ru: "font-cyrillic",
  da: "",
  tr: "",
  zh: "font-chinese",
  pl: "",
  sv: "",
  fi: "",
  tok: "",
  el: "font-greek",
  cs: "",
  fr: "",
  de: "",
  es: "",
  it: "",
  ja: "font-japanese",
  eo: "",
  ms: "",
  id: "",
  no: "",
  lt: "",
  lv: "",
  hu: "",
  kk: "font-cyrillic",
  ia: "",
  tlh: "",
}

// Theme constants
export const THEMES = ["light", "dark", "system"]

/**
 * @typedef {"light" | "dark" | "system"} Theme
 */

// Navigation routes
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  PROJECTS: "/projects",
  BLOG: "/blog",
  NOW: "/now",
  USES: "/uses",
  CONTACT: "/contact",
  COLOPHON: "/colophon",
  SCRAPBOOK: "/scrapbook",
  SLASHES: "/slashes",
  TETRIS: "/tetris",
  GAME_2048: "/2048",
}

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  HOME: "h",
  ABOUT: "a",
  PROJECTS: "p",
  BLOG: "b",
  NOW: "n",
  USES: "u",
  CONTACT: "c",
  COLOPHON: "l",
  SLASHES: "/",
  SCRAPBOOK: "d",
  TETRIS: "t",
  GAME_2048: "z",
  THEME_TOGGLE: "m",
  LANGUAGE_TOGGLE: "g",
  REFRESH_CAT: "r",
  COMMAND_PALETTE: ".",
  KEYBOARD_SHORTCUTS: ",",
}

// Game pages
export const GAME_PAGES = [ROUTES.TETRIS, ROUTES.GAME_2048]
