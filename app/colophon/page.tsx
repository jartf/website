import { generateMetadata as generateMeta } from "@/lib/metadata"
import Link from "next/link"
import { ExternalLink, Code, Server, Palette } from "lucide-react"
import { ColophonAnimation } from "./ColophonAnimation"
import { ColophonTranslations } from "./ColophonTranslations"

export const metadata = generateMeta({
  title: "Colophon",
  description: "The story behind this website and how it was built.",
  path: "colophon",
})

// Technology stack data - server defined
const technologyStack = [
  { name: "Next.js", url: "https://nextjs.org/", description: "The React framework for production-grade applications" },
  { name: "React", url: "https://reactjs.org/", description: "A JavaScript library for building user interfaces" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com/", description: "A utility-first CSS framework" },
  { name: "shadcn/ui", url: "https://ui.shadcn.com/", description: "Re-usable components built with Radix UI and Tailwind CSS" },
  { name: "Framer Motion", url: "https://www.framer.com/motion/", description: "A motion library for React" },
  { name: "react-i18next", url: "https://react.i18next.com/", description: "Internationalization for React applications" },
  { name: "TypeScript", url: "https://www.typescriptlang.org/", description: "JavaScript with syntax for types" },
]

export default function ColophonPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <ColophonAnimation sectionCount={4}>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Page header - translated on client */}
            <ColophonTranslations />

            <div className="space-y-12">
              {/* Site History */}
              <section
                id="section-1"
                className="prose dark:prose-invert max-w-none transition-all duration-300"
              >
                <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
                  <Palette className="h-6 w-6 text-primary" />
                  <span data-i18n="colophon.siteHistory.title">Site History</span>
                </h2>
                <p data-i18n="colophon.siteHistory.content1">
                  This is version 4 of my personal website. The first version was a simple HTML page, 
                  the second was a WordPress site, and the third was built with Next.js Pages Router.
                </p>
                <p data-i18n="colophon.siteHistory.content2">
                  I decided to rebuild the site with Next.js App Router to take advantage of React Server 
                  Components and the improved developer experience.
                </p>
              </section>

              {/* Technology Stack */}
              <section
                id="section-2"
                className="prose dark:prose-invert max-w-none transition-all duration-300"
              >
                <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
                  <Code className="h-6 w-6 text-primary" />
                  <span data-i18n="colophon.technologyStack.title">Technology Stack</span>
                </h2>
                <ul className="space-y-2 list-disc pl-5">
                  {technologyStack.map((tech) => (
                    <li key={tech.name}>
                      <Link
                        href={tech.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center"
                      >
                        {tech.name}
                        <ExternalLink className="h-4 w-4 ml-1" />
                      </Link>{" "}
                      - <span data-i18n={`colophon.technologyStack.${tech.name.toLowerCase().replace(/[.\s]/g, "")}`}>{tech.description}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Hosting */}
              <section
                id="section-3"
                className="prose dark:prose-invert max-w-none transition-all duration-300"
              >
                <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
                  <Server className="h-6 w-6 text-primary" />
                  <span data-i18n="colophon.hosting.title">Hosting</span>
                </h2>
                <p>
                  <span data-i18n="colophon.hosting.content1">This site is hosted on</span>{" "}
                  <Link
                    href="https://vercel.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    Vercel
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                  , <span data-i18n="colophon.hosting.content2">which provides excellent performance and automatic deployments from GitHub.</span>
                </p>
                <p>
                  <span data-i18n="colophon.hosting.content3">DNS and CDN services are provided by</span>{" "}
                  <Link
                    href="https://www.cloudflare.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    Cloudflare
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                  , <span data-i18n="colophon.hosting.content4">for fast global content delivery and security.</span>
                </p>
              </section>

              {/* Inspiration */}
              <section
                id="section-4"
                className="prose dark:prose-invert max-w-none transition-all duration-300"
              >
                <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
                  <span data-i18n="colophon.inspiration.title">Inspiration</span>
                </h2>
                <p>
                  <span data-i18n="colophon.inspiration.content1">The idea for this colophon page came from</span>{" "}
                  <Link
                    href="https://binyam.in/colophon/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    Binyamin Aron Green&apos;s Colophon
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                  , <span data-i18n="colophon.inspiration.content2">which was inspired by</span>{" "}
                  <Link
                    href="https://ericwbailey.design/colophon.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    Eric Bailey
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                  . <span data-i18n="colophon.inspiration.content3">You can learn more about colophons at</span>{" "}
                  <Link
                    href="https://indieweb.org/colophon"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    IndieWeb
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </ColophonAnimation>
    </main>
  )
}
