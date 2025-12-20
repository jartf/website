import Link from "next/link"
import { generateMetadata } from "@/lib/metadata"
import { getAllBlogPosts } from "@/lib/blog"
import { Button } from "@/components/ui/button"
import { MoodCat } from "@/components/mood-cat"
import { EasterEgg } from "@/components/easter-egg"
import {
  NowSection,
  Greeting,
  TranslatedText,
  TranslationLoadingSpinner,
} from "./HomeClientInteractive"
import { generateWebSiteSchema, generatePersonSchema, renderJsonLd } from "@/lib/structured-data"
import { nowItems } from "@/content/now-items"

export const metadata = generateMetadata({
  title: "Home",
  description: "Economics major, sometimes coder, most times cat whisperer.",
  isHomePage: true,
})

// Static content for SSR (English)
const STATIC_CONTENT = {
  heading: "hi there, i'm Jarema",
  subheading: "Economics major, sometimes coder, most times cat whisperer.",
  contactButton: "Contact me",
  aboutButton: "About me",
  blogButton: "Read my blog",
  guestbookButton: "Sign my guestbook",
  recentPosts: "Recent blog posts",
  minRead: "min read",
  mood: "Mood",
  guestbook: "Guestbook",
  webrings: "Webrings",
}

/**
 * Formats a date string into a verbose, human-readable format.
 */
function formatVerboseDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en", { year: 'numeric', month: 'long', day: 'numeric' })
}

/**
 * The home page component - server-rendered with minimal client interactivity
 * @returns {JSX.Element} The home page component.
 */
export default async function Home() {
  const blogPosts = await getAllBlogPosts()
  // Get English posts for SSR display
  const recentPosts = blogPosts.filter(post => post.language === "en").slice(0, 3)

  // Get latest 3 now items for SSR (English content)
  const latestNowItems = nowItems
    .filter(item => item.content && (item.content.en || item.content.en))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map(item => ({
      category: item.category,
      title: item.category.charAt(0).toUpperCase() + item.category.slice(1),
      content: item.content.en || item.content.en,
      date: item.date,
    }))

  const staticNowData = latestNowItems.length > 0 ? latestNowItems : null

  // Generate structured data for homepage
  const webSiteSchema = generateWebSiteSchema()
  const personSchema = generatePersonSchema()

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Structured Data for Google Rich Results */}
      {renderJsonLd([webSiteSchema, personSchema])}

      {/* Loading spinner for translations - client */}
      <TranslationLoadingSpinner />

      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-8 lg:py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section with Curved Shape */}
          <div className="relative pt-8 lg:pt-12 pb-16 lg:pb-20 mb-8">
            {/* Curved shape for light mode - CSS controls visibility */}
            <div className="absolute top-0 left-0 right-0 h-64 -z-10 overflow-hidden light-only">
              <div className="w-full h-[500px] bg-gray-100 rounded-[100%] transform translate-y-[-70%]"></div>
            </div>

            <div className="text-center">
              {/* Greeting - client component (time-based) */}
              <Greeting />

              {/* Heading - server rendered with client translation */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <TranslatedText i18nKey="home.heading" fallback={STATIC_CONTENT.heading} />
              </h1>

              {/* Subheading - server rendered with client translation */}
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                <TranslatedText i18nKey="home.subheading" fallback={STATIC_CONTENT.subheading} />
              </p>

              {/* CTA Buttons - server rendered structure */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button variant="default" size="lg" className="w-full sm:w-auto">
                    <TranslatedText i18nKey="home.contactButton" fallback={STATIC_CONTENT.contactButton} />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <TranslatedText i18nKey="home.aboutButton" fallback={STATIC_CONTENT.aboutButton} />
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <TranslatedText i18nKey="home.blogButton" fallback={STATIC_CONTENT.blogButton} />
                  </Button>
                </Link>
                <Link href="/guestbook">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <TranslatedText i18nKey="home.guestbookButton" fallback={STATIC_CONTENT.guestbookButton} />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop: Two-column layout for Now + Blog Posts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* Latest Now Entry Section - client component (API fetching) */}
            <div className="lg:order-2">
              <NowSection initialData={staticNowData} />
            </div>

            {/* Recent Blog Posts Section - server rendered */}
            {recentPosts && recentPosts.length > 0 && (
              <div className="lg:order-1">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  <TranslatedText i18nKey="home.recentPosts" fallback={STATIC_CONTENT.recentPosts} />
                </h2>
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div key={post.slug} className="h-entry">
                      <Link href={`/blog/${post.slug}`} className="block group u-url" passHref>
                        <div className="border rounded-lg p-4 hover:shadow-md transition-all bg-card group-hover:border-primary/50">
                          <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors p-name">{post.title}</h3>
                          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                            <time className="dt-published" dateTime={post.date}>{formatVerboseDate(post.date)}</time>
                            <span>•</span>
                            <span>{post.readingTime} {STATIC_CONTENT.minRead}</span>
                          </div>
                          <p className="text-muted-foreground line-clamp-2 text-sm p-summary">{post.excerpt}</p>
                        </div>
                      </Link>
                      {/* Hidden h-card for author information - outside Link to avoid nested anchors */}
                      <div className="p-author h-card" style={{ display: 'none' }}>
                        <span className="p-name" data-url="https://jarema.me">Jarema</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center lg:hidden">
                  <Link href="/blog">
                    <Button variant="outline" size="default" className="w-full sm:w-auto">
                      <TranslatedText i18nKey="home.blogButton" fallback={STATIC_CONTENT.blogButton} />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Desktop: Two-column layout for MoodCat + Webrings */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* MoodCat - client component */}
            <div>
              <MoodCat />
            </div>

            {/* Webrings Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4 text-center">
                <TranslatedText i18nKey="home.webrings" fallback={STATIC_CONTENT.webrings} />
              </h2>
              <div className="border rounded-lg p-4 bg-card divide-y text-sm">
              {/* IndieWeb Webring */}
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <a
                  href="https://xn--sr8hvo.ws"
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener"
                >
                  IndieWeb Webring 🕸💍
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href="https://xn--sr8hvo.ws/previous"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Previous site in IndieWeb webring"
                    title="Previous"
                  >
                    ←
                  </a>
                  <span className="px-2 py-1 invisible" aria-hidden="true">🎲</span>
                  <a
                    href="https://xn--sr8hvo.ws/next"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Next site in IndieWeb webring"
                    title="Next"
                  >
                    →
                  </a>
                </div>
              </div>

              {/* Retronaut Webring */}
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <a
                  href="https://webring.dinhe.net/"
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener"
                >
                  The retronaut webring
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href="https://webring.dinhe.net/prev/https://jarema.me"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Previous site in the retronaut webring"
                    title="Previous"
                  >
                    ←
                  </a>
                  <span className="px-2 py-1 invisible" aria-hidden="true">🎲</span>
                  <a
                    href="https://webring.dinhe.net/next/https://jarema.me"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Next site in the retronaut webring"
                    title="Next"
                  >
                    →
                  </a>
                </div>
              </div>

              {/* Hotline Webring */}
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <a
                  href="https://hotlinewebring.club/"
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener"
                >
                  Hotline Webring
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href="https://hotlinewebring.club/jar/previous"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Previous site in Hotline webring"
                    title="Previous"
                  >
                    ←
                  </a>
                  <span className="px-2 py-1 invisible" aria-hidden="true">🎲</span>
                  <a
                    href="https://hotlinewebring.club/jar/next"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Next site in Hotline webring"
                    title="Next"
                  >
                    →
                  </a>
                </div>
              </div>

              {/* Bucket Webring */}
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <a
                  href="https://webring.bucketfish.me"
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener"
                >
                  Bucket webring
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href="https://webring.bucketfish.me/redirect.html?to=prev&name=Jarema"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Previous site in Bucket webring"
                    title="Previous"
                  >
                    ←
                  </a>
                  <a
                    href="https://webring.bucketfish.me/redirect.html?to=random&name=Jarema"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Random site in Webmaster webring"
                    title="Random"
                  >
                    🎲
                  </a>
                  <a
                    href="https://webring.bucketfish.me/redirect.html?to=next&name=Jarema"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Next site in Bucket webring"
                    title="Next"
                  >
                    →
                  </a>
                </div>
              </div>

              {/* The Online Webring */}
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <a
                  href="https://webring.ghostk.id/online/"
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener"
                >
                  The Online webring
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href="https://webring.ghostk.id/online/jarema/previous"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Previous site in The Online webring"
                    title="Previous"
                  >
                    ←
                  </a>
                  <a
                    href="https://webring.ghostk.id/online/random"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Random site in The Online webring"
                    title="Random"
                  >
                    🎲
                  </a>
                  <a
                    href="https://webring.ghostk.id/online/jarema/next"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Next site in The Online webring"
                    title="Next"
                  >
                    →
                  </a>
                </div>
              </div>

              {/* Meta Ring */}
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <a
                  href="https://meta-ring.hedy.dev/"
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener"
                >
                  Meta Ring
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href="https://meta-ring.hedy.dev/previous"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Previous site in Meta Ring"
                    title="Previous"
                  >
                    ←
                  </a>
                  <a
                    href="https://meta-ring.hedy.dev/random"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Random site in Meta Ring"
                    title="Random"
                  >
                    🎲
                  </a>
                  <a
                    href="https://meta-ring.hedy.dev/next"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Next site in Meta Ring"
                    title="Next"
                  >
                    →
                  </a>
                </div>
              </div>

              {/* Webmaster Webring */}
              <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <a
                  href="https://webmasterwebring.netlify.app/"
                  className="text-primary hover:underline font-medium"
                  target="_blank"
                  rel="noopener"
                >
                  ☆ Webmaster Webring ☆
                </a>
                <div className="flex items-center gap-2">
                  <a
                    href="https://webmasterwebring.netlify.app?jarema-previous"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Previous site in Webmaster webring"
                    title="Previous"
                  >
                    ←
                  </a>
                  <a
                    href="https://webmasterwebring.netlify.app?jarema-random"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Random site in Webmaster webring"
                    title="Random"
                  >
                    🎲
                  </a>
                  <a
                    href="https://webmasterwebring.netlify.app?jarema-next"
                    className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors"
                    aria-label="Next site in Webmaster webring"
                    title="Next"
                  >
                    →
                  </a>
                </div>
              </div>
              </div>
            </div>
          </div>

          {/* Guestbook Section - full width below the two-column layout */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-center">
              <TranslatedText i18nKey="guestbook.title" fallback={STATIC_CONTENT.guestbook} />
            </h2>
            <div className="w-full border rounded-lg overflow-hidden shadow-lg bg-card">
              <iframe
                src="https://jarema.atabook.org"
                className="w-full h-[400px] lg:h-[500px] border-0"
                title="Guestbook"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Easter Egg - client component */}
      <EasterEgg />
    </main>
  )
}
