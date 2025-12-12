"use client"

import { motion } from "framer-motion"
import { DarkModeFirefly } from "@/components/dark-mode-firefly"
import { useMounted } from "@/hooks/use-mounted"
import type { ReactNode } from "react"

interface ScrapbookAnimationProps {
  children: ReactNode
}

/**
 * Client wrapper that adds animations to the scrapbook page
 * All HTML content is server-rendered and passed as children
 */
export function ScrapbookAnimation({ children }: ScrapbookAnimationProps) {
  const mounted = useMounted()

  if (!mounted) {
    // Return children without animation for SSR/no-JS
    return <>{children}</>
  }

  return (
    <>
      <DarkModeFirefly count={15} />
      {children}
    </>
  )
}

interface AnimatedEntryProps {
  children: ReactNode
  index: number
}

/**
 * Animated wrapper for individual devlog entries
 */
export function AnimatedEntry({ children, index }: AnimatedEntryProps) {
  const mounted = useMounted()

  if (!mounted) {
    return <div className="relative">{children}</div>
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
}

/**
 * Animated section wrapper with fade-in effect
 */
export function AnimatedSection({ children, delay = 0 }: AnimatedSectionProps) {
  const mounted = useMounted()

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <motion.div
      variants={item}
      initial="hidden"
      animate="show"
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
