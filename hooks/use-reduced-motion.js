"use client"

import { useState, useEffect } from "react"

/**
 * A hook that returns `true` if the user has requested reduced motion.
 * @returns {boolean} `true` if the user has requested reduced motion, otherwise `false`.
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e) => setPrefersReducedMotion(e.matches)

    mediaQuery.addEventListener?.("change", handleChange) || mediaQuery.addListener?.(handleChange)
    return () => mediaQuery.removeEventListener?.("change", handleChange) || mediaQuery.removeListener?.(handleChange)
  }, [])

  return prefersReducedMotion
}
