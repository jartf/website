import { Space_Grotesk, Lexend, Roboto, Noto_Sans_SC } from "next/font/google"
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
import { MotionProvider } from "@/components/motion-provider"
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

const notoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-sc",
  display: "swap",
  preload: false,
})

const hanNom = localFont({
  src: "../public/fonts/Han-Nom-Gothic.otf",
  variable: "--font-han-nom",
  display: "swap",
  preload: false,
})

// Helper to generate feed URLs
const generateFeedUrls = (type, ext) => [
  { url: `${type}.${ext}`, title: `Jarema's digital garden - ${type.toUpperCase()} Feed` },
  ...SUPPORTED_LANGUAGES.map((lang) => ({
    url: `${type}/${lang}.${ext}`,
    title: `Jarema's digital garden - ${lang.charAt(0).toUpperCase() + lang.slice(1)} ${type.toUpperCase()} Feed`,
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
    languages: Object.fromEntries(SUPPORTED_LANGUAGES.map((lang) => [lang, "/"])),
    types: {
      "application/rss+xml": generateFeedUrls("rss", "xml"),
      "application/json": generateFeedUrls("feed", "json"),
      "application/atom+xml": generateFeedUrls("atom", "xml"),
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
      className={`${spaceGrotesk.variable} ${lexend.variable} ${roboto.variable} ${notoSansSC.variable} ${hanNom.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Prefer Twemoji Country Flags on platforms (like Windows) that lack native flag emoji support */}
        <style>
          {`
            .emoji-flag {
              font-family: "Twemoji Country Flags", "Twemoji Mozilla", "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
              font-variant-emoji: emoji;
            }
          `}
        </style>

        {/* Full screen notice for users without JavaScript */}
        <style>
          {`
            .js-disabled-notice {
              display: none;
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
              color: #ffffff;
              z-index: 99999;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              padding: 2rem;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .js-disabled-notice h1 {
              font-size: 3rem;
              font-weight: 700;
              margin-bottom: 1rem;
              background: linear-gradient(45deg, #60a5fa, #a78bfa);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
            .js-disabled-notice p {
              font-size: 1.25rem;
              line-height: 1.6;
              margin-bottom: 2rem;
              max-width: 600px;
              opacity: 0.9;
            }
            .js-disabled-notice a {
              display: inline-block;
              background: linear-gradient(45deg, #60a5fa, #a78bfa);
              color: white;
              padding: 1rem 2rem;
              border-radius: 0.5rem;
              text-decoration: none;
              font-weight: 600;
              font-size: 1.125rem;
              transition: transform 0.2s ease, box-shadow 0.2s ease;
            }
            .js-disabled-notice a:hover {
              transform: translateY(-2px);
              box-shadow: 0 10px 25px rgba(96, 165, 250, 0.3);
            }
            .js-disabled-notice .subtitle {
              font-size: 1rem;
              opacity: 0.7;
              margin-top: 2rem;
            }
            @media (max-width: 768px) {
              .js-disabled-notice h1 {
                font-size: 2rem;
              }
              .js-disabled-notice p {
                font-size: 1.125rem;
              }
              .js-disabled-notice {
                padding: 1rem;
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
      </head>
      <body className="font-sans min-h-screen bg-background">
        {/* Full screen notice for users without JavaScript */}
        <noscript>
          <div className="js-disabled-notice" style={{ display: "flex" }}>
            <h1>JavaScript is required</h1>
            <p>
              This site relies heavily on interactive features, and they won&apos;t function properly without JavaScript. Please enable JavaScript for this site, or use a modern browser (preferably Librewolf or Brave for added privacy, Firefox or Safari are also fine). If you&apos;re using Tor Browser, see below :D
            </p>
            <p>
            Using Tor Browser? Prefer to keep JavaScript disabled? I have a static version of this site you can browse instead :D
            </p>
            <a href="https://hugo.jarema.me" rel="nofollow">
              Visit static site
            </a>
            <p className="subtitle">I&apos;d love to avoid JavaScript, but sadly large-scale scrapers and AI companies are mass scraping the internet and JS is the easiet way for me to slow that down right now. Using JS also means I can utilize interactive features with less hassle. That said, a no-JS solution without redirection is currently a work-in-progress.</p>
          </div>
        </noscript>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <MotionProvider>
            <I18nProvider>
              <ErrorBoundary>
                {/* Galaxy is now conditionally rendered in I18nProvider during loading */}
                <Galaxy />
                <div className="flex flex-col min-h-screen relative z-10">
                  <Header />
                  <LanguageNotice />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <KeyboardNavigation />
                </div>
                <ActionSearchBar />
              </ErrorBoundary>
            </I18nProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
