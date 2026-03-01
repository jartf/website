"use client"

import { useState, memo } from "react"
import { useTranslation } from "react-i18next"
import { AlertCircle, X } from "lucide-react"
import { useMounted, useReducedMotion } from "@/hooks"
import { completedLanguages } from "@/lib/constants"

/** Notice for non-complete translation languages */
export const LanguageNotice = memo(function LanguageNotice() {
  const { i18n, t } = useTranslation()
  const [visible, setVisible] = useState(true)
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()

  if (!mounted || !visible) return null

  const baseLang = i18n.language?.split("-")[0]
  const isComplete = completedLanguages.some(l => i18n.language === l || i18n.language?.startsWith(l + "-") || baseLang === l)
  if (isComplete) return null

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
      <div className="bg-amber-100 dark:bg-amber-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-100 px-4 py-3 rounded-lg shadow-md flex items-center max-w-xl">
        <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
        <p className="text-sm">{t("languageNotice.message")}</p>
        <button
          onClick={() => setVisible(false)}
          className="ml-4 p-1 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
          aria-label={t("languageNotice.dismiss")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
})
