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
  { src: "/sweet.png", alt: "A blue banner showing the text Sweet homepage in all caps, next to the word weet is a moon and two stars." },
  { src: "/best_viewed_with_eyes.gif", alt: "An animated pixel art banner with the word Best in vertical and red background, next to the text viewed with Eyes in horizontal and gray background. At the right is a blinking pair of eyes emoji in black background." },
  { src: "/dumbass.gif", alt: "An animated banner showing the text Danger in red background and vertical, next to the words Dumbass webmaster ahead in horizontal. The word ahead is flashing. Next to the words, there is a girl in braided hairs." },
  { src: "/join_logo.gif", alt: "An animated pixel art banner with a thin black border of a white cat sleeping on a red pillow, next to the word miaow in a blocky pixel font alternating between pink and orange. The background is white and has two small pink stars." },
  { src: "/bannars.gif", alt: "An animated pixel art banner with a thin pink border. The background is a rainbow and has ten small white stars. On the background is the text The Realm of Dream in a blocky pixel font alternating between black and orange, with a white outline. Above the text is five hearts with different colors." },
  { src: "/teto.gif", alt: "An animated banner showing Kasane Teto dancing left and right" },
  { src: "/button2019.gif", alt: "A banner showing the text Still using buttons in 2019!" },
  { src: "/graphicdesign.png", alt: "A cyan banner showing a frog in white background signifying an image without transparency, with the text graphic design is my passion in blood red." },
  { src: "/people_pledge_badge_party_cream_pink_88x31.png", alt: "A banner with a thin light pink border, showing the text People Pledge next to a party popper icon, both are in pink. The background is light yellow.", href: "https://people.pledge.party/" },
  { src: "/internetprivacy.gif", alt: "An animated pixel art banner with a spinning globe, next to the words Internet privacy in black, and Now! in red." },
  { src: "/saynotoweb3_88x31.gif", alt: "An animated black banner showing the text Keep the web free, say no to Web3 in green.", href: "https://yesterweb.org/no-to-web3/" },
  { src: "/valid-rss-rogers.png", alt: "A banner showing the RSS logo next to the text Valid RSS and a green checkmark. Subscribe to blog updates!", href: "/rss.xml" },
  { src: "/valid-atom.png", alt: "A banner showing the Atom logo next to the text Valid and a white checkmark. Subscribe to blog updates!", href: "/atom.xml" },
  { src: "/humanstxt.png", alt: "A banner showing the humans.txt wordmark", href: "/humans.txt" },
  { src: "/got_html.gif", alt: "A banner showing the text Got HTML? in black" },
  { src: "/js-warning.gif", alt: "A banner showing a caution sign next to the text Warning: Page contains JavaScript!" },
  { src: "/fedora.gif", alt: "A banner showing the text Powered by in black with white background, above the Fedora Linux wordmark with dark blue background.", href: "https://fedoraproject.org/" },
  { src: "/firefox4.gif", alt: "An animated banner with a dark blue background and orange border, showing the Firefox logo next to the text alternating between Tested on and Firefox, both texts in orange.", href: "https://www.mozilla.org/en-US/firefox/new/" },
  { src: "/anythingbut.gif", alt: "A banner showing the Chrome logo crossed out with a No sign, next to the words Anything But Chrome in black.", href: "/blog/2025/08/anything-but-chrome" },
  { src: "/perfectclear.gif", alt: "An animated banner showing a Tetris gameplay, next to the words Perfect clear in white.", href: "/tetris" },
]

const linkClass = "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"

export function Footer() {
  return (
    <footer className="w-full border-t pt-1 xl:py-0" role="contentinfo">
      <div className="container flex flex-col items-center justify-center gap-2 py-2 xl:flex-row xl:gap-1 relative">
        <FooterClient {...STATIC_FOOTER} />
      </div>

      <nav className="pt-1 flex justify-center flex-wrap gap-2 mx-auto" style={{ maxWidth: '760px' }} aria-label="Web badges and external links">
        {BADGES.map(({ src, alt, href }) =>
          href ? (
            <a key={src} href={href} target="_blank" rel="noopener" className={linkClass}>
              <Image src={src} alt={alt} width={88} height={31} className="hover:opacity-90 transition-opacity" loading="lazy" />
            </a>
          ) : (
            <Image key={src} src={src} alt={alt} width={88} height={31} loading="lazy" />
          )
        )}
      </nav>

      <a className="flex justify-center mt-2 pb-3" href="/badges">
        <Image src="/badge.png" alt="A pixel art banner with a thin blue border of a smiling boy with brown hair and blue headphones, next to the word Jarema in a white, blocky pixel font. The background is black and filled with small white stars." width={88} height={31} className="opacity-90 hover:opacity-100 transition-opacity" loading="lazy" />
      </a>
      {/* Bisexual pride flag stripe spanning full width */}
      <svg height="15" width="100%" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" className="block w-full" preserveAspectRatio="none">
        <title>Decorative footer stripe</title>
        <rect fill="#D60270" height="5" width="100%" x="0" y="0"></rect>
        <rect fill="#9B4F96" height="5" width="100%" x="0" y="5"></rect>
        <rect fill="#0038A8" height="5" width="100%" x="0" y="10"></rect>
      </svg>
      {/* Spacer below footer for extra breathing room */}
      <div aria-hidden="true" className="h-3" />
    </footer>
  )
}
