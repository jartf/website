import Link from "next/link"
import { generateMetadata } from "@/lib/metadata"
import { getAllBlogPosts } from "@/lib/blog"
import { Button } from "@/components/ui/button"
import { MoodCat } from "@/components/mood-cat"
import { EasterEgg } from "@/components/easter-egg"
import {
  NowSection,
  Greeting,
  AnimatedHeroContent,
  TranslatedText,
  TranslationLoadingSpinner,
} from "./HomeClientInteractive"
import { generateWebSiteSchema, generatePersonSchema, renderJsonLd } from "@/lib/structured-data"

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
  recentPosts: "Recent blog posts",
  minRead: "min read",
  mood: "Mood",
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

  // Generate structured data for homepage
  const webSiteSchema = generateWebSiteSchema()
  const personSchema = generatePersonSchema()

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {/* Structured Data for Google Rich Results */}
      {renderJsonLd([webSiteSchema, personSchema])}

      {/* Loading spinner for translations - client */}
      <TranslationLoadingSpinner />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section with Curved Shape */}
          <div className="relative pt-16 pb-24 mb-12">
            {/* Curved shape for light mode - CSS controls visibility */}
            <div className="absolute top-0 left-0 right-0 h-64 -z-10 overflow-hidden light-only">
              <div className="w-full h-[500px] bg-gray-100 rounded-[100%] transform translate-y-[-70%]"></div>
            </div>

            <div className="text-center">
              {/* Greeting - client component (time-based) */}
              <AnimatedHeroContent>
                <Greeting />
              </AnimatedHeroContent>

              {/* Heading - server rendered with client translation */}
              <AnimatedHeroContent delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                  <TranslatedText i18nKey="home.heading" fallback={STATIC_CONTENT.heading} />
                </h1>
              </AnimatedHeroContent>

              {/* Subheading - server rendered with client translation */}
              <AnimatedHeroContent delay={0.4}>
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  <TranslatedText i18nKey="home.subheading" fallback={STATIC_CONTENT.subheading} />
                </p>
              </AnimatedHeroContent>

              {/* CTA Buttons - server rendered structure */}
              <AnimatedHeroContent delay={0.6}>
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
                </div>
              </AnimatedHeroContent>
            </div>
          </div>

          {/* Latest Now Entry Section - client component (API fetching) */}
          <NowSection />

          {/* Recent Blog Posts Section - server rendered */}
          {recentPosts && recentPosts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <TranslatedText i18nKey="home.recentPosts" fallback={STATIC_CONTENT.recentPosts} />
              </h2>
              <div className="space-y-6">
                {recentPosts.map((post) => (
                  <div key={post.slug} className="h-entry">
                    <Link href={`/blog/${post.slug}`} className="block group u-url" passHref>
                      <div className="border rounded-lg p-5 hover:shadow-md transition-all bg-card group-hover:border-primary/50">
                        <h3 className="text-xl font-semibold mb-1 group-hover:text-primary transition-colors p-name">{post.title}</h3>
                        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                          <time className="dt-published" dateTime={post.date}>{formatVerboseDate(post.date)}</time>
                          <span>•</span>
                          <span>{post.readingTime} {STATIC_CONTENT.minRead}</span>
                          <span>•</span>
                          {post.mood && <span>{STATIC_CONTENT.mood}: {post.mood}</span>}
                          <span>•</span>
                          {post.language && <span>{post.language.toUpperCase()}</span>}
                        </div>
                        <p className="text-muted-foreground line-clamp-2 p-summary">{post.excerpt}</p>

                        {/* Hidden h-card for author information */}
                        <div className="p-author h-card" style={{ display: 'none' }}>
                          <a className="p-name u-url" href="https://jarema.me">Jarema</a>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/blog">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <TranslatedText i18nKey="home.blogButton" fallback={STATIC_CONTENT.blogButton} />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* MoodCat - client component */}
          <div className="mt-16">
            <MoodCat />
          </div>
        </div>
      </div>

      {/* Easter Egg - client component */}
      <EasterEgg />
    </main>
  )
}
