"use client"

import { usePlatform } from "@/hooks"

/** Displays a keyboard shortcut - hidden on mobile by default */
export function KeyboardShortcut({ children, className = "", hideOnMobile = true }) {
  const { isMobile } = usePlatform()
  if (hideOnMobile && isMobile) return null
  return <kbd className={`px-1.5 py-0.5 text-xs bg-muted rounded border border-border ${className}`}>{children}</kbd>
}
