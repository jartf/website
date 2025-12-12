"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DarkModeFirefly } from "@/components/dark-mode-firefly"
import { useMounted } from "@/hooks/use-mounted"
import type { ReactNode } from "react"

interface NotFoundAnimationProps {
  children: ReactNode
}

/**
 * Client wrapper that adds animations to the 404 page
 * All HTML content is server-rendered and passed as children
 */
export function NotFoundAnimation({ children }: NotFoundAnimationProps) {
  const mounted = useMounted()

  if (!mounted) {
    // Return children without animation for SSR/no-JS
    return <>{children}</>
  }

  return (
    <>
      <DarkModeFirefly count={25} />
      {children}
    </>
  )
}

interface AnimatedCatIconProps {
  children: ReactNode
}

/**
 * Animated floating cat icon with wandering effect
 */
export function AnimatedCatIcon({ children }: AnimatedCatIconProps) {
  const mounted = useMounted()
  const [randomPosition] = useState(() => ({
    x: Math.random() * 40 - 20,
    y: Math.random() * 40 - 20,
  }))

  if (!mounted) {
    return <div className="relative">{children}</div>
  }

  return (
    <motion.div
      className="relative"
      animate={{
        x: [randomPosition.x, -randomPosition.x, randomPosition.x],
        y: [randomPosition.y, -randomPosition.y, randomPosition.y],
      }}
      transition={{
        duration: 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    >
      {children}
      <motion.div
        className="absolute top-0 right-0 w-full h-full rounded-full border-2 border-primary/30"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
      <motion.div
        className="absolute -top-4 -right-4 bg-muted-foreground text-background text-xs px-2 py-1 rounded-full"
        initial={{ rotate: -5 }}
        animate={{ rotate: 5 }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
          duration: 1,
        }}
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
 * Animated compass with spinning needle
 */
export function AnimatedCompass({ children }: AnimatedCompassProps) {
  const mounted = useMounted()

  if (!mounted) {
    return <div className="relative">{children}</div>
  }

  return (
    <div className="relative">
      {children}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      >
        <div className="w-1 h-6 bg-gradient-to-b from-primary to-transparent rounded-full transform translate-y-[-4px]" />
      </motion.div>
    </div>
  )
}

interface AnimatedSectionProps {
  children: ReactNode
  delay?: number
}

/**
 * Animated section with fade-in effect
 */
export function AnimatedSection({ children, delay = 0 }: AnimatedSectionProps) {
  const mounted = useMounted()

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}
