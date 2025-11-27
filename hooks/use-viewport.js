"use client"

import { useState, useEffect } from "react"
import { debounce } from "@/lib/utils"

export function useViewport() {
  const [viewport, setViewport] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    windowWidth: 0,
  })

  useEffect(() => {
    const checkViewport = () => {
      const width = window.innerWidth
      setViewport({
        windowWidth: width,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1280,
        isDesktop: width >= 1280,
      })
    }
    checkViewport()
    // Debounce resize events to improve performance
    const debouncedCheckViewport = debounce(checkViewport, 150)
    window.addEventListener("resize", debouncedCheckViewport)
    return () => window.removeEventListener("resize", debouncedCheckViewport)
  }, [])

  return viewport
}
