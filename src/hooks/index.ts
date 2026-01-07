// Hooks for Astro v5
import { useEffect, useRef } from 'react'
import { languageStore, setLanguage, initLanguage, supportedLanguages, type SupportedLanguage } from '@/i18n'
import { routes, keyboardShortcuts, themes } from '@/lib/constants'

// ============================================================================
// useKeyboardNavigation - Global keyboard shortcuts hook
// ============================================================================
const NAVIGATION_SHORTCUTS: Record<string, string> = {
  [keyboardShortcuts.home]: routes.home,
  [keyboardShortcuts.about]: routes.about,
  [keyboardShortcuts.blog]: routes.blog,
  [keyboardShortcuts.projects]: routes.projects,
  [keyboardShortcuts.now]: routes.now,
  [keyboardShortcuts.uses]: routes.uses,
  [keyboardShortcuts.contact]: routes.contact,
  [keyboardShortcuts.guestbook]: routes.guestbook,
  [keyboardShortcuts.colophon]: routes.colophon,
  [keyboardShortcuts.webring]: routes.webring,
  [keyboardShortcuts.slashes]: routes.slashes,
  [keyboardShortcuts.scrapbook]: routes.scrapbook,
  [keyboardShortcuts.game2048]: routes.game2048,
  [keyboardShortcuts.tetris]: routes.tetris,
}

export function useKeyboardNavigation() {
  const refreshCatRef = useRef<Element | null>(null)

  // Initialize on mount
  useEffect(() => {
    initLanguage()
  }, [])

  // Find refresh cat button
  useEffect(() => {
    const find = () => {
      refreshCatRef.current = document.querySelector('button[aria-label="Refresh mood cat"]')
    }
    find()
    const t = setTimeout(find, 1000)
    return () => clearTimeout(t)
  }, [])

  // Keyboard event handler
  useEffect(() => {
    const cycleTheme = () => {
      const currentTheme = localStorage.getItem('theme') || 'dark'
      const idx = themes.indexOf(currentTheme as any)
      const newTheme = themes[(idx + 1) % themes.length]
      localStorage.setItem('theme', newTheme)
      document.documentElement.classList.remove('light', 'dark')
      if (newTheme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        document.documentElement.classList.add(systemTheme)
        document.documentElement.style.colorScheme = systemTheme
      } else {
        document.documentElement.classList.add(newTheme)
        document.documentElement.style.colorScheme = newTheme
      }
    }

    const cycleLanguage = () => {
      const codes = supportedLanguages.map(l => l.code)
      const currentLang = languageStore.get()
      const idx = codes.indexOf(currentLang)
      const nextIdx = idx === -1 ? 0 : (idx + 1) % codes.length
      setLanguage(codes[nextIdx] as SupportedLanguage)
    }

    const handleKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el?.getAttribute('contenteditable') === 'true') return
      if (e.ctrlKey || e.metaKey) return

      const pathname = window.location.pathname

      const isGame = pathname.includes(routes.game2048) || pathname.includes(routes.tetris)

      if (isGame) {
        if (e.key === 'h' && !e.altKey) { e.preventDefault(); window.location.href = '/' }
        else if (e.key === 'm' && !e.altKey) { e.preventDefault(); cycleTheme() }
        else if (e.key === 'y' && !e.altKey) { e.preventDefault(); cycleLanguage() }
        return
      }

      if (!e.altKey) {
        if (e.key in NAVIGATION_SHORTCUTS) {
          e.preventDefault()
          window.location.href = NAVIGATION_SHORTCUTS[e.key]
          return
        }
        if (e.key === 'm') { e.preventDefault(); cycleTheme() }
        else if (e.key === 'y') { e.preventDefault(); cycleLanguage() }
        else if (e.key === 'r' && refreshCatRef.current) { e.preventDefault(); (refreshCatRef.current as HTMLButtonElement).click() }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])
}
