// Site constants

export const siteUrl = "https://jarema.me";
export const siteName = "Jarema's digital garden";
export const siteDescription = "Personal blog and portfolio website";

// Supported languages
export const supportedLanguages = [
  { code: "en", name: "English", flag: "🇬🇧", main: true, aliases: ["English"] },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳", main: true, aliases: ["Vietnamese", "Tieng Viet"] },
  { code: "ru", name: "Русский", flag: "🇷🇺", main: true, aliases: ["Russian", "Russkii", "Russkiy"] },
  { code: "et", name: "Eesti", flag: "🇪🇪", main: true, aliases: ["Estonian"] },
  { code: "da", name: "Dansk", flag: "🇩🇰", main: true, aliases: ["Danish"] },
  { code: "zh", name: "中文", flag: "🇨🇳", main: true, aliases: ["Chinese", "Zhongwen", "Hanyu"] },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", beta: true, aliases: ["Turkish", "Turkce"] },
  { code: "pl", name: "Polski", flag: "🇵🇱", beta: true, aliases: ["Polish"] },
  { code: "sv", name: "Svenska", flag: "🇸🇪", beta: true, aliases: ["Swedish"] },
  { code: "fi", name: "Suomi", flag: "🇫🇮", beta: true, aliases: ["Finnish"] },
  { code: "tok", name: "toki pona", flag: "😇", other: true, aliases: ["language of the good"] },
  { code: "vih", name: "㗂越（漢喃）", flag: "🇻🇳", other: true, aliases: ["Vietnamese", "Han Nom", "Hannom"] },
] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number]["code"];

// Languages for hreflang tags (excludes tok and vih which don't have ISO codes)
export const hrefLangLanguages = supportedLanguages.filter((l) => l.code !== "tok" && l.code !== "vih");

// Completed translations
export const completedLanguages = ["en", "vi", "ru", "da"] as const;

// Theme constants
export const themes = ["light", "dark", "system"] as const;
export type Theme = (typeof themes)[number];

// Navigation routes
export const routes = {
  home: "/",
  about: "/about/",
  projects: "/projects/",
  blog: "/blog/",
  now: "/now/",
  uses: "/uses/",
  contact: "/contact/",
  guestbook: "/guestbook/",
  colophon: "/colophon/",
  scrapbook: "/scrapbook/",
  webring: "/webrings/",
  slashes: "/slashes/",
  tetris: "/tetris/",
  game2048: "/2048/",
  retro: "/retro/",
  badges: "/badges/",
} as const;

// Keyboard shortcuts
export const keyboardShortcuts: Record<string, string> = {
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
};

// Navigation items for header
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
] as const;

// Webrings data
export const webrings = [
  [
    "IndieWeb Webring 🕸💍",
    "https://xn--sr8hvo.ws",
    "https://xn--sr8hvo.ws/previous",
    "https://xn--sr8hvo.ws/random",
    "https://xn--sr8hvo.ws/next",
  ],
  [
    "The retronaut webring",
    "https://webring.dinhe.net/",
    "https://webring.dinhe.net/prev/https://jarema.me",
    "https://webring.dinhe.net/random",
    "https://webring.dinhe.net/next/https://jarema.me",
  ],
  [
    "Hotline Webring",
    "https://hotlinewebring.club/",
    "https://hotlinewebring.club/jar/previous",
    null,
    "https://hotlinewebring.club/jar/next",
  ],
  [
    "Bucket webring",
    "https://webring.bucketfish.me",
    "https://webring.bucketfish.me/redirect.html?to=prev&name=Jarema",
    "https://webring.bucketfish.me/redirect.html?to=random&name=Jarema",
    "https://webring.bucketfish.me/redirect.html?to=next&name=Jarema",
  ],
  [
    "Meta Ring",
    "https://meta-ring.hedy.dev/",
    "https://meta-ring.hedy.dev/previous",
    "https://meta-ring.hedy.dev/random",
    "https://meta-ring.hedy.dev/next",
  ],
  [
    "☆ Webmaster Webring ☆",
    "https://webmasterwebring.netlify.app/",
    "https://webmasterwebring.netlify.app?jarema-previous",
    "https://webmasterwebring.netlify.app?jarema-random",
    "https://webmasterwebring.netlify.app?jarema-next",
  ],
  [
    "Fediring",
    "https://fediring.net/",
    "https://fediring.net/previous?host=jarema.me",
    "https://fediring.net/random",
    "https://fediring.net/next?host=jarema.me",
  ],
  [
    "Geekring",
    "http://geekring.net/",
    "http://geekring.net/site/553/previous",
    "http://geekring.net/site/553/random",
    "http://geekring.net/site/553/next",
  ],
] as const;

// Footer badges
export interface FooterBadge {
  src: string;
  alt: string;
  href?: string;
}

export const footerBadges: FooterBadge[] = [
  {
    src: "/sweet.png",
    alt: "Sweet homepage",
  },
  {
    src: "/best_viewed_with_eyes.gif",
    alt: "Best viewed with Eyes",
  },
  {
    src: "/dumbass.gif",
    alt: "Dumbass webmaster ahead",
  },
  {
    src: "/join_logo.gif",
    alt: "White cat sleeping on a red pillow, miaow",
  },
  {
    src: "/bannars.gif",
    alt: "The Realm of Dream",
  },
  {
    src: "/teto.gif",
    alt: "Kasane Teto dancing",
  },
  {
    src: "/button2019.gif",
    alt: "Still using buttons in 2019!",
  },
  {
    src: "/people_pledge_badge_party_cream_pink_88x31.png",
    alt: "People Pledge",
    href: "https://people.pledge.party/",
  },
  {
    src: "/kagi-smallweb-yellow.gif",
    alt: "Kagi Small Web",
    href: "https://kagi.com/smallweb",
  },
  {
    src: "/internetprivacy.gif",
    alt: "Internet privacy Now!",
  },
  {
    src: "/saynotoweb3_88x31.gif",
    alt: "Keep the web free, say no to Web3",
    href: "https://yesterweb.org/no-to-web3/",
  },
  {
    src: "/valid-rss-rogers.png",
    alt: "Valid RSS",
    href: "/rss.xml",
  },
  {
    src: "/valid-atom.png",
    alt: "Valid Atom",
    href: "/atom.xml",
  },
  {
    src: "/humanstxt.png",
    alt: "Humans.txt",
    href: "/humans.txt",
  },
  { src: "/got_html.gif", alt: "Got HTML?" },
  {
    src: "/js-warning.gif",
    alt: "Page contains JavaScript!",
  },
  {
    src: "/fedora.gif",
    alt: "Fedora Linux",
    href: "https://fedoraproject.org/",
  },
  {
    src: "/anythingbut.gif",
    alt: "Anything but Chrome",
    href: "/blog/2025/08/anything-but-chrome",
  },
  {
    src: "/perfectclear.gif",
    alt: "Tetris",
    href: "/tetris",
  },
  {
    src: "/retrokid.gif",
    alt: "Retro kid",
    href: "/retro",
  },
];

// API configuration
export const domainHashes: Record<string, string> = {
  "jarema.me": "dh=1d651c707c7a9a0d03b235429393417f9506161c",
  "z.is-a.dev": "dh=151caf0b951e4ef19ec7ca771079fbed44c28970",
  localhost: "dh=2147463847test",
};

export const lastFmApiUrl =
  "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=jerryvu&api_key=c8526c48e3bd3c6f35e365480426f1be";

export const preMidConfig = {
  authorizedUserId: "490457129090547733",
  activityTimeoutMs: 20 * 60 * 1000,
  clearThresholdMs: 2 * 60 * 1000,
  productionHosts: new Set(["jarema.me", "www.jarema.me"]),
  maxActivities: 20,
  productionApiUrl: "https://jarema.me/api/premid",
  apiTimeoutMs: 5000,
};
