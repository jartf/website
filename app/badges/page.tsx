import { generateMetadata as generateMeta } from "@/lib/metadata"
import Image from "next/image"
import BadgesClientWrapper from "./BadgesClientWrapper"
import "./badges.css"

export const metadata = generateMeta({
  title: "Web badges collection",
  description: "A collection of classic web badges and buttons used on my website.",
  path: "badges",
})

// Badge data
const BADGES = [
  {
    id: "personal",
    name: "Jarema's badge",
    src: "/badge.png",
    alt: "A pixel art banner with a thin blue border of a smiling boy with brown hair and blue headphones, next to the word Jarema in a white, blocky pixel font. The background is black and filled with small white stars.",
    category: "personal",
    width: 88,
    height: 31,
    url: "https://jarema.me/",
    description: "My personal badge depicting me in headphones under the stars.",
  },
  {
    id: "badge-eesti",
    name: "Eesti",
    src: "/badge-eesti.png",
    alt: "My personal badge, with a frame of Estonia's flag.",
    category: "personal",
    width: 88,
    height: 31,
    url: "https://jarema.me/",
    description: "The same personal badge, just with the Estonia flag frame.",
  },
  {
    id: "humanstxt",
    name: "humans.txt",
    src: "/humanstxt.png",
    alt: "A banner showing the humans.txt wordmark",
    category: "validation",
    width: 88,
    height: 31,
    url: "https://jarema.me/humans.txt",
    description: "Information about me! Hi, I'm the human behind this website.",
  },
  {
    id: "valid-rss",
    name: "Valid RSS",
    src: "/valid-rss-rogers.png",
    alt: "A banner showing the RSS logo next to the text Valid RSS and a green checkmark",
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
    alt: "A banner showing the Atom logo next to the text Valid and a white checkmark",
    category: "validation",
    width: 88,
    height: 31,
    url: "https://jarema.me/atom.xml",
    description: "Valid Atom feed",
  },
  {
    id: "miaow",
    name: "Miaow",
    src: "/join_logo.gif",
    alt: "An animated pixel art banner with a thin black border of a white cat sleeping on a red pillow, next to the word miaow in a blocky pixel font alternating between pink and orange. The background is white and has two small pink stars.",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Sleeping cat on a pillow, miaow!",
  },
  {
    id: "realm",
    name: "The Realm of Dream",
    src: "/bannars.gif",
    alt: "An animated pixel art banner with a thin pink border. The background is a rainbow and has ten small white stars. On the background is the text The Realm of Dream in a blocky pixel font alternating between black and orange, with a white outline. Above the text is five hearts with different colors.",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "This is a cute realm :D",
  },
  {
    id: "best-viewed",
    name: "Best viewed with Eyes",
    src: "/best_viewed_with_eyes.gif",
    alt: "An animated pixel art banner with the word Best in vertical and red background, next to the text viewed with Eyes in horizontal and gray background. At the right is a blinking pair of eyes emoji in black background.",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "This site is, of course, best viewed with eyes!",
  },
  {
    id: "people-pledge",
    name: "People Pledge",
    src: "/people_pledge_badge_party_cream_pink_88x31.png",
    alt: "A banner with a thin light pink border, showing the text People Pledge next to a party popper icon, both are in pink. The background is light yellow.",
    category: "web",
    width: 88,
    height: 31,
    url: "https://people.pledge.party/",
    description: "I pledge to the People Pledge. See https://people.pledge.party",
  },
  {
    id: "internet-privacy",
    name: "Internet privacy Now!",
    src: "/internetprivacy.gif",
    alt: "An animated pixel art banner with a spinning globe, next to the words Internet privacy in black, and Now! in red.",
    category: "privacy",
    width: 88,
    height: 31,
    url: null,
    description: "Let's make internet privacy common again",
  },
  {
    id: "no-web3",
    name: "Keep the web free, say no to Web3",
    src: "/saynotoweb3_88x31.gif",
    alt: "An animated black banner showing the text Keep the web free, say no to Web3 in green.",
    category: "web",
    width: 88,
    height: 31,
    url: "https://yesterweb.org/no-to-web3/",
    description: "We can make a better, free, decentralized internet without crypto, NFT or Web3 crap.",
  },
  {
    id: "kagi-smallweb-yellow",
    name: "Kagi Small Web",
    src: "/kagi-smallweb-yellow.gif",
    alt: "An animated banner with the dog mascot Doggo of the Kagi search engine hopping up and down, next to the text Small web. The background is light yellow.",
    category: "web",
    width: 88,
    height: 31,
    url: "https://kagi.com/smallweb",
    description: "This website is part of the Kagi Small Web initiative by the Kagi search engine. Learn more at https://blog.kagi.com/small-web",
  },
  {
    id: "kagi-smallweb-white",
    name: "Kagi Small Web",
    src: "/kagi-smallweb.gif",
    alt: "An animated banner with the dog mascot Doggo of the Kagi search engine hopping up and down, next to the text Small web. The background is light yellow.",
    category: "web",
    width: 88,
    height: 31,
    url: "https://kagi.com/smallweb",
    description: "Same badge in white background",
  },
  {
    id: "got-html",
    name: "Got HTML?",
    src: "/got_html.gif",
    alt: "A banner showing the text Got HTML? in black",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Give me some of that HTML",
  },
  {
    id: "js-warning",
    name: "JavaScript warning",
    src: "/js-warning.gif",
    alt: "A banner showing a caution sign next to the text Warning: Page contains JavaScript!",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Careful, the floor has JS!",
  },
  {
    id: "fedora",
    name: "Fedora",
    src: "/fedora.gif",
    alt: "A banner showing the text Powered by in black with white background, above the Fedora Linux wordmark with dark blue background.",
    category: "software",
    width: 88,
    height: 31,
    url: "https://fedoraproject.org/",
    description: "This user is proudly a Fedora Linux user and contributor.",
  },
  {
    id: "firefox",
    name: "Firefox",
    src: "/firefox4.gif",
    alt: "An animated banner with a dark blue background and orange border, showing the Firefox logo next to the text alternating between Tested on and Firefox, both texts in orange.",
    category: "browsers",
    width: 88,
    height: 31,
    url: "https://www.mozilla.org/en-US/firefox/new/",
    description: "This website is primarily tested on the Firefox browser",
  },
  {
    id: "anything-but",
    name: "Anything But Chrome",
    src: "/anythingbut.gif",
    alt: "A banner showing the Chrome logo crossed out with a No sign, next to the words Anything But Chrome in black.",
    category: "browsers",
    width: 88,
    height: 31,
    url: "https://jarema.me/blog/2025/08/anything-but-chrome/",
    description: "I'm willing to use anything EXCEPT Chrome. Never Chrome.",
  },
  {
    id: "bitwarden",
    name: "Bitwarden",
    src: "/bitwarden.gif",
    alt: "A banner showing the Bitwarden logo, next to the word Bitwarden",
    category: "software",
    width: 88,
    height: 31,
    url: "https://bitwarden.com/",
    description: "Bitwarden the password manager is peak",
  },
  {
    id: "linux-powered",
    name: "Linux powered",
    src: "/linux_powered.gif",
    alt: "An animated banner showing the text Linux powered next to the Tux logo",
    category: "software",
    width: 88,
    height: 31,
    url: "https://distrochooser.de/",
    description: "This user is powered by Linux, and so is the server for this website.",
  },
  {
    id: "button-2019",
    name: "Still using buttons in 2019!",
    src: "/button2019.gif",
    alt: "A banner showing the text Still using buttons in 2019!",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Yes, I'm still using buttons in... *checks calendar* almost 2026!",
  },
  {
    id: "button-webdesign",
    name: "Web design is my passion",
    src: "/buttonwebdesign.gif",
    alt: "An animated banner showing the flashing text web design is my passion, with an orange cat holding art brushes in the background.",
    category: "web",
    width: 88,
    height: 31,
    url: "https://neocities.org/",
    description: "Neocities is my love, web design is my passion",
  },
  {
    id: "dumbass",
    name: "Dumbass webmaster ahead",
    src: "/dumbass.gif",
    alt: "An animated banner showing the text Danger in red background and vertical, next to the words Dumbass webmaster ahead in horizontal. The word ahead is flashing. Next to the words, there is a girl in braided hairs.",
    category: "misc",
    width: 88,
    height: 31,
    url: null,
    description: "Beware! This webmaster is dumbass.",
  },
  {
    id: "imagine",
    name: "Powered by imagination",
    src: "/imagine.gif",
    alt: "An animated banner showing the text This site is powered by in one frame and imagination in the other frame.",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Well, my imagination sure is terrible it seems...",
  },
  {
    id: "perfect-clear",
    name: "Perfect clear!",
    src: "/perfectclear.gif",
    alt: "An animated banner showing a Tetris gameplay, next to the words Perfect clear in white.",
    category: "web",
    width: 88,
    height: 31,
    url: "/tetris",
    description: "Tetris, anyone?",
  },
  {
    id: "porygon2",
    name: "Porygon2",
    src: "/porygon2.gif",
    alt: "A banner showing the text Porygon2! and a squeaking Porygon2",
    category: "misc",
    width: 88,
    height: 31,
    url: null,
    description: "Man I'm just like Porygon2",
  },
  {
    id: "teto",
    name: "Kasane Teto",
    src: "/teto.gif",
    alt: "An animated banner showing Kasane Teto dancing left and right",
    category: "misc",
    width: 88,
    height: 31,
    url: "https://www.youtube.com/watch?v=R8fuPgbOhTM",
    description: "Teto teto teto *explodes*",
  },
  {
    id: "tom-and-jerry",
    name: "Tom and Jerry",
    src: "/tomandjerry.gif",
    alt: "An animated banner showing Tom and Jerry",
    category: "misc",
    width: 88,
    height: 31,
    url: "https://www.youtube.com/watch?v=5oH9Nr3bKfw",
    description: "This was peak and you can't convince me otherwise",
  },
  {
    id: "milktea",
    name: "Milk tea Now!",
    src: "/milktea.gif",
    alt: "A banner showing a cup of bubble tea, next to the words Milk tea Now!",
    category: "misc",
    width: 88,
    height: 31,
    url: null,
    description: "I crave some boba now, brb",
  },
  {
    id: "sweet",
    name: "Sweet homepage",
    src: "/sweet.png",
    alt: "A blue banner showing the text Sweet homepage in all caps, next to the word weet is a moon and two stars.",
    category: "misc",
    width: 88,
    height: 31,
    url: null,
    description: "Isn't this page sweet?",
  },
  {
    id: "graphic-design",
    name: "Graphic design is my passion",
    src: "/graphicdesign.png",
    alt: "A cyan banner showing a frog in white background signifying an image without transparency, with the text graphic design is my passion in blood red.",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "Yes I love graphic design! I'm very capable of it! Totally!",
  },
  {
    id: "developed-by-human",
    name: "Developed by a human",
    src: "/Developed-By-a-Human-Not-By-AI-Badge-black.png",
    alt: "A black banner that reads Developed by a human, Not by AI.",
    category: "web",
    width: 88,
    height: 31,
    url: "https://notbyai.fyi/",
    description: "This site was developed by a human. (not 88x31, but close!)",
  },
  {
    id: "browser-monopolies",
    name: "Hate browser monopolies",
    src: "/browsermonopolies.png",
    alt: "A small banner reading All my friends hate browser monopolies.",
    category: "web",
    width: 88,
    height: 31,
    url: "https://jarema.me/blog/2025/08/anything-but-chrome/",
    description: "All my friends use a browser that's not Chrome!",
  },
  {
    id: "email-common",
    name: "Make email common again!",
    src: "/emailcommon.png",
    alt: "A banner showing an envelope icon and the words Make Email Common Again next to it.",
    category: "web",
    width: 88,
    height: 31,
    url: "mailto:hello@jarema.me",
    description: "My email inbox is always open, feel free to email me!",
  },
  {
    id: "osm-button",
    name: "OpenStreetMap",
    src: "/osm-button.png",
    alt: "A banner with the OpenStreetMap logo and the text OpenStreetMap next to it.",
    category: "web",
    width: 88,
    height: 31,
    url: "https://www.openstreetmap.org/",
    description: "I contribute to OpenStreetMap, and so should you!",
  },
  {
    id: "win-xp",
    name: "I miss Windows XP",
    src: "/i-miss-xp.gif",
    alt: "An animated banner with the Windows XP background and the text I miss Windows XP flashing.",
    category: "software",
    width: 88,
    height: 31,
    url: null,
    description: "Man, can we go back to Windows XP days?",
  },
  {
    id: "www2",
    name: "World Wide Web",
    src: "/www2.gif",
    alt: "An animated banner with the WWW text and the Earth moving from right to left.",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "I miss the old web days...",
  },
  {
    id: "like-computer",
    name: "I like computers",
    src: "/i-like-computer.jpg",
    alt: "A banner with the computer icon and the text I like computer in caps.",
    category: "misc",
    width: 88,
    height: 31,
    url: null,
    description: "Pretty self-explanatory. Need I say more? :p",
  },
  {
    id: "clouds",
    name: "Clouds are nice",
    src: "/clouds.gif",
    alt: "A banner with the sky and clouds.",
    category: "misc",
    width: 88,
    height: 31,
    url: null,
    description: "I can stare at clouds all day.",
  },
  {
    id: "css-is-awesome",
    name: "CSS is awesome",
    src: "/css.png",
    alt: "A banner with a square and the text CSS is awesome in caps in it, but the word awesome is overflowing from the square.",
    category: "web",
    width: 88,
    height: 31,
    url: null,
    description: "It is! Well, sometimes.",
  },
  {
    id: "ltt",
    name: "Free tech tips",
    src: "/ltt.gif",
    alt: "An animated banner with the text Free tech tips click here flashing next to Linus from Linus Tech Tips.",
    category: "web",
    width: 88,
    height: 31,
    url: "https://www.youtube.com/channel/UCXuqSBlHAE6Xw-yeJA0Tunw",
    description: "Click in the banner!",
  },
]

const CATEGORIES = ["all", "personal", "validation", "browsers", "privacy", "software", "web", "misc"]

// Find personal badge for the server-rendered section
const personalBadge = BADGES.find((badge) => badge.category === "personal")

export default function BadgesPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Classic web badges collection</h1>

      <p className="text-muted-foreground mb-6">
        I&apos;ve collected these 88x31 badges to show what I and this site actually care about. They&apos;re a throwback to the Geocities era when the internet was less corporate/AI slop. If you have a badge you&apos;d like me to add here, just ask me.
      </p>

      {/* Personal Badge Section - Server rendered (collapsible via HTML/CSS) */}
      {personalBadge && (
        <section className="mb-6">
          <details className="badge-details" aria-label="My badge details">
            <summary className="cursor-pointer">
              <h2 className="text-2xl font-semibold mb-0" id="my-badge">
                My badge (click to expand)
              </h2>
            </summary>

            <div className="border p-6 rounded-lg bg-muted/30 mt-4">
              <p className="mb-4">Use this badge to link to my website:</p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <Image
                  src={personalBadge.src}
                  alt={personalBadge.alt}
                  width={personalBadge.width * 2}
                  height={personalBadge.height * 2}
                  className="pixelated"
                />
                <div>
                  <p className="text-m text-muted-foreground">Hotlink URL: <code>https://jarema.me/badge.png</code></p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">HTML code</h3>
                <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
                  <code>{`<a href="https://jarema.me/">
  <img src="https://jarema.me/badge.png"
       alt="A pixel art banner with a thin blue border of a smiling boy with brown hair and blue headphones, next to the word Jarema in a white, blocky pixel font. The background is black and filled with small white stars."
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
                    Link directly to my homepage at <code className="bg-muted px-1 rounded">https://jarema.me/</code>
                  </li>
                  <li>The badge is 88x31 pixels, double the width and height in your HTML to <code className="bg-muted px-1 rounded">width=&quot;176&quot; height=&quot;62&quot;</code> to make them easier to read on higher-resolution screens.</li>
                </ul>
              </div>
            </div>
          </details>
        </section>
      )}

      {/* Badge collection with search/filter - Client rendered for interactivity */}
      <BadgesClientWrapper badges={BADGES} categories={CATEGORIES} />
    </div>
  )
}
