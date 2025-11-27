"use client"

import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"

/**
 * Hook to check if translations are ready
 * @returns {boolean} Whether translations are initialized and ready
 */
export function useTranslationReady() {
  const { i18n } = useTranslation()
  const [isReady, setIsReady] = useState(() => i18n.isInitialized)

  useEffect(() => {
    if (i18n.isInitialized) {
      if (!isReady) {
        queueMicrotask(() => setIsReady(true))
      }
    } else {
      const handleInitialized = () => {
        setIsReady(true)
      }

      i18n.on("initialized", handleInitialized)

      return () => {
        i18n.off("initialized", handleInitialized)
      }
    }
  }, [i18n, isReady])

  return isReady
}
