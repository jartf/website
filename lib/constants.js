// Add these constants if they don't already exist
export const SITE_URL = "https://jarema.me"
export const SITE_NAME = "Jarema's Blog"
export const SITE_DESCRIPTION = "Personal blog and portfolio website"

// Language constants
export const SUPPORTED_LANGUAGES = ["en", "vi", "et", "ru", "da", "tr", "zh"]

/**
 * @typedef {"en" | "vi" | "et" | "ru" | "da" | "tr" | "zh"} SupportedLanguage
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
  tok: "Toki Pona",
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
  tok: "☺",
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
