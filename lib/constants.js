// Add these constants if they don't already exist
export const SITE_URL = "https://jarema.me"
export const SITE_NAME = "Jarema's digital garden"
export const SITE_DESCRIPTION = "Personal blog and portfolio website"

// Language constants
export const SUPPORTED_LANGUAGES = ["en", "vi", "et", "ru", "da", "zh", "tr", "pl", "sv", "fi", "tok", "vih"]

// Languages for hreflang tags (excludes tok and vih which don't have ISO codes)
export const HREFLANG_LANGUAGES = SUPPORTED_LANGUAGES.filter(l => l !== 'tok' && l !== 'vih')

// Language classification for UI grouping
export const MAIN_LANGUAGES = ["en", "vi", "et", "ru", "da", "zh"]
export const OTHER_LANGUAGES = ["tok", "vih"]
export const BETA_LANGUAGES = SUPPORTED_LANGUAGES.filter(
  (lang) => !MAIN_LANGUAGES.includes(lang) && !OTHER_LANGUAGES.includes(lang)
)

// Completed translations (languages that don't show the "under construction" notice)
export const COMPLETED_LANGUAGES = ["en", "vi", "ru", "da"]

// Language aliases for search functionality
export const LANGUAGE_ALIASES = {
  vi: ["Vietnamese", "Tieng Viet"],
  et: ["Estonian"],
  ru: ["Russian", "Russkii", "Russkiy"],
  da: ["Danish"],
  zh: ["Chinese", "Zhongwen", "Hanyu"],
  tr: ["Turkish", "Turkce"],
  pl: ["Polish"],
  sv: ["Swedish"],
  fi: ["Finnish"],
  tok: ["language of the good"],
  vih: ["Vietnamese", "Han Nom", "Hannom"],
}

/**
 * @typedef {"en" | "vi" | "et" | "ru" | "da" | "zh" | "tr" | "pl" | "sv" | "fi" | "tok" | "vih"} SupportedLanguage
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
  vih: "㗂越（漢喃）",
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
  vih: "🇻🇳",
  ia: "🌍",
  tlh: "🛸",
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
  vih: "font-han-nom",
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
  GUESTBOOK: "/guestbook",
  COLOPHON: "/colophon",
  SCRAPBOOK: "/scrapbook",
  WEBRING: "/webrings",
  SLASHES: "/slashes",
  TETRIS: "/tetris",
  GAME_2048: "/2048",
  RETRO: "/retro",
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
  GUESTBOOK: "g",
  COLOPHON: "l",
  WEBRING: "w",
  SLASHES: "/",
  SCRAPBOOK: "d",
  TETRIS: "t",
  GAME_2048: "z",
  THEME_TOGGLE: "m",
  LANGUAGE_TOGGLE: "y",
  REFRESH_CAT: "r",
  COMMAND_PALETTE: ".",
  KEYBOARD_SHORTCUTS: ",",
}

// Game pages
export const GAME_PAGES = [ROUTES.TETRIS, ROUTES.GAME_2048]

// Navigation items for header (order matters for display)
export const NAV_ITEMS = [
  { href: ROUTES.HOME, key: "home" },
  { href: ROUTES.ABOUT, key: "about" },
  { href: ROUTES.PROJECTS, key: "projects" },
  { href: ROUTES.BLOG, key: "blog" },
  { href: ROUTES.NOW, key: "now" },
  { href: ROUTES.USES, key: "uses" },
  { href: ROUTES.CONTACT, key: "contact" },
  { href: ROUTES.GUESTBOOK, key: "guestbook" },
  { href: ROUTES.COLOPHON, key: "colophon" },
  { href: ROUTES.WEBRING, key: "webring" },
]

// Routes that have retro equivalents (for legacy browser support)
export const RETRO_ROUTES = [
  "/",
  "/about",
  "/blog",
  "/projects",
  "/contact",
  "/now",
  "/uses",
]

// Discord domain verification hashes
export const DOMAIN_HASHES = {
  "jarema.me": "dh=1d651c707c7a9a0d03b235429393417f9506161c",
  "z.is-a.dev": "dh=151caf0b951e4ef19ec7ca771079fbed44c28970",
  "localhost": "dh=2147463847test",
}

// Tetris game configuration
export const TETRIS_CONFIG = {
  BOARD_WIDTH: 10,
  BOARD_HEIGHT: 20,
  INITIAL_DROP_TIME: 800,
  SPEED_INCREASE_FACTOR: 0.95,
  TOUCH_COOLDOWN: 200,
}
