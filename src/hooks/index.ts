// Hooks for Astro v5
import { useState, useEffect } from 'react'

// Shared hook: returns true after first mount (SSR-safe)
export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  return mounted
}

// Shared utility: check if user is typing in an input field
export function isTypingInInput(): boolean {
  const el = document.activeElement
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el?.getAttribute('contenteditable') === 'true'
  )
}
