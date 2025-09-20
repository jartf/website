"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { SUPPORTED_LANGUAGES } from "@/lib/constants"

const LANGUAGE_TRACKER_KEY = "language-tracker"

/**
 * Hook to track which languages a user has visited
 * @returns {Object} Language tracking state and functions
 * @returns {Set<string>} visitedLanguages - Set of language codes the user has visited
 * @returns {boolean} allLanguagesVisited - Whether all supported languages have been visited
 * @returns {Function} trackLanguage - Function to track a language visit
 * @returns {Function} checkAllLanguagesVisited - Function to check if all languages have been visited
 * @returns {Function} resetLanguageTracker - Function to reset the language tracker
 */
export function useLanguageTracker() {
  const { i18n } = useTranslation()
  const [visitedLanguages, setVisitedLanguages] = useState(new Set())
  const [allLanguagesVisited, setAllLanguagesVisited] = useState(false)

  // Initialize from localStorage if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(LANGUAGE_TRACKER_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setVisitedLanguages(new Set(parsed))
          }
        }
      } catch (e) {
        console.error("Failed to parse language tracker data", e)
      }
    }
  }, [])

  // Save to localStorage when changed
  useEffect(() => {
    if (visitedLanguages.size > 0 && typeof window !== "undefined") {
      try {
        localStorage.setItem(LANGUAGE_TRACKER_KEY, JSON.stringify(Array.from(visitedLanguages)))
      } catch (e) {
        console.error("Failed to save language tracker data", e)
      }
    }
  }, [visitedLanguages])

  // Track a language change
  const trackLanguage = useCallback((languageCode) => {
    if (!languageCode) return

    setVisitedLanguages((prev) => {
      const updated = new Set(prev)
      updated.add(languageCode)
      return updated
    })
  }, [])

  // Check if all languages have been visited
  const checkAllLanguagesVisited = useCallback(() => {
    const allVisited = SUPPORTED_LANGUAGES.every((lang) => visitedLanguages.has(lang))

    if (allVisited && !allLanguagesVisited) {
      setAllLanguagesVisited(true)
    }

    return allVisited
  }, [visitedLanguages, allLanguagesVisited])

  // Reset the tracker
  const resetLanguageTracker = useCallback(() => {
    setVisitedLanguages(new Set())
    setAllLanguagesVisited(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem(LANGUAGE_TRACKER_KEY)
    }
  }, [])

  // Track language changes automatically
  useEffect(() => {
    if (i18n.language) {
      trackLanguage(i18n.language)
    }
  }, [i18n.language, trackLanguage])

  return {
    visitedLanguages,
    allLanguagesVisited,
    trackLanguage,
    checkAllLanguagesVisited,
    resetLanguageTracker,
  }
}
