"use client"

import { useEffect, useState, type ReactNode, memo } from "react"
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
export const PageAnimation = memo(function PageAnimation({ children, fireflyCount = 15, sectionNavigation }: PageAnimationProps) {
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
})

// ============================================================================
// Animated Section - Fade-in animation wrapper (CSS-first)
// ============================================================================

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
  className?: string
  /** Custom animation class to use instead of default animate-fade-in-up */
  animationClass?: string
}

/**
 * Animated section with fade-in-up effect using CSS
 * Falls back to static content when unmounted or user prefers reduced motion
 */
export const AnimatedSection = memo(function AnimatedSection({ children, delay = 0, className, animationClass }: AnimatedSectionProps) {
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()

  if (!mounted || prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  const finalAnimationClass = animationClass || 'animate-fade-in-up'
  const style = animationClass ? undefined : { animationDelay: `${delay}s`, animationFillMode: "both" as const }

  return (
    <div className={`${className || ''} ${finalAnimationClass}`.trim()} style={style}>
      {children}
    </div>
  )
})

// ============================================================================
// Animated Entry - Staggered list item animation (CSS-first)
// ============================================================================

interface AnimatedEntryProps {
  children: ReactNode
  index: number
  className?: string
}

/**
 * Animated entry for list items with staggered fade-in using CSS
 */
export const AnimatedEntry = memo(function AnimatedEntry({ children, index, className = "relative" }: AnimatedEntryProps) {
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()

  if (!mounted || prefersReducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <div
      className={`${className} animate-fade-in-up`}
      style={{
        animationDelay: `${index * 0.1}s`,
        animationFillMode: "both",
      }}
    >
      {children}
    </div>
  )
})

// ============================================================================
// 404 Page Specific Animations (CSS-first approach)
// ============================================================================

interface AnimatedCatIconProps {
  children: ReactNode
}

/**
 * Animated floating cat icon with wandering effect - specific to 404 page
 * Uses CSS keyframes for smooth animation
 */
export const AnimatedCatIcon = memo(function AnimatedCatIcon({ children }: AnimatedCatIconProps) {
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()

  if (!mounted || prefersReducedMotion) {
    return <div className="relative">{children}</div>
  }

  return (
    <div className="relative animate-wander">
      <style jsx>{`
        @keyframes wander {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(20px, -10px); }
          50% { transform: translate(-10px, 20px); }
          75% { transform: translate(-20px, -20px); }
        }
        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .animate-wander { animation: wander 10s ease-in-out infinite; }
        .pulse-ring { animation: pulse-ring 2s ease-in-out infinite; }
        .wobble { animation: wobble 1s ease-in-out infinite; }
      `}</style>
      {children}
      <div
        className="absolute top-0 right-0 w-full h-full rounded-full border-2 border-primary/30 pulse-ring"
      />
      <div className="absolute -top-4 -right-4 bg-muted-foreground text-background text-xs px-2 py-1 rounded-full wobble">
        ?!?
      </div>
    </div>
  )
})

interface AnimatedCompassProps {
  children: ReactNode
}

/**
 * Animated compass with spinning needle - specific to 404 page
 * Uses CSS keyframes for smooth animation
 */
export const AnimatedCompass = memo(function AnimatedCompass({ children }: AnimatedCompassProps) {
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()

  if (!mounted || prefersReducedMotion) {
    return <div className="relative">{children}</div>
  }

  return (
    <div className="relative">
      <style jsx>{`
        @keyframes spin-compass {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-compass { animation: spin-compass 10s linear infinite; }
      `}</style>
      {children}
      <div className="absolute inset-0 flex items-center justify-center spin-compass">
        <div className="w-1 h-6 bg-gradient-to-b from-primary to-transparent rounded-full transform -translate-y-1" />
      </div>
    </div>
  )
})
