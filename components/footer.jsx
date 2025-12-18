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
  { src: "/sweet.png", alt: "Sweet badge" },
  { src: "/dumbass.gif", alt: "Dumbass badge" },
  { src: "/join_logo.gif", alt: "Join Logo badge" },
  { src: "/bannars.gif", alt: "The March of Bannars badge" },
  { src: "/button2019.gif", alt: "Button 2019 badge" },
  { src: "/imagine.gif", alt: "Imagine badge" },
  { src: "/graphicdesign.png", alt: "Graphic Design badge" },
  { src: "/best_viewed_with_eyes.gif", alt: "Best Viewed With Eyes badge" },
  { src: "/valid-rss-rogers.png", alt: "Valid RSS Feed - Subscribe to blog updates", href: "https://jarema.me/rss.xml" },
  { src: "/valid-atom.png", alt: "Valid Atom Feed - Subscribe to blog updates", href: "https://jarema.me/atom.xml" },
  { src: "/humanstxt.png", alt: "Humans.txt - Site credits and acknowledgments", href: "https://jarema.me/humans.txt" },
  { src: "/people_pledge_badge_party_cream_pink_88x31.png", alt: "People Pledge", href: "https://people.pledge.party/" },
  { src: "/internetprivacy.gif", alt: "Internet Privacy Now badge" },
  { src: "/saynotoweb3_88x31.gif", alt: "Say No to Web3", href: "https://yesterweb.org/no-to-web3/" },
  { src: "/got_html.gif", alt: "Got HTML? badge" },
  { src: "/js-warning.gif", alt: "JavaScript Warning badge" },
  { src: "/linux_powered.gif", alt: "Linux Powered" },
  { src: "/fedora.gif", alt: "Powered by Fedora Linux", href: "https://fedoraproject.org/" },
  { src: "/firefox4.gif", alt: "Firefox Browser", href: "https://www.mozilla.org/en-US/firefox/new/" },
  { src: "/anythingbut.gif", alt: "Anything But Chrome", href: "https://jarema.me/blog/2025/08/anything-but-chrome" },
  { src: "/bitwarden.gif", alt: "Bitwarden Password Manager" },
  { src: "/perfectclear.gif", alt: "Perfect Clear badge", href: "https://jarema.me/tetris" },
  { src: "/porygon2.gif", alt: "Porygon2 badge" },
  { src: "/teto.gif", alt: "Teto badge" },
  { src: "/tomandjerry.gif", alt: "Tom and Jerry badge" },
  { src: "/milktea.gif", alt: "Milk Tea badge" },
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
            <a key={src} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              <Image src={src} alt={alt} width={88} height={31} className="hover:opacity-90 transition-opacity" />
            </a>
          ) : (
            <Image key={src} src={src} alt={alt} width={88} height={31} />
          )
        )}
      </nav>

      <div className="flex justify-center mt-2 pb-4">
        <Image src="/badge.png" alt="Jarema personal badge" width={88} height={31} className="opacity-90 hover:opacity-100 transition-opacity" />
      </div>
    </footer>
  )
}
