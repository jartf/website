import React from "react"
import Image from "next/image"
import Link from "next/link"
import { generateMetadata as generateMeta } from "@/lib/metadata"
import AboutClientWrapper from "./AboutClientWrapper"

export const metadata = generateMeta({
  title: "About Me",
  description: "Learn more about me, my background, and my journey.",
  path: "about",
})

// Static chapter data
const chapters = [
  { number: 1, titleKey: "about.chapters.1.title", contentKeys: ["about.chapters.1.content1", "about.chapters.1.content2", "about.chapters.1.content3"] },
  { number: 2, titleKey: "about.chapters.2.title", contentKeys: ["about.chapters.2.content1", "about.chapters.2.content2", "about.chapters.2.content3"] },
  { number: 3, titleKey: "about.chapters.3.title", contentKeys: ["about.chapters.3.content1", "about.chapters.3.content2", "about.chapters.3.content3"] },
  { number: 4, titleKey: "about.chapters.4.title", contentKeys: ["about.chapters.4.content1", "about.chapters.4.content2", "about.chapters.4.content3"], hasQuote: true },
  { number: 5, titleKey: "about.chapters.5.title", contentKeys: ["about.chapters.5.content1", "about.chapters.5.content2", "about.chapters.5.content3", "about.chapters.5.content4"] },
  { number: 6, titleKey: "about.chapters.6.title", contentKeys: ["about.chapters.6.content1", "about.chapters.6.content2", "about.chapters.6.content3", "about.chapters.6.content4"], hidden: true },
]

export default function AboutPage() {
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

  return <AboutClientWrapper chapters={chapters} hCard={hCardContent} />
}
