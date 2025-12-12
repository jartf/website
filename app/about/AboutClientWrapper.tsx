"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useTranslation } from "react-i18next"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useMounted } from "@/hooks"
import { DarkModeFirefly } from "@/components/firefly"

type ChapterData = {
  number: number
  titleKey: string
  contentKeys: string[]
  hasQuote?: boolean
  hidden?: boolean
  staticTitle?: string
  staticContent?: string[]
  staticQuote?: string
}

interface AboutClientWrapperProps {
  chapters: ChapterData[]
  hCard: React.ReactNode
}

export default function AboutClientWrapper({ chapters, hCard }: AboutClientWrapperProps) {
  const { t } = useTranslation()
  const [activeChapter, setActiveChapter] = useState(1)
  const [showHiddenChapter, setShowHiddenChapter] = useState(false)
  const chapterRefs = useRef<Array<HTMLDivElement | null>>([])
  const mounted = useMounted()

  useEffect(() => {
    if (mounted) {
      const shouldShowHiddenChapter = sessionStorage.getItem("showHiddenChapter") === "true"
      if (shouldShowHiddenChapter) {
        queueMicrotask(() => setShowHiddenChapter(true))
      }

      const handleScroll = () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2

        chapterRefs.current.forEach((ref, index) => {
          if (!ref) return
          if (chapters[index]?.hidden && !showHiddenChapter) return

          const { offsetTop, offsetHeight } = ref

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveChapter(index + 1)
          }
        })
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement ||
          (document.activeElement && document.activeElement.getAttribute("contenteditable") === "true")
        ) {
          return
        }

        const chapterNumber = Number.parseInt(e.key)
        if (chapterNumber >= 1 && chapterNumber <= 6) {
          if (chapterNumber === 6 && !showHiddenChapter) return

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
  }, [showHiddenChapter, mounted, chapters])

  const visibleChapters = showHiddenChapter ? chapters : chapters.filter(c => !c.hidden)

  // Static fallback for no-JS: render all chapters with static content
  if (!mounted) {
    const staticVisibleChapters = chapters.filter(c => !c.hidden)

    return (
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">About me</h1>

          {/* h-card from server */}
          {hCard}

          <div className="space-y-8">
            {staticVisibleChapters.map((chapter) => (
              <div key={chapter.number} className="py-2" id={`chapter-${chapter.number}`}>
                <div className="flex items-center mb-3">
                  <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4">
                    {chapter.number}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">{chapter.staticTitle}</h2>
                </div>

                <div className="mt-4 text-lg leading-relaxed">
                  {chapter.staticContent?.map((content, index) => {
                    if (chapter.hasQuote && index === 1) {
                      return (
                        <p key={index} className="mt-4">
                          {content}
                          <span className="italic ml-1">{chapter.staticQuote}</span>
                        </p>
                      )
                    }
                    return (
                      <p key={index} className={index > 0 ? "mt-4" : ""}>
                        {content}
                      </p>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <DarkModeFirefly />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">{t("about.title")}</h1>

          {/* Mobile horizontal progress dots */}
          <div className="sticky top-4 z-20 flex justify-center mb-8 md:hidden">
            <div className="bg-background/80 backdrop-blur-sm rounded-full px-6 py-3 flex gap-4">
              {visibleChapters.map((chapter) => (
                <button
                  key={`mobile-${chapter.number}`}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    activeChapter === chapter.number ? "bg-primary" : "bg-muted hover:bg-primary/50"
                  }`}
                  onClick={() => {
                    chapterRefs.current[chapter.number - 1]?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    })
                  }}
                  aria-label={`Chapter ${chapter.number}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop vertical progress dots */}
          <div className="hidden md:block fixed right-8 top-1/2 transform -translate-y-1/2 z-20">
            <div className="bg-background/80 backdrop-blur-sm rounded-full py-6 px-3 flex flex-col gap-4">
              {visibleChapters.map((chapter) => (
                <TooltipProvider key={`desktop-tooltip-${chapter.number}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`w-4 h-4 rounded-full transition-colors ${
                          activeChapter === chapter.number ? "bg-primary" : "bg-muted hover:bg-primary/50"
                        }`}
                        onClick={() => {
                          chapterRefs.current[chapter.number - 1]?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          })
                        }}
                        aria-label={`Chapter ${chapter.number}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Chapter {chapter.number}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* h-card from server */}
          {hCard}

          <div className="space-y-8">
            {visibleChapters.map((chapter, index) => (
              <AnimatePresence key={chapter.number}>
                <Chapter
                  ref={(el) => { chapterRefs.current[chapter.number - 1] = el }}
                  number={chapter.number}
                  titleKey={chapter.titleKey}
                  staticTitle={chapter.staticTitle}
                  contentKeys={chapter.contentKeys}
                  staticContent={chapter.staticContent}
                  hasQuote={chapter.hasQuote}
                  staticQuote={chapter.staticQuote}
                  isActive={activeChapter === chapter.number}
                />
              </AnimatePresence>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const Chapter = React.forwardRef<
  HTMLDivElement,
  {
    number: number
    titleKey: string
    staticTitle?: string
    contentKeys: string[]
    staticContent?: string[]
    hasQuote?: boolean
    staticQuote?: string
    isActive: boolean
  }
>(({ number, titleKey, staticTitle, contentKeys, staticContent, hasQuote, staticQuote, isActive }, ref) => {
  const { t } = useTranslation()
  const chapterRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(chapterRef, { once: true, amount: 0.3 })

  const title = staticTitle ? t(titleKey, { defaultValue: staticTitle }) : t(titleKey)

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="py-2" id={`chapter-${number}`}>
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

        <div className="mt-4 text-lg leading-relaxed">
          {contentKeys.map((key, index) => {
            const defaultVal = staticContent?.[index]
            if (hasQuote && index === 1) {
              return (
                <p key={key} className="mt-4">
                  {defaultVal ? t(`about.chapters.${number}.content2`, { defaultValue: defaultVal }) : t(`about.chapters.${number}.content2`)}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="italic ml-1 hover:text-primary transition-colors">
                        {staticQuote ? t(`about.chapters.${number}.quote`, { defaultValue: staticQuote }) : t(`about.chapters.${number}.quote`)}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{t(`about.chapters.${number}.quoteTooltip`, { defaultValue: "yeah I said it lol" })}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </p>
              )
            }
            return (
              <p key={key} className={index > 0 ? "mt-4" : ""}>
                {defaultVal ? t(key, { defaultValue: defaultVal }) : t(key)}
              </p>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
})

Chapter.displayName = "Chapter"
