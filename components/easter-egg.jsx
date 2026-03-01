"use client"

import { useState, useEffect, memo } from "react"
import { useLanguageTracker, useMounted, useReducedMotion } from "@/hooks"
import { Globe, X, PartyPopper } from "lucide-react"

/** Easter egg popup when user visits all language versions */
export const EasterEgg = memo(function EasterEgg() {
  const { allLanguagesVisited, resetLanguageTracker } = useLanguageTracker()
  const [visible, setVisible] = useState(false)
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!allLanguagesVisited) return
    queueMicrotask(() => setVisible(true))
  }, [allLanguagesVisited])

  const handleDismiss = () => {
    setVisible(false)
    resetLanguageTracker()
  }

  if (!mounted || !visible) return null

  return (
    <div
      className="fixed top-16 inset-x-0 z-50 flex justify-center p-4"
      style={{
        animation: prefersReducedMotion ? "none" : "slideDown 0.3s ease-out",
      }}
    >
      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-50px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="bg-purple-100 dark:bg-purple-900 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-100 px-4 py-3 rounded-lg shadow-md flex items-center max-w-xl">
        <PartyPopper className="h-5 w-5 mr-3 flex-shrink-0" />
        <div className="flex flex-col">
          <p className="text-sm font-medium">🎉 Achievement Unlocked: Polyglot!</p>
          <p className="text-xs opacity-80">You&apos;ve visited all {12} language versions of this site. Impressive!</p>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-4 p-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
})
