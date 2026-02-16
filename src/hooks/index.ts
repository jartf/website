// Hooks for Astro v5
import { useEffect, useRef } from 'react'
import { cycleLanguage } from '@/i18n'
import { routes, keyboardShortcuts } from '@/lib/constants'
import { cycleTheme } from '@/lib/theme-utils'

const NAV_SHORTCUTS: Record<string, string> = Object.fromEntries(
  Object.entries(keyboardShortcuts)
    .filter(([key]) => key in routes)
    .map(([key, shortcut]) => [shortcut, routes[key as keyof typeof routes]])
)

export function useKeyboardNavigation() {
  const catBtnRef = useRef<Element | null>(null)

  useEffect(() => {
    const find = () => { catBtnRef.current = document.querySelector('button[aria-label="Refresh mood cat"]') }
    find()
    const t = setTimeout(find, 1000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el?.getAttribute('contenteditable') === 'true') return
      if (e.ctrlKey || e.metaKey || e.altKey) return

      const path = window.location.pathname
      const isGame = path.includes(routes.game2048) || path.includes(routes.tetris)

      if (isGame) {
        if (e.key === 'h') { e.preventDefault(); window.location.href = '/' }
        else if (e.key === 'm') { e.preventDefault(); cycleTheme() }
        else if (e.key === 'y') { e.preventDefault(); cycleLanguage() }
        return
      }

      if (e.key in NAV_SHORTCUTS) {
        e.preventDefault()
        window.location.href = NAV_SHORTCUTS[e.key]
      } else if (e.key === 'm') { e.preventDefault(); cycleTheme() }
      else if (e.key === 'y') { e.preventDefault(); cycleLanguage() }
      else if (e.key === 'r' && catBtnRef.current) { e.preventDefault(); (catBtnRef.current as HTMLButtonElement).click() }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])
}
