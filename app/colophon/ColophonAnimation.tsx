"use client"

import { useEffect, useRef } from "react"
import { DarkModeFirefly } from "@/components/dark-mode-firefly"
import { useMounted } from "@/hooks/use-mounted"
import type { ReactNode } from "react"

interface ColophonAnimationProps {
  children: ReactNode
  sectionCount: number
}

/**
 * Client wrapper for Colophon page that adds:
 * - DarkModeFirefly effect
 * - Keyboard navigation between sections (1-4 keys)
 */
export function ColophonAnimation({ children, sectionCount }: ColophonAnimationProps) {
  const mounted = useMounted()
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    if (!mounted) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement ||
        (document.activeElement && document.activeElement.getAttribute("contenteditable") === "true")
      ) {
        return
      }

      const sectionNumber = Number.parseInt(e.key)
      if (sectionNumber >= 1 && sectionNumber <= sectionCount) {
        e.preventDefault()

        // Find section by id
        const sectionElement = document.getElementById(`section-${sectionNumber}`)
        if (sectionElement) {
          sectionElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })

          // Add highlight effect
          sectionElement.classList.add("ring-2", "ring-primary", "ring-offset-2")
          setTimeout(() => {
            sectionElement.classList.remove("ring-2", "ring-primary", "ring-offset-2")
          }, 1000)

          // Screen reader announcement
          const sectionTitle = sectionElement.querySelector("h2")?.textContent
          const announcement = document.getElementById("keyboard-announcement")
          if (announcement && sectionTitle) {
            announcement.textContent = `Jumped to ${sectionTitle}`
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mounted, sectionCount])

  return (
    <>
      {mounted && <DarkModeFirefly count={15} />}
      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite" id="keyboard-announcement"></div>
      {children}
    </>
  )
}
