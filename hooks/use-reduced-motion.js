"use client"

import { useState, useEffect } from "react"

export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handler = (e) => setPrefersReducedMotion(e.matches)
    setPrefersReducedMotion(mq.matches)
    mq.addEventListener?.("change", handler) || mq.addListener?.(handler)
    return () => mq.removeEventListener?.("change", handler) || mq.removeListener?.(handler)
  }, [])

  return prefersReducedMotion
}
