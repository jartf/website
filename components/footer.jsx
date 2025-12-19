import Image from "next/image"
import { FooterClient } from "@/components/footer-client"

// Static fallback text for no-JS rendering
const STATIC_FOOTER = {
  copyright: "no rights reserved, take what you need and do what you want :p",
  madeWith: "made with love",
  andChaos: "and a few weeks of screwing around",
}

// Badge data for cleaner rendering
const BADGES = [
  { src: "/sweet.png", alt: "Sweet homepage" },
  { src: "/dumbass.gif", alt: "Dumbass webmaster ahead" },
  { src: "/join_logo.gif", alt: "Miaow" },
  { src: "/bannars.gif", alt: "The realm of dreams" },
  { src: "/button2019.gif", alt: "Still using buttons in 2019!" },
  { src: "/imagine.gif", alt: "This site is powered by imagination!" },
  { src: "/graphicdesign.png", alt: "Graphic design is my passion" },
  { src: "/best_viewed_with_eyes.gif", alt: "Best viewed with Eyes" },
  { src: "/valid-rss-rogers.png", alt: "Valid RSS feed, subscribe to blog updates!", href: "/rss.xml" },
  { src: "/valid-atom.png", alt: "Valid Atom feed, subscribe to blog updates!", href: "/atom.xml" },
  { src: "/humanstxt.png", alt: "Humans.txt (site credits and acknowledgments)", href: "/humans.txt" },
  { src: "/people_pledge_badge_party_cream_pink_88x31.png", alt: "The People Pledge", href: "https://people.pledge.party/" },
  { src: "/internetprivacy.gif", alt: "Internet privacy now!" },
  { src: "/saynotoweb3_88x31.gif", alt: "Keep the web free, say no to Web3", href: "https://yesterweb.org/no-to-web3/" },
  { src: "/got_html.gif", alt: "Got HTML?" },
  { src: "/js-warning.gif", alt: "Warning: Page contains JavaScript!" },
  { src: "/linux_powered.gif", alt: "Linux powered" },
  { src: "/fedora.gif", alt: "Powered by Fedora Linux", href: "https://fedoraproject.org/" },
  { src: "/firefox4.gif", alt: "Tested on Firefox", href: "https://www.mozilla.org/en-US/firefox/new/" },
  { src: "/anythingbut.gif", alt: "Anything But Chrome", href: "/blog/2025/08/anything-but-chrome" },
  { src: "/bitwarden.gif", alt: "Bitwarden password manager" },
  { src: "/perfectclear.gif", alt: "Tetris perfect clear", href: "/tetris" },
  { src: "/porygon2.gif", alt: "Porygon2" },
  { src: "/teto.gif", alt: "Kasane Teto" },
  { src: "/tomandjerry.gif", alt: "Tom and Jerry" },
  { src: "/milktea.gif", alt: "Milk tea now!" },
]

const linkClass = "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"

export function Footer() {
  return (
    <footer className="w-full border-t py-6 xl:py-0" role="contentinfo">
      <div className="container flex flex-col items-center justify-center gap-2 py-2 xl:flex-row xl:gap-1 relative">
        <FooterClient {...STATIC_FOOTER} />
      </div>

      <nav className="flex justify-center flex-wrap gap-2 mx-auto" style={{ maxWidth: '664px' }} aria-label="Web badges and external links">
        {BADGES.map(({ src, alt, href }) =>
          href ? (
            <a key={src} href={href} target="_blank" rel="noopener" className={linkClass}>
              <Image src={src} alt={alt} width={88} height={31} className="hover:opacity-90 transition-opacity" />
            </a>
          ) : (
            <Image key={src} src={src} alt={alt} width={88} height={31} />
          )
        )}
      </nav>

      <a className="flex justify-center mt-2 pb-4" href="/badges">
        <Image src="/badge.png" alt="Jarema's personal badge" width={88} height={31} className="opacity-90 hover:opacity-100 transition-opacity" />
      </a>
    </footer>
  )
}
