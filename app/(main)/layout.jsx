import { Space_Grotesk, Lexend, Roboto } from "next/font/google"
import localFont from "next/font/local"
import Script from "next/script"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LanguageNotice } from "@/components/language-notice"
import { Galaxy } from "@/components/galaxy/galaxy"
import { KeyboardNavigation } from "@/components/keyboard-navigation"
import { ActionSearchBar } from "@/components/action-search-bar"
import { FirstVisitHint } from "@/components/first-visit-hint"
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
  src: "../../public/fonts/Han-Nom-Gothic.otf",
  variable: "--font-han-nom",
  display: "swap",
  preload: false,
})

const HREFLANG_LANGUAGES = SUPPORTED_LANGUAGES.filter(l => l !== 'tok' && l !== 'vih')

const genFeeds = (types) => types.map(t => [
  { url: `${t[0]}.xml`, title: `Jarema's digital garden - ${t[1]} Feed` },
  ...SUPPORTED_LANGUAGES.map(lang => ({
    url: `${t[0]}/${lang}.xml`,
    title: `Jarema's digital garden - ${lang.toUpperCase()} ${t[1]} Feed`,
    hreflang: lang,
  }))
]).flat()

const FEED_URLS_RSS = genFeeds([['rss', 'RSS']])
const FEED_URLS_JSON = [
  { url: "feed.json", title: "Jarema's digital garden - FEED Feed" },
  ...SUPPORTED_LANGUAGES.map(lang => ({
    url: `feed/${lang}.json`,
    title: `Jarema's digital garden - ${lang.toUpperCase()} FEED Feed`,
    hreflang: lang,
  }))
]
const FEED_URLS_ATOM = genFeeds([['atom', 'ATOM']])

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
      { url: "/maskable_icon.png", sizes: "1024x1024", type: "image/png" },
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

        <meta name="theme-color" content="#2c2e84" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />

        {/* rel=me links for identity verification */}
        <link rel="me" href="https://github.com/jartf" />
        <link rel="me" href="https://pronouns.page/@jerryv" />

        {/* IndieAuth endpoints */}
        <link rel="authorization_endpoint" href="https://indieauth.com/auth" />
        <link rel="token_endpoint" href="https://tokens.indieauth.com/token" />

        {/* Webmention endpoint */}
        <link rel="webmention" href="https://webmention.io/jarema.me/webmention" />
        <link rel="microsub" href="https://aperture.p3k.io/microsub/1060" />

        <style>{`.emoji-flag{font-family:"Twemoji Country Flags","Twemoji Mozilla","Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol",sans-serif;font-variant-emoji:emoji}.js-disabled-banner{display:none;background:linear-gradient(135deg,#1e3a5f 0%,#2d4a6f 100%);color:#fff;padding:1rem;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;border-bottom:1px solid rgba(255,255,255,0.1)}.js-disabled-banner p{margin:0;font-size:0.875rem;line-height:1.5}.js-disabled-banner a{color:#60a5fa;text-decoration:underline}.js-disabled-banner a:hover{color:#93c5fd}@media(max-width:640px){.js-disabled-banner{padding:0.75rem}.js-disabled-banner p{font-size:0.8rem}}`}</style>

        {/* Wayback Machine detection and JavaScript blocker - must load first */}
        <Script src="/wayback-blocker.js" strategy="beforeInteractive" />

        <script dangerouslySetInnerHTML={{__html:`(function(){document.documentElement.classList.add('js-enabled');try{var s=${JSON.stringify(SUPPORTED_LANGUAGES)},r=(typeof localStorage!=='undefined'&&localStorage.getItem('i18nextLng'))||navigator.language||'',l=s.find(function(x){return r.toLowerCase()===x||r.toLowerCase().indexOf(x+'-')===0})||'en';document.documentElement.setAttribute('lang',l);if(l==='zh'||l==='vih'){var k=document.createElement('link');k.id='noto-sans-sc-font';k.rel='stylesheet';k.href='https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap';document.head.appendChild(k);var t=document.createElement('style');t.id='noto-sans-sc-var';t.textContent=':root{--font-noto-sans-sc:"Noto Sans SC",sans-serif}';document.head.appendChild(t)}}catch(e){document.documentElement.setAttribute('lang','en')}document.addEventListener('DOMContentLoaded',function(){var n=document.querySelector('.js-disabled-notice');if(n)n.style.display='none'})})();`}} />

        <script dangerouslySetInnerHTML={{__html:`(function(){try{var s=localStorage.getItem('theme'),p=window.matchMedia('(prefers-color-scheme:dark)').matches,t=s==='dark'||s==='light'?s:(s==='system'||!s)?(p?'dark':'light'):'dark';document.documentElement.classList.remove('light','dark');document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t}catch(e){var p=window.matchMedia('(prefers-color-scheme:dark)').matches;if(!p){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');document.documentElement.style.colorScheme='light'}else{document.documentElement.style.colorScheme='dark'}}})();`}} />

        {process.env.NODE_ENV === 'production' && (
          <script
            defer
            src="/stats/script.js"
            data-website-id="2e9dfa41-fbe7-4799-9adb-0a57b8141a54"
          ></script>
        )}
      </head>
      <body className="font-sans min-h-screen bg-background" suppressHydrationWarning>
        <noscript>
          <div className="js-disabled-banner" style={{display:"block"}}>
            <p>You&apos;re browsing without JavaScript. The site works, but some interactive features like toggles or search won&apos;t be available, and content will be limited to prevent scraping from bots and AI.</p>
          </div>
        </noscript>
        <div className="js-disabled-banner wayback-banner" style={{display:"none"}}>
          <p>You&apos;re viewing an archived version of this site via the Internet Archive&apos;s Wayback Machine. JavaScript has been disabled for compatibility. The content is preserved as static HTML.</p>
        </div>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="theme" disableTransitionOnChange>
          <I18nProvider>
            <Galaxy />
            <div className="flex flex-col min-h-screen relative z-10">
              <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg focus:ring-2 focus:ring-ring focus:outline-none">
                Skip to main content
              </a>
              <Header />
              <LanguageNotice />
              <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
              <Footer />
              <KeyboardNavigation />
            </div>
            <ActionSearchBar />
            <FirstVisitHint />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
