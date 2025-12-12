"use client"

import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { DarkModeFirefly } from "@/components/dark-mode-firefly"
import { ExternalLink, Code, Server, Palette } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"

interface TechItem {
  name: string
  url: string
  descKey: string
}

interface Section {
  id: string
  icon: string | null
  titleKey: string
  contentKeys?: string[]
  techStack?: TechItem[]
  hasHostingContent?: boolean
  hasInspirationContent?: boolean
}

interface ColophonClientWrapperProps {
  sections: Section[]
  technologyStack: TechItem[]
}

const iconMap: Record<string, React.ReactNode> = {
  Palette: <Palette className="h-6 w-6 text-primary" />,
  Code: <Code className="h-6 w-6 text-primary" />,
  Server: <Server className="h-6 w-6 text-primary" />,
}

export default function ColophonClientWrapper({ sections, technologyStack }: ColophonClientWrapperProps) {
  const { t } = useTranslation()
  const mounted = useMounted()
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (mounted) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement ||
          (document.activeElement && document.activeElement.getAttribute("contenteditable") === "true")
        ) {
          return
        }

        const sectionNumber = Number.parseInt(e.key)
        if (sectionNumber >= 1 && sectionNumber <= 4) {
          e.preventDefault()

          if (sectionRefs.current[sectionNumber - 1]) {
            sectionRefs.current[sectionNumber - 1]?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })

            const sectionElement = sectionRefs.current[sectionNumber - 1]
            if (sectionElement) {
              sectionElement.classList.add("ring-2", "ring-primary", "ring-offset-2")
              setTimeout(() => {
                sectionElement.classList.remove("ring-2", "ring-primary", "ring-offset-2")
              }, 1000)

              const sectionTitle = sectionElement.querySelector("h2")?.textContent
              const announcement = document.getElementById("keyboard-announcement")
              if (announcement && sectionTitle) {
                announcement.textContent = `Jumped to ${sectionTitle}`
              }
            }
          }
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [mounted])

  if (!mounted) return null

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <DarkModeFirefly count={15} />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("colophon.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("colophon.description")}</p>
          </div>

          {/* Screen reader announcement */}
          <div className="sr-only" aria-live="polite" id="keyboard-announcement"></div>

          <div className="space-y-12">
            {/* Site History */}
            <section
              ref={(el) => { sectionRefs.current[0] = el }}
              id="section-site-history"
              className="prose dark:prose-invert max-w-none"
            >
              <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
                {iconMap.Palette}
                {t("colophon.siteHistory.title")}
              </h2>
              <p>{t("colophon.siteHistory.content1")}</p>
              <p>{t("colophon.siteHistory.content2")}</p>
            </section>

            {/* Technology Stack */}
            <section
              ref={(el) => { sectionRefs.current[1] = el }}
              id="section-technology-stack"
              className="prose dark:prose-invert max-w-none"
            >
              <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
                {iconMap.Code}
                {t("colophon.technologyStack.title")}
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
                    - {t(tech.descKey)}
                  </li>
                ))}
              </ul>
            </section>

            {/* Hosting */}
            <section
              ref={(el) => { sectionRefs.current[2] = el }}
              id="section-hosting"
              className="prose dark:prose-invert max-w-none"
            >
              <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
                {iconMap.Server}
                {t("colophon.hosting.title")}
              </h2>
              <p>
                {t("colophon.hosting.content1")}{" "}
                <Link
                  href="https://vercel.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Vercel
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
                , {t("colophon.hosting.content2")}
              </p>
              <p>
                {t("colophon.hosting.content3")}{" "}
                <Link
                  href="https://www.cloudflare.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Cloudflare
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
                , {t("colophon.hosting.content4")}
              </p>
            </section>

            {/* Inspiration */}
            <section
              ref={(el) => { sectionRefs.current[3] = el }}
              id="section-inspiration"
              className="prose dark:prose-invert max-w-none"
            >
              <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">{t("colophon.inspiration.title")}</h2>
              <p>
                {t("colophon.inspiration.content1")}{" "}
                <Link
                  href="https://binyam.in/colophon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Binyamin Aron Green&apos;s Colophon
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
                , {t("colophon.inspiration.content2")}{" "}
                <Link
                  href="https://ericwbailey.design/colophon.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center"
                >
                  Eric Bailey
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
                . {t("colophon.inspiration.content3")}{" "}
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
    </main>
  )
}
