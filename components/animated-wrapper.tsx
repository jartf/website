"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedCardProps {
  children: ReactNode
  delay?: number
}

/**
 * Client-only animated card wrapper using framer-motion
 */
export function AnimatedCard({ children, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedContainerProps {
  children: ReactNode
  className?: string
}

/**
 * Client-only animated container with staggered children
 */
export function AnimatedContainer({ children, className }: AnimatedContainerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
