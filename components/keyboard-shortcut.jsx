"use client"

import { usePlatform } from "@/hooks"

/**
 * Component to display a keyboard shortcut
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The shortcut text
 * @param {string} [props.className=""] - Additional CSS classes
 * @param {boolean} [props.hideOnMobile=true] - Whether to hide on mobile devices
 * @returns {JSX.Element|null} Keyboard shortcut component or null if hidden
 */
export function KeyboardShortcut({ children, className = "", hideOnMobile = true }) {
  const { isMobile } = usePlatform()

  if (hideOnMobile && isMobile) {
    return null
  }

  return <kbd className={`px-1.5 py-0.5 text-xs bg-muted rounded border border-border ${className}`}>{children}</kbd>
}
