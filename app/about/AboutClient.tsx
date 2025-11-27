"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMounted } from "@/hooks/use-mounted"
import { DarkModeFirefly } from "@/components/dark-mode-firefly"

const chapters = [1, 2, 3, 4, 5, 6]

/**
 * The client-side component for the about page.
 * This component handles the dynamic aspects of the about page, such as:
 * - Tracking the active chapter based on scroll position.
 * - Handling keyboard navigation to jump between chapters.
 * - Displaying a hidden chapter when unlocked.
 * @returns {JSX.Element | null} The rendered about page client component.
 */
export default function AboutPageClient() {
  const { t } = useTranslation()
  const [activeChapter, setActiveChapter] = useState(1)
  const [showHiddenChapter, setShowHiddenChapter] = useState(false)
  const chapterRefs = useRef<Array<HTMLDivElement | null>>([])
  const mounted = useMounted()

  useEffect(() => {
    if (mounted) {
      // Check if the hidden chapter should be shown using sessionStorage instead of localStorage
      const shouldShowHiddenChapter = sessionStorage.getItem("showHiddenChapter") === "true"
      if (shouldShowHiddenChapter) {
        queueMicrotask(() => setShowHiddenChapter(true))
      }

      const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2

        chapterRefs.current.forEach((ref, index) => {
          if (!ref) return
          if (index === 5 && !showHiddenChapter) return // Skip hidden chapter

          const { offsetTop, offsetHeight } = ref

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveChapter(index + 1)
          }
        })
      }

      // Add keyboard navigation to jump to chapters
      const handleKeyDown = (e: KeyboardEvent) => {
        // Skip if user is typing in an input, textarea, or contentEditable element
        if (
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement ||
          (document.activeElement && document.activeElement.getAttribute("contenteditable") === "true")
        ) {
          return
        }

        // Check if the key pressed is a number between 1-6
        const chapterNumber = Number.parseInt(e.key)
        if (chapterNumber >= 1 && chapterNumber <= 6) {
          // If trying to access chapter 6 but it's not visible, do nothing
          if (chapterNumber === 6 && !showHiddenChapter) return

          // Otherwise, scroll to the chapter
          if (chapterRefs.current[chapterNumber - 1]) {
            e.preventDefault()
            chapterRefs.current[chapterNumber - 1]?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
            setActiveChapter(chapterNumber)
          }
        }
      }

      window.addEventListener("scroll", handleScroll)
      window.addEventListener("keydown", handleKeyDown)

      return () => {
        window.removeEventListener("scroll", handleScroll)
        window.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [showHiddenChapter, mounted])

  if (!mounted) return null

  const visibleChapters = showHiddenChapter ? chapters : chapters.slice(0, 5)

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <DarkModeFirefly />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">{t("about.title")}</h1>

          {/* Mobile horizontal progress dots (visible on small screens only) */}
          <div className="sticky top-4 z-20 flex justify-center mb-8 md:hidden">
            <div className="bg-background/80 backdrop-blur-sm rounded-full px-6 py-3 flex gap-4">
              {visibleChapters.map((chapter) => (
                <button
                  key={`mobile-${chapter}`}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    activeChapter === chapter ? "bg-primary" : "bg-muted hover:bg-primary/50"
                  }`}
                  onClick={() => {
                    if (chapterRefs.current[chapter - 1]) {
                      chapterRefs.current[chapter - 1]?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      })
                    }
                  }}
                  aria-label={`Chapter ${chapter}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop vertical progress dots (visible on medium screens and up) */}
          <div className="hidden md:block fixed right-8 top-1/2 transform -translate-y-1/2 z-20">
            <div className="bg-background/80 backdrop-blur-sm rounded-full py-6 px-3 flex flex-col gap-4">
              {visibleChapters.map((chapter) => (
                <TooltipProvider key={`desktop-tooltip-${chapter}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        key={`desktop-${chapter}`}
                        className={`w-4 h-4 rounded-full transition-colors ${
                          activeChapter === chapter ? "bg-primary" : "bg-muted hover:bg-primary/50"
                        }`}
                        onClick={() => {
                          if (chapterRefs.current[chapter - 1]) {
                            chapterRefs.current[chapter - 1]?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            })
                          }
                        }}
                        aria-label={`Chapter ${chapter}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Chapter {chapter}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* h-card at the top of the about page */}
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

          <div className="space-y-8">
            <Chapter
              ref={(el) => {
                chapterRefs.current[0] = el
              }}
              number={1}
              title={t("about.chapters.1.title")}
              content={
                <>
                  <p>{t("about.chapters.1.content1")}</p>
                  <p className="mt-4">{t("about.chapters.1.content2")}</p>
                  <p className="mt-4">{t("about.chapters.1.content3")}</p>
                </>
              }
              isActive={activeChapter === 1}
            />

            <Chapter
              ref={(el) => {
                chapterRefs.current[1] = el
              }}
              number={2}
              title={t("about.chapters.2.title")}
              content={
                <>
                  <p>{t("about.chapters.2.content1")}</p>
                  <p className="mt-4">{t("about.chapters.2.content2")}</p>
                  <p className="mt-4">{t("about.chapters.2.content3")}</p>
                </>
              }
              isActive={activeChapter === 2}
            />

            <Chapter
              ref={(el) => {
                chapterRefs.current[2] = el
              }}
              number={3}
              title={t("about.chapters.3.title")}
              content={
                <>
                  <p>{t("about.chapters.3.content1")}</p>
                  <p className="mt-4">{t("about.chapters.3.content2")}</p>
                  <p className="mt-4">{t("about.chapters.3.content3")}</p>
                </>
              }
              isActive={activeChapter === 3}
            />

            <Chapter
              ref={(el) => {
                chapterRefs.current[3] = el
              }}
              number={4}
              title={t("about.chapters.4.title")}
              content={
                <>
                  <p>{t("about.chapters.4.content1")}</p>
                  <p className="mt-4">
                    {t("about.chapters.4.content2")}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger className="italic ml-1 hover:text-primary transition-colors">
                          {t("about.chapters.4.quote")}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("about.chapters.4.quoteTooltip")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </p>
                  <p className="mt-4">{t("about.chapters.4.content3")}</p>
                </>
              }
              isActive={activeChapter === 4}
            />

            <Chapter
              ref={(el) => {
                chapterRefs.current[4] = el
              }}
              number={5}
              title={t("about.chapters.5.title")}
              content={
                <>
                  <p>{t("about.chapters.5.content1")}</p>
                  <p className="mt-4">{t("about.chapters.5.content2")}</p>
                  <p className="mt-4">{t("about.chapters.5.content3")}</p>
                  <p className="mt-4">{t("about.chapters.5.content4")}</p>
                </>
              }
              isActive={activeChapter === 5}
            />

            <AnimatePresence>
              {showHiddenChapter && (
                <Chapter
                  ref={(el) => {
                    chapterRefs.current[5] = el
                  }}
                  number={6}
                  title={t("about.chapters.6.title")}
                  content={
                    <>
                      <p>{t("about.chapters.6.content1")}</p>
                      <p className="mt-4">{t("about.chapters.6.content2")}</p>
                      <p className="mt-4">{t("about.chapters.6.content3")}</p>
                      <p className="mt-4">{t("about.chapters.6.content4")}</p>
                    </>
                  }
                  isActive={activeChapter === 6}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  )
}

interface ChapterImage {
  src: string
  alt: string
  width: number
  height: number
}

const Chapter = React.forwardRef<
  HTMLDivElement,
  {
    number: number
    title: string
    content: React.ReactNode
    isActive: boolean
    image?: ChapterImage
  }
>(({ number, title, content, isActive, image }, ref) => {
  const chapterRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(chapterRef, { once: true, amount: 0.3 })

  return (
    <div ref={ref as React.RefObject<HTMLDivElement> | ((instance: HTMLDivElement | null) => void) | null} className="py-2" id={`chapter-${number}`}>
      <motion.div
        ref={chapterRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-3">
          <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4">
            {number}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        </div>

        <div className="mt-4 text-lg leading-relaxed">{content}</div>

        {image && (
          <div className="mt-6 mb-0 flex justify-center">
            <div className="relative w-full max-w-md overflow-hidden rounded-lg shadow-lg">
              <Image
                src={image.src || "/placeholder.svg"}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
})

Chapter.displayName = "Chapter"
