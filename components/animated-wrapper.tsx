"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"
import { useReducedMotion } from "@/hooks"

interface AnimatedProps {
  children: ReactNode
  className?: string
  delay?: number
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

/** Animated card with fade-in-up effect */
export function AnimatedCard({ children, className, delay = 0 }: AnimatedProps) {
  const prefersReducedMotion = useReducedMotion()
  if (prefersReducedMotion) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} initial="hidden" animate="show" variants={fadeInUp} transition={{ delay }}>
      {children}
    </motion.div>
  )
}

/** Container with staggered children animations */
export function AnimatedContainer({ children, className }: AnimatedProps) {
  const prefersReducedMotion = useReducedMotion()
  if (prefersReducedMotion) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} initial="hidden" animate="show" variants={staggerContainer}>
      {children}
    </motion.div>
  )
}
