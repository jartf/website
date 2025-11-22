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
    const p = navigator.platform.toLowerCase()
    const ua = navigator.userAgent.toLowerCase()
    setPlatform({
      isMac: p.includes("mac"),
      isWindows: p.includes("win"),
      isLinux: p.includes("linux") || p.includes("x11"),
      isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(ua) || window.innerWidth < 768,
      isTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
    })
  }, [])

  return platform
}
