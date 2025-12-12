"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import { DarkModeFirefly } from "@/components/firefly"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import type { Project } from "@/content/project-items"
import { useCurrentLanguage, useMounted } from "@/hooks"
import { KeyboardShortcut } from "@/components/keyboard-shortcut"

interface ProjectsClientWrapperProps {
  projects: Project[]
}

export default function ProjectsClientWrapper({ projects }: ProjectsClientWrapperProps) {
  const { t } = useTranslation()
  const [showHidden, setShowHidden] = useState(false)
  const [flippedCard, setFlippedCard] = useState<number | null>(null)
  const [focusedCardIndex, setFocusedCardIndex] = useState<number | null>(null)
  const mounted = useMounted()
  const [lastFocusedCardIndex, setLastFocusedCardIndex] = useState<number | null>(null)
  const [announcement, setAnnouncement] = useState("")
  const currentLang = useCurrentLanguage()

  const flippedCardContentRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const mainContentRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus()
    }
  }, [])

  const visibleProjects: Project[] = showHidden ? projects : projects.filter((project) => !project.hidden)

  const flipCard = useCallback(
    (projectId: number | null, index: number | null = null) => {
      if (flippedCard !== null && projectId === null) {
        setLastFocusedCardIndex(focusedCardIndex)
      }

      setFlippedCard(projectId)

      if (index !== null) {
        setFocusedCardIndex(index)
      }

      if (projectId !== null) {
        const project = visibleProjects.find((p) => p.id === projectId)
        if (project) {
          let content
          if (currentLang === "vih" || currentLang === "vi") {
            content = project.content.vi || project.content.en
          } else {
            content = project.content[currentLang as keyof typeof project.content] || project.content.en
          }
          setAnnouncement(`Opened details for ${content.title}`)
        } else {
          setAnnouncement("Closed project details")
        }
      }
    },
    [flippedCard, focusedCardIndex, visibleProjects, currentLang],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        (document.activeElement && document.activeElement.getAttribute("contenteditable") === "true")
      ) {
        return
      }

      if (e.key === "Escape" && flippedCard !== null) {
        e.preventDefault()
        flipCard(null)

        if (lastFocusedCardIndex !== null && cardRefs.current[lastFocusedCardIndex]) {
          setTimeout(() => {
            cardRefs.current[lastFocusedCardIndex]?.focus()
          }, 100)
        }
        return
      }

      if (/^[1-9]$/.test(e.key)) {
        const projectId = Number.parseInt(e.key, 10)
        const projectIndex = visibleProjects.findIndex((p) => p.id === projectId)
        if (projectIndex !== -1) {
          if (flippedCard === projectId) {
            flipCard(null)
            setTimeout(() => {
              cardRefs.current[projectIndex]?.focus()
            }, 100)
          } else {
            flipCard(projectId, projectIndex)
          }
        }
        return
      }

      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault()

        if (focusedCardIndex === null) {
          setFocusedCardIndex(0)
          cardRefs.current[0]?.focus()
          return
        }

        const currentCardIndex = focusedCardIndex
        const currentCardId = visibleProjects[currentCardIndex]?.id

        if (flippedCard !== null && flippedCard === currentCardId) {
          const contentElement = flippedCardContentRef.current

          if (contentElement) {
            const { scrollTop, scrollHeight, clientHeight } = contentElement
            const isAtTop = scrollTop === 0
            const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1

            if (e.key === "ArrowUp" && !isAtTop) {
              contentElement.scrollTop -= 30
              return
            } else if (e.key === "ArrowDown" && !isAtBottom) {
              contentElement.scrollTop += 30
              return
            }
          }
        }

        let newIndex = currentCardIndex

        switch (e.key) {
          case "ArrowLeft":
            newIndex = Math.max(0, currentCardIndex - 1)
            break
          case "ArrowRight":
            newIndex = Math.min(visibleProjects.length - 1, currentCardIndex + 1)
            break
          case "ArrowUp":
            newIndex = Math.max(0, currentCardIndex - 3)
            break
          case "ArrowDown":
            newIndex = Math.min(visibleProjects.length - 1, currentCardIndex + 3)
            break
        }

        if (newIndex !== currentCardIndex) {
          setFocusedCardIndex(newIndex)

          if (flippedCard !== null && flippedCard === currentCardId) {
            flipCard(null)
          }

          setTimeout(() => {
            cardRefs.current[newIndex]?.focus()
            const project = visibleProjects[newIndex]
            if (project) {
              setAnnouncement(`Focused ${project.content[currentLang as keyof typeof project.content]?.title || project.content.en.title}`)
            }
          }, 10)

          cardRefs.current[newIndex]?.scrollIntoView({ behavior: "smooth", block: "nearest" })
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [flippedCard, focusedCardIndex, visibleProjects, flipCard, lastFocusedCardIndex, currentLang])

  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(""), 1000)
      return () => clearTimeout(timer)
    }
  }, [announcement])

  useEffect(() => {
    if (flippedCard !== null) {
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          const flippedCardIndex = visibleProjects.findIndex((p) => p.id === flippedCard)
          if (flippedCardIndex === -1) return

          const flippedCardElement = cardRefs.current[flippedCardIndex]
          if (!flippedCardElement) return

          const focusableElements = flippedCardElement.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          )

          if (focusableElements.length === 0) return

          const firstElement = focusableElements[0] as HTMLElement
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }

      window.addEventListener("keydown", handleTabKey)
      return () => window.removeEventListener("keydown", handleTabKey)
    }
  }, [flippedCard, visibleProjects])

  if (!mounted) {
    // Static content for no-JS users
    const visibleProjects: Project[] = projects.filter((project) => !project.hidden)

    // Static category/status labels
    const staticCategoryLabels: Record<string, string> = {
      personal: "Personal",
      academic: "Academic",
      activism: "Activism",
    }

    const staticStatusLabels: Record<string, string> = {
      completed: "Completed",
      "in-progress": "In Progress",
      planned: "Planned",
    }

    const getCategoryColor = (category: string) => {
      switch (category) {
        case "personal":
          return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
        case "academic":
          return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
        case "activism":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
        default:
          return ""
      }
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case "completed":
          return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
        case "in-progress":
          return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
        case "planned":
          return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
        default:
          return ""
      }
    }

    return (
      <main className="relative min-h-screen w-full overflow-hidden">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Projects</h1>
            <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
              A collection of personal, academic, and activism projects.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {visibleProjects.map((project) => {
                const content = project.content.en
                return (
                  <div
                    key={project.id}
                    className="rounded-xl border bg-card p-6 shadow-sm flex flex-col"
                  >
                    <div className="mb-2">
                      <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getCategoryColor(project.category)}>
                          {staticCategoryLabels[project.category] || project.category}
                        </Badge>
                        <Badge className={getStatusColor(project.status)}>
                          {staticStatusLabels[project.status] || project.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">{content.description}</p>

                    <div className="mt-auto">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-center">
              <Button variant="outline" className="group" disabled>
                <Sparkles className="mr-2 h-4 w-4" />
                Show Random Projects
              </Button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return t("projects.statusLabels.completed")
      case "in-progress":
        return t("projects.statusLabels.inProgress")
      case "planned":
        return t("projects.statusLabels.planned")
      default:
        return ""
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "personal":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      case "academic":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "activism":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      default:
        return ""
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "planned":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
      default:
        return ""
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden" ref={mainContentRef} tabIndex={-1}>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <DarkModeFirefly count={15} />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">{t("projects.title")}</h1>
          <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
            {t("projects.description")}
          </p>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {visibleProjects.map((project, index) => {
              let content
              if (currentLang === "vih" || currentLang === "vi") {
                content = project.content.vi || project.content.en
              } else {
                content = project.content[currentLang as keyof typeof project.content] || project.content.en
              }
              return (
                <motion.div
                  key={project.id}
                  className="relative h-[350px] perspective-1000"
                  variants={item}
                  transition={{ type: "spring", stiffness: 300 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <motion.div
                    className={`absolute w-full h-full rounded-xl transition-all duration-500 transform-style-3d ${
                      flippedCard === project.id ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front of card */}
                    <div
                      id={`project-card-${project.id}`}
                      ref={(el) => { cardRefs.current[index] = el }}
                      className={`absolute w-full h-full backface-hidden rounded-xl border bg-card p-6 shadow-sm flex flex-col cursor-pointer overflow-hidden focus-visible:outline-none ${
                        focusedCardIndex === index
                          ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-background"
                          : "hover:ring-1 hover:ring-primary/50 focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
                      }`}
                      onClick={() => flipCard(project.id, index)}
                      onFocus={() => setFocusedCardIndex(index)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          flipCard(project.id, index)
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`${content.title} card. Press Enter to view details.`}
                    >
                      <div className="mb-2">
                        <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getCategoryColor(project.category)}>
                            {t(`projects.categories.${project.category}`)}
                          </Badge>
                          <Badge className={getStatusColor(project.status)}>{getStatusLabel(project.status)}</Badge>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">{content.description}</p>

                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                        </div>

                        <div className="flex justify-center items-center gap-2">
                          <KeyboardShortcut>{project.id <= 9 ? project.id : ""}</KeyboardShortcut>
                          <span className="text-sm text-muted-foreground">
                            {t("projects.cardActions.clickForDetails")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Back of card */}
                    <div
                      id={`project-card-back-${project.id}`}
                      className={`absolute w-full h-full backface-hidden rounded-xl border bg-card p-6 shadow-sm flex flex-col rotate-y-180 cursor-pointer overflow-hidden focus-visible:outline-none ${
                        focusedCardIndex === index && flippedCard === project.id
                          ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-background"
                          : ""
                      }`}
                      onClick={() => flipCard(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          flipCard(null)
                          setTimeout(() => cardRefs.current[index]?.focus(), 100)
                        }
                      }}
                      tabIndex={flippedCard === project.id ? 0 : -1}
                      role="button"
                      aria-label={`${content.title} details. Press Enter or Escape to close.`}
                    >
                      <h3 className="text-xl font-bold mb-2">{content.title}</h3>
                      <Badge className={`${getCategoryColor(project.category)} mb-4 w-fit`}>
                        {t(`projects.categories.${project.category}`)}
                      </Badge>

                      <div
                        id={`project-content-${project.id}`}
                        ref={flippedCard === project.id ? flippedCardContentRef : null}
                        className="space-y-4 flex-grow overflow-y-auto focus:outline-none"
                        tabIndex={flippedCard === project.id ? 0 : -1}
                        role="region"
                        aria-label={`${content.title} content`}
                      >
                        <div>
                          <h4 className="font-medium">{t("projects.details.what")}</h4>
                          <p className="text-sm text-muted-foreground">{content.what}</p>
                        </div>

                        <div>
                          <h4 className="font-medium">{t("projects.details.learned")}</h4>
                          <p className="text-sm text-muted-foreground">{content.learned}</p>
                        </div>

                        <div>
                          <h4 className="font-medium">{t("projects.details.why")}</h4>
                          <p className="text-sm text-muted-foreground">{content.why}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-center items-center gap-2">
                        <KeyboardShortcut>Esc</KeyboardShortcut>
                        <span className="text-sm text-muted-foreground">{t("projects.cardActions.clickToClose")}</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )
            })}
          </motion.div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowHidden(!showHidden)}
              className="group"
              aria-label={showHidden ? t("projects.buttons.hideRandom") : t("projects.buttons.showRandom")}
            >
              <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
              {showHidden ? t("projects.buttons.hideRandom") : t("projects.buttons.showRandom")}
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
