// KeyboardShortcut - Displays a keyboard shortcut badge
// Ported from Next.js v4

import { useState, useEffect } from 'react'

interface KeyboardShortcutProps {
  children: React.ReactNode
  className?: string
  hideOnMobile?: boolean
}

export function KeyboardShortcut({ children, className = '', hideOnMobile = true }: KeyboardShortcutProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (hideOnMobile && isMobile) return null

  return (
    <kbd className={`px-1.5 py-0.5 text-xs bg-muted rounded border border-border font-mono ${className}`}>
      {children}
    </kbd>
  )
}
