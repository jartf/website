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
 * @param {Object} props - The component props.
 * @param {number} [props.count=20] - The number of fireflies to render.
 * @returns {JSX.Element} The firefly effect component.
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
 * A single firefly dot component.
 * @param {Object} props - The component props.
 * @param {React.RefObject<HTMLDivElement>} props.containerRef - A reference to the container element.
 * @returns {JSX.Element} A single firefly dot.
 */
const FireflyDot = memo(function FireflyDot({ containerRef }: FireflyDotProps) {
  const [randomValues] = useState(() => {
    // Initialize with default values first
    return {
      initialPosition: { x: 0, y: 0 },
      size: 2 + Math.random() * 3,
      duration: 15 + Math.random() * 30,
    }
  })

  // Update position after mount when container is available
  const [position, setPosition] = useState({ x: 0, y: 0 })
  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth
      const height = containerRef.current.offsetHeight
      setPosition({
        x: Math.random() * width,
        y: Math.random() * height,
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
      animate={{
        opacity: [0.1, 0.5, 0.1],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: randomValues.duration,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )
})

FireflyDot.displayName = "FireflyDot"
