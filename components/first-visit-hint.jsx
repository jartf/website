"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useViewport } from "@/hooks"
import { X } from "lucide-react"
import { KeyboardShortcut } from "@/components/keyboard-shortcut"

const STORAGE_KEY = "first-visit-hint-dismissed"

export function FirstVisitHint() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const { isDesktop } = useViewport()

  useEffect(() => {
    // Check if user has visited before and dismissed the hint
    const hasSeenHint = localStorage.getItem(STORAGE_KEY)

    // Show hint if:
    // 1. User is on desktop
    // 2. They haven't seen the hint before
    if (isDesktop && !hasSeenHint) {
      // Show the banner after a short delay for better UX
      const timer = setTimeout(() => {
        setVisible(true)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isDesktop])

  const handleDismiss = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, "true")
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500"
      role="alert"
      aria-live="polite"
    >
      <div className="mx-auto max-w-3xl p-4">
        <div className="flex items-center justify-between gap-4 rounded-lg border bg-card/95 backdrop-blur-sm px-6 py-4 shadow-lg">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-2xl" role="img" aria-label="lightbulb">
              💡
            </span>
            <p className="text-sm font-medium">
              <span className="font-semibold">{t("firstVisitHint.prefix", "Hint:")}</span>{" "}
              {t("firstVisitHint.message", "You can press the")}{" "}
              <KeyboardShortcut>.</KeyboardShortcut>{" "}
              {t("firstVisitHint.suffix", "key on your keyboard to open the action search bar :D")}
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 rounded-md p-1.5 hover:bg-muted transition-colors"
            aria-label={t("firstVisitHint.dismiss", "Dismiss hint")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
