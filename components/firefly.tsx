"use client"

import { useRef, memo, useState, useId } from "react"
import { useReducedMotion } from "@/hooks"

interface FireflyProps {
  count?: number
}

const createFireflies = (count: number) => Array.from({ length: count }, (_, i) => ({
  id: i,
  size: 2 + Math.random() * 3,
  duration: 15 + Math.random() * 30,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 10,
}))

/** Creates a firefly effect with CSS animations - no framer-motion for better performance */
export const Firefly = memo(function Firefly({ count = 20 }: FireflyProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fireflies] = useState(() => createFireflies(count))
  const prefersReducedMotion = useReducedMotion()
  const styleId = useId()

  // Skip animation entirely if user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
        {fireflies.map(({ id, size, x, y }) => (
          <div
            key={id}
            className="absolute rounded-full bg-primary/30"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes firefly-pulse-${styleId.replace(/:/g, '')} {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
      <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
        {fireflies.map(({ id, size, duration, x, y, delay }) => (
          <div
            key={id}
            className="absolute rounded-full bg-primary/70"
            style={{
              width: size,
              height: size,
              left: `${x}%`,
              top: `${y}%`,
              boxShadow: `0 0 ${size * 2}px ${size}px rgba(var(--primary), 0.3)`,
              animation: `firefly-pulse-${styleId.replace(/:/g, '')} ${duration}s ease-in-out ${delay}s infinite`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>
    </>
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
