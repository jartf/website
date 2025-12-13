import { Space_Grotesk, Lexend, Roboto } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LanguageNotice } from "@/components/language-notice"
import { Galaxy } from "@/components/galaxy/galaxy"
import { KeyboardNavigation } from "@/components/keyboard-navigation"
import { ActionSearchBar } from "@/components/action-search-bar"
import { ErrorBoundary } from "@/components/error-boundary"
import { SUPPORTED_LANGUAGES } from "@/lib/constants"

// Font configurations
const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const lexend = Lexend({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
})

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  preload: false,
})

const hanNom = localFont({
  src: "../public/fonts/Han-Nom-Gothic.otf",
  variable: "--font-han-nom",
  display: "swap",
  preload: false,
})


// Exclude 'tok' and 'vih' from hreflang/language alternates
const HREFLANG_LANGUAGES = SUPPORTED_LANGUAGES.filter((lang) => lang !== 'tok' && lang !== 'vih')

const FEED_URLS_RSS = [
  { url: "rss.xml", title: "Jarema's digital garden - RSS Feed" },
  ...SUPPORTED_LANGUAGES.map((lang) => ({
    url: `rss/${lang}.xml`,
    title: `Jarema's digital garden - ${lang.charAt(0).toUpperCase() + lang.slice(1)} RSS Feed`,
    hreflang: lang,
  })),
]

const FEED_URLS_JSON = [
  { url: "feed.json", title: "Jarema's digital garden - FEED Feed" },
  ...SUPPORTED_LANGUAGES.map((lang) => ({
    url: `feed/${lang}.json`,
    title: `Jarema's digital garden - ${lang.charAt(0).toUpperCase() + lang.slice(1)} FEED Feed`,
    hreflang: lang,
  })),
]

const FEED_URLS_ATOM = [
  { url: "atom.xml", title: "Jarema's digital garden - ATOM Feed" },
  ...SUPPORTED_LANGUAGES.map((lang) => ({
    url: `atom/${lang}.xml`,
    title: `Jarema's digital garden - ${lang.charAt(0).toUpperCase() + lang.slice(1)} ATOM Feed`,
    hreflang: lang,
  })),
]

export const metadata = {
  description:
    "A personal playground and digital garden for Jarema - featuring projects, blog posts, and multilingual content about economics, coding, and more.",
  keywords: ["Jarema", "digital garden", "personal website", "blog", "economics", "coding", "multilingual"],
  authors: [{ name: "Jarema" }],
  creator: "Jarema",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jarema.me/",
    siteName: "Jarema's digital garden",
    images: [{ url: "/android-chrome-512x512.png", width: 512, height: 512, alt: "Jarema's digital garden" }],
  },
  twitter: {
    card: "summary",
    images: ["/android-chrome-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: { url: "/apple-touch-icon.png" },
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  metadataBase: new URL("https://jarema.me"),
  alternates: {
    canonical: "/",
    languages: Object.fromEntries(HREFLANG_LANGUAGES.map((lang) => [lang, "/"])),
    types: {
      "application/rss+xml": FEED_URLS_RSS,
      "application/json": FEED_URLS_JSON,
      "application/atom+xml": FEED_URLS_ATOM,
    },
  },
}

/**
 * Root layout component for the application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {JSX.Element} The root layout component
 */
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`dark ${spaceGrotesk.variable} ${lexend.variable} ${roboto.variable} ${hanNom.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* rel=me links for identity verification */}
        <link rel="me" href="https://github.com/jartf" />
        <link rel="me" href="https://pronouns.page/@jerryv" />

        {/* Prefer Twemoji Country Flags on platforms (like Windows) that lack native flag emoji support */}
        <style>
          {`
            .emoji-flag {
              font-family: "Twemoji Country Flags", "Twemoji Mozilla", "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
              font-variant-emoji: emoji;
            }
          `}
        </style>

        {/* Banner notice for users without JavaScript - non-blocking */}
        <style>
          {`
            .js-disabled-banner {
              display: none;
              background: linear-gradient(135deg, #1e3a5f 0%, #2d4a6f 100%);
              color: #ffffff;
              padding: 1rem;
              text-align: center;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            .js-disabled-banner p {
              margin: 0;
              font-size: 0.875rem;
              line-height: 1.5;
            }
            .js-disabled-banner a {
              color: #60a5fa;
              text-decoration: underline;
            }
            .js-disabled-banner a:hover {
              color: #93c5fd;
            }
            @media (max-width: 640px) {
              .js-disabled-banner {
                padding: 0.75rem;
              }
              .js-disabled-banner p {
                font-size: 0.8rem;
              }
            }
          `}
        </style>

        {/* JavaScript Detection + Early Language Bootstrapping */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                document.documentElement.classList.add('js-enabled');
                try {
                  var supported = ${JSON.stringify(SUPPORTED_LANGUAGES)};
                  var raw = (typeof localStorage !== 'undefined' && localStorage.getItem('i18nextLng')) || navigator.language || '';
                  var lang = supported.find(function(s) { return raw.toLowerCase() === s || raw.toLowerCase().indexOf(s + '-') === 0; }) || 'en';
                  document.documentElement.setAttribute('lang', lang);

                  // Only load Noto Sans SC font for Chinese (zh) or Hán-Nôm (vih)
                  if (lang === 'zh' || lang === 'vih') {
                    var link = document.createElement('link');
                    link.id = 'noto-sans-sc-font';
                    link.rel = 'stylesheet';
                    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap';
                    document.head.appendChild(link);

                    // Add CSS variable for the font
                    var style = document.createElement('style');
                    style.id = 'noto-sans-sc-var';
                    style.textContent = ':root { --font-noto-sans-sc: "Noto Sans SC", sans-serif; }';
                    document.head.appendChild(style);
                  }
                } catch (e) {
                  document.documentElement.setAttribute('lang', 'en');
                }
                document.addEventListener('DOMContentLoaded', function() {
                  var notice = document.querySelector('.js-disabled-notice');
                  if (notice) notice.style.display = 'none';
                });
              })();
            `,
          }}
        />

        {/*
          CSS-First Theme Detection Script
          This runs synchronously BEFORE first paint to prevent flash of wrong theme.
          Priority: localStorage > system preference > default (dark)
          Sets the .dark or .light class on <html> element for CSS to use.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme;

                  if (stored === 'dark' || stored === 'light') {
                    theme = stored;
                  } else if (stored === 'system' || !stored) {
                    theme = prefersDark ? 'dark' : 'light';
                  } else {
                    theme = 'dark'; // default fallback
                  }

                  // Remove existing theme classes (SSR may have set 'dark' as default)
                  document.documentElement.classList.remove('light', 'dark');
                  document.documentElement.classList.add(theme);

                  // Also set the color-scheme property for native form elements
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {
                  // If JS fails, keep the default 'dark' class from SSR
                  // Only change if system preference indicates light mode
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (!prefersDark) {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.style.colorScheme = 'light';
                  } else {
                    document.documentElement.style.colorScheme = 'dark';
                  }
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans min-h-screen bg-background">
        {/* Non-blocking banner notice for users without JavaScript */}
        <noscript>
          <div className="js-disabled-banner" style={{ display: "block" }}>
            <p>
              You&apos;re browsing without JavaScript. The site works, but some interactive features like toggles or search won&apos;t be available, and content will be limited to prevent scraping from bots and AI.
            </p>
          </div>
        </noscript>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="theme" disableTransitionOnChange>
          <I18nProvider>
            <ErrorBoundary>
              {/* Galaxy is now conditionally rendered in I18nProvider during loading */}
              <Galaxy />
              <div className="flex flex-col min-h-screen relative z-10">
                {/* Skip to main content link for keyboard users (WCAG 2.4.1) */}
                <a
                  href="#main-content"
                  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-ring focus:outline-none"
                >
                  Skip to main content
                </a>
                <Header />
                <LanguageNotice />
                <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
                <Footer />
                <KeyboardNavigation />
              </div>
              <ActionSearchBar />
            </ErrorBoundary>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
