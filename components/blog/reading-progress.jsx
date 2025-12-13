"use client"

import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      setProgress(scrollPercent * 100)
    }
    window.addEventListener("scroll", update)
    update()
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 z-50 h-1 bg-primary transition-all duration-150 ease-out"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  )
}
