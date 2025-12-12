"use client"

import { motion } from "framer-motion"
import { DarkModeFirefly } from "@/components/firefly"
import { useMounted } from "@/hooks"
import type { ReactNode } from "react"

interface SlashesAnimationProps {
  children: ReactNode
}

/**
 * Client wrapper that adds animations to the slashes page
 * All HTML content is server-rendered and passed as children
 */
export function SlashesAnimation({ children }: SlashesAnimationProps) {
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

interface AnimatedSlashCardProps {
  children: ReactNode
  index: number
}

/**
 * Animated card wrapper for individual slash items
 */
export function AnimatedSlashCard({ children, index }: AnimatedSlashCardProps) {
  const mounted = useMounted()

  if (!mounted) {
    return <div>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {children}
    </motion.div>
  )
}
