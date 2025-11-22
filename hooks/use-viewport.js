"use client"

import { useState, useEffect } from "react"

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
    window.addEventListener("resize", checkViewport)
    return () => window.removeEventListener("resize", checkViewport)
  }, [])

  return viewport
}
