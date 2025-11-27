"use client"

import { useState, useEffect } from "react"

export function usePlatform() {
  const [platform, setPlatform] = useState(() => {
    if (typeof window === "undefined") {
      return {
        isMac: false,
        isWindows: false,
        isLinux: false,
        isMobile: false,
        isTouch: false,
        isDesktop: false,
      }
    }

    const p = navigator.platform.toLowerCase()
    const ua = navigator.userAgent.toLowerCase()
    const width = window.innerWidth
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(ua) || width < 768
    return {
      isMac: p.includes("mac"),
      isWindows: p.includes("win"),
      isLinux: p.includes("linux") || p.includes("x11"),
      isMobile,
      isTouch: "ontouchstart" in window || navigator.maxTouchPoints > 0,
      isDesktop: width >= 1280,
    }
  })

  return platform
}
