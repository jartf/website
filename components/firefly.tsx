"use client"

import { useRef, memo, useState } from "react"
import { motion } from "framer-motion"

interface FireflyProps {
  count?: number
}

const createFireflies = (count: number) => Array.from({ length: count }, (_, i) => ({
  id: i,
  size: 2 + Math.random() * 3,
  duration: 15 + Math.random() * 30,
  x: Math.random() * 100,
  y: Math.random() * 100,
}))

/** Creates a firefly effect with animated dots */
export const Firefly = memo(function Firefly({ count = 20 }: FireflyProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fireflies] = useState(() => createFireflies(count))

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {fireflies.map(({ id, size, duration, x, y }) => (
        <motion.div
          key={id}
          className="absolute rounded-full bg-primary/70 shadow-glow"
          style={{
            width: size,
            height: size,
            left: `${x}%`,
            top: `${y}%`,
            boxShadow: `0 0 ${size * 2}px ${size}px rgba(var(--primary), 0.3)`,
            willChange: "transform, opacity",
          }}
          animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  )
})

/** Fireflies only visible in dark mode via CSS */
export const DarkModeFirefly = memo(function DarkModeFirefly({ count = 15 }: FireflyProps) {
  return (
    <div className="firefly-container">
      <Firefly count={count} />
    </div>
  )
})
