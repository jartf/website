"use client"

import { useRef, memo, RefObject, useState, useEffect } from "react"
import { motion } from "framer-motion"

interface FireflyProps {
  count?: number
}

interface FireflyDotProps {
  containerRef: RefObject<HTMLDivElement | null>
}

/**
 * A component that creates a firefly effect with animated dots.
 */
export const Firefly = memo(function Firefly({ count = 20 }: FireflyProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <FireflyDot key={i} containerRef={containerRef} />
      ))}
    </div>
  )
})

Firefly.displayName = "Firefly"

/**
 * Component that renders fireflies only in dark mode.
 * Uses CSS-first approach: visibility controlled via .firefly-container CSS rules.
 */
export const DarkModeFirefly = memo(function DarkModeFirefly({ count = 15 }: FireflyProps) {
  return (
    <div className="firefly-container">
      <Firefly count={count} />
    </div>
  )
})

DarkModeFirefly.displayName = "DarkModeFirefly"

/**
 * A single firefly dot component.
 */
const FireflyDot = memo(function FireflyDot({ containerRef }: FireflyDotProps) {
  const [randomValues] = useState(() => ({
    size: 2 + Math.random() * 3,
    duration: 15 + Math.random() * 30,
  }))

  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (containerRef.current) {
      setPosition({
        x: Math.random() * containerRef.current.offsetWidth,
        y: Math.random() * containerRef.current.offsetHeight,
      })
    }
  }, [containerRef])

  return (
    <motion.div
      className="absolute rounded-full bg-primary/70 shadow-glow"
      style={{
        width: randomValues.size,
        height: randomValues.size,
        boxShadow: `0 0 ${randomValues.size * 2}px ${randomValues.size}px rgba(var(--primary), 0.3)`,
        x: position.x,
        y: position.y,
        willChange: "transform, opacity",
      }}
      animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.2, 1] }}
      transition={{ duration: randomValues.duration, repeat: Infinity, ease: "easeInOut" }}
    />
  )
})

FireflyDot.displayName = "FireflyDot"
