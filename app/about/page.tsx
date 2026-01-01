import React from "react"
import Image from "next/image"
import Link from "next/link"
import { generateMetadata as generateMeta } from "@/lib/metadata"
import AboutClient, { type ChapterData } from "./client";
import { generatePersonSchema, generateProfilePageSchema, generateBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data"

export const metadata = generateMeta({
  title: "About me",
  description: "Learn more about me, my background, and my journey.",
  path: "about",
})

// Static chapter data with fallback content for SSR
const chapters: ChapterData[] = [
  {
    number: 1,
    titleKey: "about.chapters.1.title",
    contentKeys: ["about.chapters.1.content1", "about.chapters.1.content2", "about.chapters.1.content3"],
    staticTitle: "how i spawned",
    staticContent: [
      "I was born in Vietnam in the mid-2000s, which technically makes me Gen Z, but I grew up with a kind of in-betweenness that doesn't quite fit any label. I was the quiet kid in the back of the room, but my mind was never really quiet. I was observing everything, whether that was people, patterns, or power dynamics, and quietly putting it all together.",
      "My childhood was a strange mix of digital escapes and emotional landmines. I didn't have a perfect family. I won't even try to pretend I did. I had to grow up fast, emotionally speaking, and I learned early on that being sensitive meant being careful. You learn to listen more than you speak. You learn to code-switch, to hide pieces of yourself in plain sight. But you also learn resilience. You learn how to build a self from scratch when no one hands you the blueprint.",
      "This site is part of that blueprint. Not to explain everything or even try to, but to make peace with the chaos."
    ]
  },
  {
    number: 2,
    titleKey: "about.chapters.2.title",
    contentKeys: ["about.chapters.2.content1", "about.chapters.2.content2", "about.chapters.2.content3"],
    staticTitle: "when i found out the world is rigged",
    staticContent: [
      "It didn't hit all at once. There wasn't some singular moment of revelation. It was more like a slow burn: the realization that the systems around me, from family to education to society at large, weren't built with people like me in mind. That stability could be a trap. That even love can be conditional, weaponized. That you could follow all the \"rules\" and still lose.",
      "So I did what a lot of us do: I adapted. I sharpened my mind, armored my heart, and started studying everything. Economics gave me the vocabulary to understand power. Coding gave me the tools to build power. Language gave me the freedom to express and escape. I realized I didn't want to just survive inside the system, I wanted to understand it, expose it, and maybe even subvert it a little.",
      "This site isn't just a portfolio. It's proof that I exist on my own terms, not the ones I was handed."
    ]
  },
  {
    number: 3,
    titleKey: "about.chapters.3.title",
    contentKeys: ["about.chapters.3.content1", "about.chapters.3.content2", "about.chapters.3.content3"],
    staticTitle: "coding, languages, and the ADHD grindset",
    staticContent: [
      "I don't do well with rigid routines or neat timelines. ADHD means my brain moves fast, loops endlessly, hyperfocuses randomly at 2am, forgets to eat for a day straight, and sometimes drowns in noise. Sensitivity to noise also makes me go insane sometimes. But it also means I'm deeply curious. Obsessively so. I don't \"dabble\" in things, rather I throw myself in. I don't multitask, it's just that I live in parallel tabs.",
      "Coding, for me, is both chaos and comfort. It gives structure to thoughts that refuse to sit still. It gives me the power to make something that works, something that reflects a part of my mind that can never fully be verbalized. And language? That's the other half of the puzzle. I switch between Vietnamese, English, Russian, and sometimes Turkish or Danish, not because I want to show off, but because different languages unlock different selves. Different emotions. Different memories. English is my sharpest blade. Vietnamese is my heartbeat. Russian is my melancholy. Turkish is the thrill of newness. Danish is… well, still in progress.",
      "And yeah, I write messy, but I write real. I code imperfectly, but intentionally. Everything you see here was built with that same energy."
    ]
  },
  {
    number: 4,
    titleKey: "about.chapters.4.title",
    contentKeys: ["about.chapters.4.content1", "about.chapters.4.content2", "about.chapters.4.content3"],
    hasQuote: true,
    staticTitle: "activism and being too real online",
    staticContent: [
      "I'm not an influencer. I'm not a loud voice on a picket line. But I believe in accountability, in empathy, in building spaces where people feel seen, not just tolerated. My activism is quiet, sometimes invisible. It shows up in the things I build, the conversations I have, and the way I refuse to dilute my truth just to make someone comfortable.",
      "It's in calling out injustice when it's safer to stay silent. It's in amplifying marginalized voices, even when I feel like mine is already whisper-thin. It's in the saying:",
      "Sometimes I vanish for weeks. Sometimes I overshare at 3am. Sometimes I post a cat meme and follow it with a quote I randomly make up. I contain multitudes."
    ],
    staticQuote: "\"I don't have all the answers, but I'm still going to try.\""
  },
  {
    number: 5,
    titleKey: "about.chapters.5.title",
    contentKeys: ["about.chapters.5.content1", "about.chapters.5.content2", "about.chapters.5.content3", "about.chapters.5.content4"],
    staticTitle: "where i'm headed",
    staticContent: [
      "I'm not here to sell you a personal brand or pretend I've got my life all figured out. Because I really don't. Most days, I'm just trying to balance being functional, being kind, and being honest. But I do know what matters to me.",
      "I want to keep creating. Keep writing. Keep learning languages that make my brain buzz. I want to build tools that matter, not just get likes. I want to travel to the places where history, language, and identity tangle together. I want to leave behind things that feel warm, useful, and human. Not polished perfection, but stories and scraps that make people feel less alone.",
      "I want peace. Not just the absence of chaos, but the kind of peace that comes from knowing who you are, what you've been through, and what you've chosen to leave behind.",
      "If you're here reading this, then part of you resonates with that. Welcome. Make yourself at home. Just watch your step, some of the thoughts on this site are still under construction."
    ]
  },
  {
    number: 6,
    titleKey: "about.chapters.6.title",
    contentKeys: ["about.chapters.6.content1", "about.chapters.6.content2", "about.chapters.6.content3", "about.chapters.6.content4"],
    hidden: true,
    staticTitle: "i'm not done yet",
    staticContent: [
      "so here's the part they weren't supposed to read.",
      "i'm still angry. still grieving a version of myself that was never allowed to exist. still waking up some days wondering why everything feels a few degrees off. sometimes i think about running away, just disappearing, new name, new city, new language. sometimes i almost do it.",
      "there are days i don't even feel human. more like a memory trying to solidify. more like an echo of something softer i can't reach anymore. other days, i'm electric. i feel every detail, sunlight on skin, quiet playlists, the way people's faces shift when they're finally safe enough to be themselves. it keeps me alive, somehow.",
      "i'm not done becoming whoever the hell i'm supposed to be. but i am done pretending that i'm okay with staying silent."
    ]
  },
]

export default function AboutPage() {
  // Generate structured data for About page
  const personSchema = generatePersonSchema()
  const profilePageSchema = generateProfilePageSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ])

  // h-card content is passed as children to be rendered by server within client wrapper
  const hCardContent = (
    <div className="h-card mb-8 p-4 border rounded-lg bg-muted/10">
      <div className="flex items-center gap-4">
        <Image src="/favicons.svg" alt="Jarema" width={64} height={64} className="u-photo rounded-full" />
        <div>
          <h2 className="p-name text-xl font-bold">Jarema</h2>
          <div className="flex items-center gap-3 mt-2">
            <Link
              href="/"
              className="u-url u-uid text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              jarema.me
            </Link>
            <a
              className="u-email text-sm text-muted-foreground hover:text-primary transition-colors"
              href="mailto:hello@jarema.me"
            >
              hello@jarema.me
            </a>
          </div>
          <p className="p-note mt-2 text-sm">Economic student, developer and creator.</p>
          <span className="p-category hidden">student</span>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Structured Data for Google Rich Results */}
      {renderJsonLd([personSchema, profilePageSchema, breadcrumbSchema])}

      <AboutClient chapters={chapters} hCard={hCardContent} />
    </div>
  )
}
