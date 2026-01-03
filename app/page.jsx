import Link from "next/link"
import { generateMetadata } from "@/lib/metadata"
import { getAllBlogPosts } from "@/lib/blog"
import { Button } from "@/components/ui/button"
import { MoodCat } from "@/components/mood-cat"
import { EasterEgg } from "@/components/easter-egg"
import { NowSection, Greeting, BlogPostMeta, RecentPosts } from "./client"
import { TranslatedText } from "@/components/translated-text"
import { generateWebSiteSchema, generatePersonSchema, renderJsonLd } from "@/lib/structured-data"
import { nowItems } from "@/content/now-items"
import { formatDate } from "@/lib/utils"

export const metadata = generateMetadata({
  title: "Home",
  description: "Economics major, sometimes coder, most times cat whisperer.",
  isHomePage: true,
})

const STATIC = {
  heading: "hi there, i'm Jarema",
  subheading: "Economics major, sometimes coder, most times cat whisperer.",
  contactButton: "Contact me",
  aboutButton: "About me",
  blogButton: "Read my blog",
  guestbookButton: "Sign my guestbook",
  recentPosts: "Recent blog posts",
  minRead: "min read",
  webrings: "Webrings",
}

export default async function Home() {
  const lang = 'en' // Always render with English on server, client handles language switching
  const t = (await import('@/translations/en.json')).default
  const blogPosts = await getAllBlogPosts()

  // Pass all posts to client component for language-based filtering
  const allPosts = blogPosts

  const staticNowData = nowItems
    .filter(i => i.content?.[lang] || i.content?.en)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map(i => {
      const d = new Date(i.date)
      return {
        category: i.category,
        title: i.category.charAt(0).toUpperCase() + i.category.slice(1),
        content: i.content[lang] || i.content.en,
        date: `${formatDate(d, lang)} at ${d.toLocaleTimeString(lang, {hour:'2-digit',minute:'2-digit',hour12:false,timeZoneName:'short'})}`,
      }
    })

  const T = ({k, f}) => <TranslatedText i18nKey={k} fallback={f} />

  const webrings = [
    ['IndieWeb Webring 🕸💍', 'https://xn--sr8hvo.ws', 'https://xn--sr8hvo.ws/previous', 'https://xn--sr8hvo.ws/random', 'https://xn--sr8hvo.ws/next'],
    ['The retronaut webring', 'https://webring.dinhe.net/', 'https://webring.dinhe.net/prev/https://jarema.me', 'https://webring.dinhe.net/random', 'https://webring.dinhe.net/next/https://jarema.me'],
    ['Hotline Webring', 'https://hotlinewebring.club/', 'https://hotlinewebring.club/jar/previous', null, 'https://hotlinewebring.club/jar/next'],
    ['Bucket webring', 'https://webring.bucketfish.me', 'https://webring.bucketfish.me/redirect.html?to=prev&name=Jarema', 'https://webring.bucketfish.me/redirect.html?to=random&name=Jarema', 'https://webring.bucketfish.me/redirect.html?to=next&name=Jarema'],
    ['Meta Ring', 'https://meta-ring.hedy.dev/', 'https://meta-ring.hedy.dev/previous', 'https://meta-ring.hedy.dev/random', 'https://meta-ring.hedy.dev/next'],
    ['☆ Webmaster Webring ☆', 'https://webmasterwebring.netlify.app/', 'https://webmasterwebring.netlify.app?jarema-previous', 'https://webmasterwebring.netlify.app?jarema-random', 'https://webmasterwebring.netlify.app?jarema-next'],
    ['Fediring', 'https://fediring.net/', 'https://fediring.net/previous?host=jarema.me', 'https://fediring.net/random', 'https://fediring.net/next?host=jarema.me'],
    ['Geekring', 'http://geekring.net/', 'http://geekring.net/site/553/previous', 'http://geekring.net/site/553/random', 'http://geekring.net/site/553/next'],
    ['Epic WebRing', 'https://epic1.nekoweb.org/webring/', 'https://links.app.tc/noJS/?d=prev&url=https://jarema.me', 'https://links.app.tc/noJS/?d=rand&url=https://jarema.me', 'https://links.app.tc/noJS/?d=next&url=https://jarema.me'],
    ['NetLoop', 'https://netloop.netlify.app/', 'https://netloop.netlify.app/jarema/previous', null, 'https://netloop.netlify.app/jarema/next'],
  ]

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {renderJsonLd([generateWebSiteSchema(), generatePersonSchema()])}
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-8 lg:py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="relative pt-10 pb-10 mb-8">
            <div className="text-center">
              <Greeting />
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                <T k="home.heading" f={STATIC.heading} />
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                <T k="home.subheading" f={STATIC.subheading} />
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {[
                  ['/contact', STATIC.contactButton, 'home.contactButton', 'default'],
                  ['/about', STATIC.aboutButton, 'home.aboutButton', 'outline'],
                  ['/blog', STATIC.blogButton, 'home.blogButton', 'outline'],
                  ['/guestbook', STATIC.guestbookButton, 'home.guestbookButton', 'outline'],
                ].map(([href, fallback, key, variant]) => (
                  <Link key={href} href={href}>
                    <Button variant={variant} size="lg" className="w-full sm:w-auto">
                      <T k={key} f={fallback} />
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 items-start lg:min-h-[490px]">
            <div className="lg:order-2">
              <NowSection initialData={staticNowData.length ? staticNowData : null} />
            </div>

            <RecentPosts blogPosts={allPosts} />
          </div>

          <div className="mt-10 lg:mt-0 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            <div><MoodCat /></div>
            <section aria-labelledby="webrings-heading">
              <h2 id="webrings-heading" className="text-2xl font-bold mb-4 text-center">
                <a href="/webrings" tabIndex={-1} className="no-underline hover:underline focus:underline" style={{color:"inherit"}}>
                  <T k="home.webrings" f={STATIC.webrings} />
                </a>
              </h2>
              <nav className="border rounded-lg p-4 bg-card divide-y text-sm" aria-label="Webring navigation">
                {webrings.map(([name, url, prev, random, next]) => (
                  <div key={url} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                    <a href={url} className="text-primary hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                      {name}
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                    <div className="flex items-center gap-2" role="group" aria-label={`Navigate ${name}`}>
                      <a href={prev} className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors" aria-label={`Previous site in ${name}`} title="Previous">←</a>
                      {random ? <a href={random} className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors" aria-label={`Random site in ${name}`} title="Random">🎲</a> : <span className="px-2 py-1 invisible" aria-hidden="true">🎲</span>}
                      <a href={next} className="text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors" aria-label={`Next site in ${name}`} title="Next">→</a>
                    </div>
                  </div>
                ))}
              </nav>
            </section>
          </div>

          <div>
            <section className="mt-10" aria-labelledby="current-mood-heading">
              <h2 id="current-mood-heading" className="text-2xl font-bold mb-4 text-center">Current mood</h2>
              <div className="border rounded-lg p-6 bg-card text-center">
                <a href="https://www.imood.com/users/jarema" target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://moods.imood.com/display/uname-jarema/fg-FFFFFF/bg-2c2e84/imood.gif"
                    alt="The current mood of jarema at www.imood.com"
                    height={15}
                    className="inline-block"
                  />
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Easter Egg - client component */}
      <EasterEgg />
    </main>
  )
}
