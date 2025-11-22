"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { AlertCircle, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useMounted } from "@/hooks/use-mounted"

/**
 * Component that displays a notice for non-English languages
 * @returns {JSX.Element|null} Language notice component or null if not needed
 */
export function LanguageNotice() {
  const { i18n, t } = useTranslation()
  const [isVisible, setIsVisible] = useState(true)
  const mounted = useMounted()

  if (!mounted) return null

  // Exclude completed languages
  const excludedLanguages = ["en", "vi", "ru", "da"]
  const baseLanguage = i18n.language?.split("-")[0]

  if (
    excludedLanguages.includes(i18n.language) ||
    i18n.language?.startsWith("en-") ||
    excludedLanguages.includes(baseLanguage) ||
    !isVisible
  )
    return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-16 inset-x-0 z-50 flex justify-center p-4"
      >
        <div className="bg-amber-100 dark:bg-amber-900 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-100 px-4 py-3 rounded-lg shadow-md flex items-center max-w-xl">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <div className="text-sm">
            <p>{t("languageNotice.message")}</p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-4 p-1 rounded-full hover:bg-amber-200 dark:hover:bg-amber-800 transition-colors"
            aria-label={t("languageNotice.dismiss")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
