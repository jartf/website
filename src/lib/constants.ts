// Site constants - ported from Next.js _website-v4/lib/constants.js

export const siteUrl = "https://jarema.me";
export const siteName = "Jarema's digital garden";
export const siteDescription = "Personal blog and portfolio website";

// Language constants
export const supportedLanguages = ["en", "vi", "et", "ru", "da", "zh", "tr", "pl", "sv", "fi", "tok", "vih"] as const;

export type SupportedLanguage = (typeof supportedLanguages)[number];

// Languages for hreflang tags (excludes tok and vih which don't have ISO codes)
export const hrefLangLanguages = supportedLanguages.filter((l) => l !== "tok" && l !== "vih");

// Language classification for UI grouping
export const mainLanguages = ["en", "vi", "et", "ru", "da", "zh"] as const;
export const otherLanguages = ["tok", "vih"] as const;
export const betaLanguages = supportedLanguages.filter(
  (lang) => !mainLanguages.includes(lang as any) && !otherLanguages.includes(lang as any)
);

// Completed translations
export const completedLanguages = ["en", "vi", "ru", "da"] as const;

// Language aliases for search
export const languageAliases: Record<string, string[]> = {
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
};

export const languageNames: Record<string, string> = {
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
  vih: "㗂越（漢喃）",
};

export const languageFlags: Record<string, string> = {
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
  vih: "🇻🇳",
};

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

// Static navigation labels (English defaults)
export const navLabels: Record<string, string> = {
  home: "Home",
  about: "About",
  projects: "Projects",
  blog: "Blog",
  now: "Now",
  uses: "Uses",
  contact: "Contact",
  guestbook: "Guestbook",
  colophon: "Colophon",
  webring: "Webrings",
  slashes: "Slashes",
  scrapbook: "Scrapbook",
  tetris: "Tetris",
  game2048: "2048",
  badges: "Badges",
};

// Webrings data
export const webrings = [
  ["IndieWeb Webring 🕸💍", "https://xn--sr8hvo.ws", "https://xn--sr8hvo.ws/previous", "https://xn--sr8hvo.ws/random", "https://xn--sr8hvo.ws/next"],
  ["The retronaut webring", "https://webring.dinhe.net/", "https://webring.dinhe.net/prev/https://jarema.me", "https://webring.dinhe.net/random", "https://webring.dinhe.net/next/https://jarema.me"],
  ["Hotline Webring", "https://hotlinewebring.club/", "https://hotlinewebring.club/jar/previous", null, "https://hotlinewebring.club/jar/next"],
  ["Bucket webring", "https://webring.bucketfish.me", "https://webring.bucketfish.me/redirect.html?to=prev&name=Jarema", "https://webring.bucketfish.me/redirect.html?to=random&name=Jarema", "https://webring.bucketfish.me/redirect.html?to=next&name=Jarema"],
  ["Meta Ring", "https://meta-ring.hedy.dev/", "https://meta-ring.hedy.dev/previous", "https://meta-ring.hedy.dev/random", "https://meta-ring.hedy.dev/next"],
  ["☆ Webmaster Webring ☆", "https://webmasterwebring.netlify.app/", "https://webmasterwebring.netlify.app?jarema-previous", "https://webmasterwebring.netlify.app?jarema-random", "https://webmasterwebring.netlify.app?jarema-next"],
  ["Fediring", "https://fediring.net/", "https://fediring.net/previous?host=jarema.me", "https://fediring.net/random", "https://fediring.net/next?host=jarema.me"],
  ["Geekring", "http://geekring.net/", "http://geekring.net/site/553/previous", "http://geekring.net/site/553/random", "http://geekring.net/site/553/next"],
] as const;

// Footer badges
export interface FooterBadge {
  src: string;
  alt: string;
  href?: string;
}

export const footerBadges: FooterBadge[] = [
  { src: "/sweet.png", alt: "A blue banner showing the text Sweet homepage in all caps, next to the word weet is a moon and two stars." },
  { src: "/best_viewed_with_eyes.gif", alt: "An animated pixel art banner with the word Best in vertical and red background, next to the text viewed with Eyes in horizontal and gray background." },
  { src: "/dumbass.gif", alt: "An animated banner showing the text Danger in red background and vertical, next to the words Dumbass webmaster ahead in horizontal." },
  { src: "/join_logo.gif", alt: "An animated pixel art banner of a white cat sleeping on a red pillow, next to the word miaow." },
  { src: "/bannars.gif", alt: "An animated pixel art banner with the text The Realm of Dream on a rainbow background." },
  { src: "/teto.gif", alt: "An animated banner showing Kasane Teto dancing left and right" },
  { src: "/button2019.gif", alt: "A banner showing the text Still using buttons in 2019!" },
  { src: "/people_pledge_badge_party_cream_pink_88x31.png", alt: "A banner showing the text People Pledge.", href: "https://people.pledge.party/" },
  { src: "/kagi-smallweb-yellow.gif", alt: "An animated banner with Doggo of Kagi search engine.", href: "https://kagi.com/smallweb" },
  { src: "/internetprivacy.gif", alt: "An animated pixel art banner with a spinning globe, next to the words Internet privacy Now!" },
  { src: "/saynotoweb3_88x31.gif", alt: "An animated black banner showing the text Keep the web free, say no to Web3.", href: "https://yesterweb.org/no-to-web3/" },
  { src: "/valid-rss-rogers.png", alt: "A banner showing the RSS logo next to the text Valid RSS.", href: "/rss.xml" },
  { src: "/valid-atom.png", alt: "A banner showing the Atom logo next to the text Valid.", href: "/atom.xml" },
  { src: "/humanstxt.png", alt: "A banner showing the humans.txt wordmark", href: "/humans.txt" },
  { src: "/got_html.gif", alt: "A banner showing the text Got HTML?" },
  { src: "/js-warning.gif", alt: "A banner showing a caution sign next to the text Warning: Page contains JavaScript!" },
  { src: "/fedora.gif", alt: "A banner showing Powered by Fedora Linux.", href: "https://fedoraproject.org/" },
  { src: "/anythingbut.gif", alt: "A banner showing the Chrome logo crossed out.", href: "/blog/2025/08/anything-but-chrome" },
  { src: "/perfectclear.gif", alt: "An animated banner showing a Tetris gameplay.", href: "/tetris" },
  { src: "/retrokid.gif", alt: "An animated retro-style banner showing the pixelated text retrokid.", href: "/retro" },
];

// ============================================================================
// API Configuration (ported from _website-v4)
// ============================================================================

// Discord domain verification hashes (/.well-known/discord)
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
