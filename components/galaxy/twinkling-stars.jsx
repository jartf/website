"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useReducedMotion, useMounted } from "@/hooks"

/**
 * @typedef {Object} TwinkleStarProps
 * @property {number} id - Unique identifier for the star
 * @property {number} left - Left position in pixels
 * @property {number} top - Top position in pixels
 * @property {number} size - Size of the star in pixels
 */

const TwinkleStar = ({ id, left, top, size }) => {
  return (
    <motion.svg
      key={id}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 0.5, 1, 0], scale: [0, 1, 0.8, 1, 0] }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
      style={{ position: "absolute", left: `${left}px`, top: `${top}px`, width: `${size}px`, height: `${size}px` }}
      width="149"
      height="149"
      viewBox="0 0 149 149"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="twinkle-star"
    >
      <circle cx="74" cy="74" r="11" fill="white" />
      <rect
        y="141.421"
        width="200"
        height="10"
        transform="rotate(-45 0 141.421)"
        fill={`url(#paint0_linear_4_2_${id})`}
      />
      <rect
        x="7.07107"
        width="200"
        height="10"
        transform="rotate(45 7.07107 0)"
        fill={`url(#paint1_linear_4_2_${id})`}
      />
      <defs>
        <linearGradient
          id={`paint0_linear_4_2_${id}`}
          x1="0"
          y1="146.421"
          x2="200"
          y2="146.421"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1E1E1E" />
          <stop offset="0.445" stopColor="white" />
          <stop offset="0.58721" stopColor="white" />
          <stop offset="1" stopColor="#1E1E1E" />
        </linearGradient>
        <linearGradient
          id={`paint1_linear_4_2_${id}`}
          x1="7.07107"
          y1="5"
          x2="207.071"
          y2="5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1E1E1E" />
          <stop offset="0.42" stopColor="white" />
          <stop offset="0.555" stopColor="white" />
          <stop offset="1" stopColor="#1E1E1E" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
}

/**
 * TwinklingStars component - renders animated twinkling stars.
 * Visibility is controlled via CSS (parent #galaxy element),
 * so this component doesn't need to check theme state.
 */
export function TwinklingStars() {
  const [stars, setStars] = useState([])
  const mounted = useMounted()
  const nextIdRef = useRef(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Wait for mount to access window dimensions
    if (!mounted) return

    const generateStar = () => {
      // Skip star generation if user prefers reduced motion
      if (prefersReducedMotion) return

      const id = nextIdRef.current++
      const left = Math.floor(Math.random() * window.innerWidth)
      const top = Math.floor(Math.random() * (window.innerHeight / 3))
      const isMobile = window.innerWidth < 768
      const size = isMobile
        ? Math.floor(Math.random() * (15 - 7.5 + 1) + 7.5)
        : Math.floor(Math.random() * (30 - 15 + 1) + 15)

      setStars((prevStars) => [...prevStars, { id, left, top, size }])

      // Remove the star after animation completes
      setTimeout(() => {
        setStars((prevStars) => prevStars.filter((star) => star.id !== id))
      }, 2500)
    }

    // Don't set interval if user prefers reduced motion
    if (prefersReducedMotion) return

    const interval = setInterval(generateStar, 5000)
    return () => clearInterval(interval)
  }, [mounted, prefersReducedMotion])

  // Render immediately - CSS controls visibility based on theme
  // This prevents the component from being completely absent during SSR
  return (
    <div className="fixed inset-0 pointer-events-none">
      <AnimatePresence>
        {stars.map((star) => (
          <TwinkleStar key={star.id} {...star} />
        ))}
      </AnimatePresence>
    </div>
  )
}
