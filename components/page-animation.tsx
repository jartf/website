"use client"

import { useEffect, useState, type ReactNode } from "react"
import { motion } from "framer-motion"
import { DarkModeFirefly } from "@/components/firefly"
import { useMounted, useReducedMotion } from "@/hooks"

// ============================================================================
// Page Animation Wrapper - Unified component for page-level animations
// ============================================================================

interface PageAnimationProps {
  children: ReactNode
  fireflyCount?: number
  /** Enable keyboard navigation with number keys (1-N) to jump to sections */
  sectionNavigation?: { count: number; prefix?: string }
}

/**
 * Unified page animation wrapper that provides:
 * - DarkModeFirefly effect (client-only)
 * - Optional keyboard section navigation (1-N keys)
 * - Screen reader announcements
 *
 * Replaces: ScrapbookAnimation, SlashesAnimation, ColophonAnimation base functionality
 */
export function PageAnimation({ children, fireflyCount = 15, sectionNavigation }: PageAnimationProps) {
  const mounted = useMounted()

  useEffect(() => {
    if (!mounted || !sectionNavigation) return

    const { count, prefix = "section" } = sectionNavigation

    const handleKeyDown = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el?.getAttribute("contenteditable") === "true") return

      const num = parseInt(e.key)
      if (num >= 1 && num <= count) {
        e.preventDefault()
        const section = document.getElementById(`${prefix}-${num}`)
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" })
          section.classList.add("ring-2", "ring-primary", "ring-offset-2")
          setTimeout(() => section.classList.remove("ring-2", "ring-primary", "ring-offset-2"), 1000)

          const title = section.querySelector("h2")?.textContent
          const announcement = document.getElementById("keyboard-announcement")
          if (announcement && title) announcement.textContent = `Jumped to ${title}`
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [mounted, sectionNavigation])

  return (
    <>
      {mounted && <DarkModeFirefly count={fireflyCount} />}
      {sectionNavigation && <div className="sr-only" aria-live="polite" id="keyboard-announcement" />}
      {children}
    </>
  )
}

// ============================================================================
// Animated Section - Fade-in animation wrapper
// ============================================================================

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

/**
 * Animated section with fade-in-up effect
 * Falls back to static content when unmounted or user prefers reduced motion
 */
export function AnimatedSection({ children, delay = 0, className }: AnimatedSectionProps) {
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()

  if (!mounted || prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// Animated Entry - Staggered list item animation
// ============================================================================

interface AnimatedEntryProps {
  children: ReactNode
  index: number
  className?: string
}

/**
 * Animated entry for list items with staggered fade-in
 */
export function AnimatedEntry({ children, index, className = "relative" }: AnimatedEntryProps) {
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()

  if (!mounted || prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  )
}

// ============================================================================
// 404 Page Specific Animations (kept separate due to unique effects)
// ============================================================================

interface AnimatedCatIconProps {
  children: ReactNode
}

/**
 * Animated floating cat icon with wandering effect - specific to 404 page
 */
export function AnimatedCatIcon({ children }: AnimatedCatIconProps) {
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()
  const [pos] = useState(() => ({ x: Math.random() * 40 - 20, y: Math.random() * 40 - 20 }))

  if (!mounted || prefersReducedMotion) {
    return <div className="relative">{children}</div>
  }

  return (
    <motion.div
      className="relative"
      animate={{ x: [pos.x, -pos.x, pos.x], y: [pos.y, -pos.y, pos.y] }}
      transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
    >
      {children}
      <motion.div
        className="absolute top-0 right-0 w-full h-full rounded-full border-2 border-primary/30"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute -top-4 -right-4 bg-muted-foreground text-background text-xs px-2 py-1 rounded-full"
        initial={{ rotate: -5 }}
        animate={{ rotate: 5 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
      >
        ?!?
      </motion.div>
    </motion.div>
  )
}

interface AnimatedCompassProps {
  children: ReactNode
}

/**
 * Animated compass with spinning needle - specific to 404 page
 */
export function AnimatedCompass({ children }: AnimatedCompassProps) {
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()

  if (!mounted || prefersReducedMotion) {
    return <div className="relative">{children}</div>
  }

  return (
    <div className="relative">
      {children}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-1 h-6 bg-gradient-to-b from-primary to-transparent rounded-full transform translate-y-[-4px]" />
      </motion.div>
    </div>
  )
}
