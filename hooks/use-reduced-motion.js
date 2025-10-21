"use client"

import { useState, useEffect } from "react"

/**
 * A hook that returns `true` if the user has requested reduced motion.
 * @returns {boolean} `true` if the user has requested reduced motion, otherwise `false`.
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Check if the browser supports matchMedia
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")

      // Set initial value
      setPrefersReducedMotion(mediaQuery.matches)

      // Create event listener function
      const handleChange = (event) => {
        setPrefersReducedMotion(event.matches)
      }

      // Add event listener for changes
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange)
      }

      // Clean up
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener("change", handleChange)
        } else {
          // Fallback for older browsers
          mediaQuery.removeListener(handleChange)
        }
      }
    }

    return undefined
  }, [])

  return prefersReducedMotion
}
