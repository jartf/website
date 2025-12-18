import { generateMetadata as generateMeta } from "@/lib/metadata"
import Image from "next/image"
import BadgesClientWrapper from "./BadgesClientWrapper"
import "./badges.css"

export const metadata = generateMeta({
  title: "Web Badges Collection",
  description: "A collection of classic web badges and buttons used on my website.",
  path: "badges",
})

// Badge data - defined on server
const BADGES = [
  {
    id: "personal-badge",
    name: "Jarema Badge",
    src: "/badge.png",
    alt: "Jarema personal badge",
    category: "personal",
    width: 88,
    height: 31,
    url: null,
    description: "My personal web badge",
  },
  {
    id: "humans-txt",
    name: "humans.txt",
    src: "/humanstxt.png",
    alt: "humans.txt",
    category: "validation",
    width: 88,
    height: 31,
    url: "https://jarema.me/humans.txt",
    description: "Information about the humans behind this website",
  },
  {
    id: "valid-rss",
    name: "Valid RSS",
    src: "/valid-rss-rogers.png",
    alt: "Valid RSS",
    category: "validation",
    width: 88,
    height: 31,
    url: "https://jarema.me/rss.xml",
    description: "Valid RSS feed",
  },
  {
    id: "valid-atom",
    name: "Valid Atom",
    src: "/valid-atom.png",
    alt: "Valid Atom Feed",
    category: "validation",
    width: 88,
    height: 31,
    url: "https://jarema.me/atom.xml",
    description: "Valid Atom feed",
  },
  {
    id: "join-logo",
    name: "Join Logo",
    src: "/join_logo.gif",
    alt: "Join Logo",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Classic web badge",
  },
  {
    id: "bannars",
    name: "Bannars",
    src: "/bannars.gif",
    alt: "The March of Bannars",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "The March of Bannars",
  },
  {
    id: "best-viewed",
    name: "Best Viewed With Eyes",
    src: "/best_viewed_with_eyes.gif",
    alt: "Best Viewed With Eyes",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Best viewed with eyes",
  },
  {
    id: "people-pledge",
    name: "People Pledge",
    src: "/people_pledge_badge_party_cream_pink_88x31.png",
    alt: "People Pledge",
    category: "web",
    width: 88,
    height: 31,
    url: "https://people.pledge.party/",
    description: "People Pledge badge",
  },
  {
    id: "internet-privacy",
    name: "Internet Privacy Now",
    src: "/internetprivacy.gif",
    alt: "Internet Privacy Now",
    category: "privacy",
    width: 88,
    height: 31,
    url: null,
    description: "Internet Privacy Now",
  },
  {
    id: "no-web3",
    name: "Say No to Web3",
    src: "/saynotoweb3_88x31.gif",
    alt: "Say No to Web3",
    category: "web",
    width: 88,
    height: 31,
    url: "https://yesterweb.org/no-to-web3/",
    description: "Say No to Web3",
  },
  {
    id: "got-html",
    name: "Got HTML",
    src: "/got_html.gif",
    alt: "Got HTML?",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Got HTML?",
  },
  {
    id: "js-warning",
    name: "JavaScript Warning",
    src: "/js-warning.gif",
    alt: "JavaScript Warning",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "JavaScript Warning",
  },
  {
    id: "fedora",
    name: "Fedora",
    src: "/fedora.gif",
    alt: "Powered by Fedora",
    category: "software",
    width: 88,
    height: 31,
    url: "https://fedoraproject.org/",
    description: "Powered by Fedora",
  },
  {
    id: "firefox",
    name: "Firefox",
    src: "/firefox4.gif",
    alt: "Firefox Browser",
    category: "browsers",
    width: 88,
    height: 31,
    url: "https://www.mozilla.org/en-US/firefox/new/",
    description: "Firefox Browser",
  },
  {
    id: "anything-but",
    name: "Anything But Chrome",
    src: "/anythingbut.gif",
    alt: "Anything But Chrome",
    category: "browsers",
    width: 88,
    height: 31,
    url: null,
    description: "Anything But Chrome",
  },
  {
    id: "bitwarden",
    name: "Bitwarden",
    src: "/bitwarden.gif",
    alt: "Bitwarden Password Manager",
    category: "software",
    width: 88,
    height: 31,
    url: null,
    description: "Bitwarden Password Manager",
  },
  {
    id: "linux-powered",
    name: "Linux Powered",
    src: "/linux_powered.gif",
    alt: "Linux Powered",
    category: "software",
    width: 88,
    height: 31,
    url: null,
    description: "Linux Powered",
  },
  {
    id: "button-2019",
    name: "Still using buttons in 2019!",
    src: "/button2019.gif",
    alt: "Still using buttons in 2019!",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Still using buttons in 2019!",
  },
  {
    id: "button-webdesign",
    name: "Neocities - Web Design is my passion",
    src: "/buttonwebdesign.gif",
    alt: "Neocities - Web Design is my passion",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Neocities - Web Design is my passion",
  },
  {
    id: "dumbass",
    name: "Dumbass webmaster ahead",
    src: "/dumbass.gif",
    alt: "Dumbass webmaster ahead",
    category: "misc",
    width: 88,
    height: 31,
    url: null,
    description: "Dumbass webmaster ahead",
  },
  {
    id: "imagine",
    name: "This site is powered by imagination",
    src: "/imagine.gif",
    alt: "This site is powered by imagination",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "This site is powered by imagination",
  },
  {
    id: "perfect-clear",
    name: "Tetris perfect clear!",
    src: "/perfectclear.gif",
    alt: "Tetris perfect clear!",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Tetris perfect clear!",
  },
  {
    id: "porygon2",
    name: "Porygon2",
    src: "/porygon2.gif",
    alt: "Porygon2",
    category: "misc",
    width: 88,
    height: 31,
    url: null,
    description: "Porygon2",
  },
  {
    id: "teto",
    name: "Teto",
    src: "/teto.gif",
    alt: "Teto",
    category: "misc",
    width: 88,
    height: 31,
    url: null,
    description: "Teto",
  },
  {
    id: "tom-and-jerry",
    name: "Tom and Jerry",
    src: "/tomandjerry.gif",
    alt: "Tom and Jerry",
    category: "misc",
    width: 88,
    height: 31,
    url: null,
    description: "Tom and Jerry",
  },
  {
    id: "milktea",
    name: "Milk Tea Now!",
    src: "/milktea.gif",
    alt: "Milk Tea Now!",
    category: "misc",
    width: 88,
    height: 31,
    url: null,
    description: "Milk Tea Now!",
  },
  {
    id: "sweet",
    name: "Sweet homepage",
    src: "/sweet.png",
    alt: "Sweet homepage",
    category: "misc",
    width: 88,
    height: 31,
    url: null,
    description: "Sweet homepage",
  },
  {
    id: "graphic-design",
    name: "Graphic Design is my passion",
    src: "/graphicdesign.png",
    alt: "Graphic Design is my passion",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Graphic Design is my passion",
  },
]

const CATEGORIES = ["all", "personal", "validation", "browsers", "privacy", "software", "web", "misc"]

// Find personal badge for the server-rendered section
const personalBadge = BADGES.find((badge) => badge.category === "personal")

export default function BadgesPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Classic web badges collection</h1>

      <p className="text-muted-foreground mb-8">
        A collection of classic web badges and buttons used on my website. These nostalgic 88x31 pixel badges from the time of Geocities represent the spirit of the early web. The badges listed here represent various things I support or use.
      </p>

      {/* Personal Badge Section - Server rendered */}
      {personalBadge && (
        <section className="mb-12 border p-6 rounded-lg bg-muted/30">
          <h2 className="text-2xl font-semibold mb-4" id="my-badge">
            My badge
          </h2>
          <p className="mb-4">Feel free to use this badge to link to my website:</p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <div className="border p-2 bg-background rounded-md">
              <Image
                src={personalBadge.src}
                alt={personalBadge.alt}
                width={personalBadge.width}
                height={personalBadge.height}
                className="pixelated"
              />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Right-click and save this image to use it on your site.</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">HTML Code</h3>
            <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
              <code>{`<a href="https://jarema.me/">
  <img src="https://jarema.me/badge.png"
       alt="Jarema's personal badge"
       width="88" height="31"
       style="image-rendering: pixelated;">
</a>`}</code>
            </pre>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Suggestions for embedding</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Use <code className="bg-muted px-1 rounded">image-rendering: pixelated;</code> in your CSS to preserve the
                pixel art style.
              </li>
              <li>
                Please link directly to my homepage at <code className="bg-muted px-1 rounded">https://jarema.me/</code>
              </li>
              <li>The badge is 88×31 pixels, double the width and height in your HTML to <code className="bg-muted px-1 rounded">width=&quot;176&quot; height=&quot;62&quot;</code> to make them easier to read on higher-resolution screens.</li>
            </ul>
          </div>
        </section>
      )}

      {/* Badge collection with search/filter - Client rendered for interactivity */}
      <BadgesClientWrapper badges={BADGES} categories={CATEGORIES} />
    </div>
  )
}
