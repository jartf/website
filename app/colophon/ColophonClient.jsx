"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Firefly } from "@/components/firefly"
import { ExternalLink, Code, Server, Palette } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"

export default function ColophonClientPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const mounted = useMounted()
  const sectionRefs = useRef([])
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (mounted) {
      const handleKeyDown = (e) => {
        // Skip if user is typing in an input, textarea, or contentEditable element
        if (
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement ||
          (document.activeElement && document.activeElement.getAttribute("contenteditable") === "true")
        ) {
          return
        }

        // Check if the key pressed is a number between 1-4 (for the 4 sections)
        const sectionNumber = Number.parseInt(e.key)
        if (sectionNumber >= 1 && sectionNumber <= 4) {
          e.preventDefault()

          // Scroll to the section
          if (sectionRefs.current[sectionNumber - 1]) {
            sectionRefs.current[sectionNumber - 1]?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })

            // Add a brief highlight effect
            const sectionElement = sectionRefs.current[sectionNumber - 1]
            if (sectionElement) {
              sectionElement.classList.add("ring-2", "ring-primary", "ring-offset-2")
              setTimeout(() => {
                sectionElement.classList.remove("ring-2", "ring-primary", "ring-offset-2")
              }, 1000)

              // Announce to screen readers
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

  return (
    <main className={`relative min-h-screen w-full overflow-hidden transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {theme === "dark" && <Firefly count={15} />}

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("colophon.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("colophon.description")}</p>
          </div>

          {/* Screen reader announcement */}
          <div className="sr-only" aria-live="polite" id="keyboard-announcement"></div>

          <div className="space-y-12">
            <section
              ref={(el) => (sectionRefs.current[0] = el)}
              id="section-site-history"
              className="prose dark:prose-invert max-w-none"
            >
              <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
                <Palette className="h-6 w-6 text-primary" />
                {t("colophon.siteHistory.title")}
              </h2>
              <p>{t("colophon.siteHistory.content1")}</p>
              <p>{t("colophon.siteHistory.content2")}</p>
            </section>

            <section
              ref={(el) => (sectionRefs.current[1] = el)}
              id="section-technology-stack"
              className="prose dark:prose-invert max-w-none"
            >
              <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
                <Code className="h-6 w-6 text-primary" />
                {t("colophon.technologyStack.title")}
              </h2>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <Link
                    href="https://nextjs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    Next.js
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>{" "}
                  - {t("colophon.technologyStack.nextjs")}
                </li>
                <li>
                  <Link
                    href="https://reactjs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    React
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>{" "}
                  - {t("colophon.technologyStack.react")}
                </li>
                <li>
                  <Link
                    href="https://tailwindcss.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    Tailwind CSS
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>{" "}
                  - {t("colophon.technologyStack.tailwind")}
                </li>
                <li>
                  <Link
                    href="https://ui.shadcn.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    shadcn/ui
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>{" "}
                  - {t("colophon.technologyStack.shadcn")}
                </li>
                <li>
                  <Link
                    href="https://www.framer.com/motion/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    Framer Motion
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>{" "}
                  - {t("colophon.technologyStack.framer")}
                </li>
                <li>
                  <Link
                    href="https://react.i18next.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    react-i18next
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>{" "}
                  - {t("colophon.technologyStack.i18next")}
                </li>
                <li>
                  <Link
                    href="https://www.typescriptlang.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    TypeScript
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>{" "}
                  - {t("colophon.technologyStack.typescript")}
                </li>
              </ul>
            </section>

            <section
              ref={(el) => (sectionRefs.current[2] = el)}
              id="section-hosting"
              className="prose dark:prose-invert max-w-none"
            >
              <h2 className="flex items-center gap-2 text-2xl font-bold mb-4">
                <Server className="h-6 w-6 text-primary" />
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

            <section
              ref={(el) => (sectionRefs.current[3] = el)}
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
