"use client"

import { useState, useEffect } from "react"

/**
 * Hook to detect platform information
 * @returns {Object} Platform information including OS and device details
 */
export function usePlatform() {
  const [platform, setPlatform] = useState({
    isMac: false,
    isWindows: false,
    isLinux: false,
    isMobile: false,
    isTouch: false,
  })

  useEffect(() => {
    const detectPlatform = () => {
      const p = navigator.platform.toLowerCase()
      const ua = navigator.userAgent.toLowerCase()
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i

      setPlatform({
        isMac: p.includes("mac"),
        isWindows: p.includes("win"),
        isLinux: p.includes("linux") || p.includes("x11"),
        isMobile: mobileRegex.test(ua) || window.innerWidth < 768,
        isTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      })
    }

    detectPlatform()
    window.addEventListener("resize", detectPlatform)
    return () => window.removeEventListener("resize", detectPlatform)
  }, [])

  return platform
}
