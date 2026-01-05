// Add these constants if they don't already exist
export const siteUrl = "https://jarema.me"
export const siteName = "Jarema's digital garden"
export const siteDescription = "Personal blog and portfolio website"

// Language constants
export const supportedLanguages = ["en", "vi", "et", "ru", "da", "zh", "tr", "pl", "sv", "fi", "tok", "vih"]

// Languages for hreflang tags (excludes tok and vih which don't have ISO codes)
export const hrefLangLanguages = supportedLanguages.filter(l => l !== 'tok' && l !== 'vih')

// Language classification for UI grouping
export const mainLanguages = ["en", "vi", "et", "ru", "da", "zh"]
export const otherLanguages = ["tok", "vih"]
export const betaLanguages = supportedLanguages.filter(
  (lang) => !mainLanguages.includes(lang) && !otherLanguages.includes(lang)
)

// Completed translations (languages that don't show the "under construction" notice)
export const completedLanguages = ["en", "vi", "ru", "da"]

// Language aliases for search functionality
export const languageAliases = {
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
export const languageNames = {
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
export const languageFlags = {
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
export const languageFontClasses = {
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
export const themes = ["light", "dark", "system"]

/**
 * @typedef {"light" | "dark" | "system"} Theme
 */

// Navigation routes
export const routes = {
  home: "/",
  about: "/about",
  projects: "/projects",
  blog: "/blog",
  now: "/now",
  uses: "/uses",
  contact: "/contact",
  guestbook: "/guestbook",
  colophon: "/colophon",
  scrapbook: "/scrapbook",
  webring: "/webrings",
  slashes: "/slashes",
  tetris: "/tetris",
  game2048: "/2048",
  retro: "/retro",
}

// Keyboard shortcuts
export const keyboardShortcuts = {
  home: "h",
  about: "a",
  projects: "p",
  blog: "b",
  now: "n",
  uses: "u",
  contact: "c",
  guestbook: "g",
  colophon: "l",
  webring: "w",
  slashes: "/",
  scrapbook: "d",
  tetris: "t",
  game2048: "z",
  themeToggle: "m",
  languageToggle: "y",
  refreshCat: "r",
  commandPalette: ".",
  keyboardShortcuts: ",",
}

// Game pages
export const gamePages = [routes.tetris, routes.game2048]

// Navigation items for header (order matters for display)
export const navItems = [
  { href: routes.home, key: "home" },
  { href: routes.about, key: "about" },
  { href: routes.projects, key: "projects" },
  { href: routes.blog, key: "blog" },
  { href: routes.now, key: "now" },
  { href: routes.uses, key: "uses" },
  { href: routes.contact, key: "contact" },
  { href: routes.guestbook, key: "guestbook" },
  { href: routes.colophon, key: "colophon" },
  { href: routes.webring, key: "webring" },
]

// Routes that have retro equivalents (for legacy browser support)
export const retroRoutes = [
  "/",
  "/about",
  "/blog",
  "/projects",
  "/contact",
  "/now",
  "/uses",
]

// Discord domain verification hashes
export const domainHashes = {
  "jarema.me": "dh=1d651c707c7a9a0d03b235429393417f9506161c",
  "z.is-a.dev": "dh=151caf0b951e4ef19ec7ca771079fbed44c28970",
  "localhost": "dh=2147463847test",
}

// Tetris game configuration
export const tetrisConfig = {
  boardWidth: 10,
  boardHeight: 20,
  initialDropTime: 800,
  speedIncreaseFactor: 0.95,
  touchCooldown: 200,
}

// API Configuration
export const lastFmApiUrl = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=jerryvu&api_key=c8526c48e3bd3c6f35e365480426f1be"

// PreMID API Configuration
export const preMidConfig = {
  authorizedUserId: "490457129090547733",
  activityTimeoutMs: 20 * 60 * 1000,
  clearThresholdMs: 2 * 60 * 1000,
  productionHosts: new Set(["jarema.me", "www.jarema.me"]),
  maxActivities: 20,
  productionApiUrl: "https://jarema.me/api/premid",
  apiTimeoutMs: 5000,
}
