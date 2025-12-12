"use client"

import { Firefly } from "@/components/firefly"

/**
 * Component that renders fireflies only in dark mode.
 * Uses CSS-first approach: visibility is controlled via CSS classes (.dark)
 * and prefers-color-scheme media queries in galaxy.css (.firefly-container rules).
 *
 * This ensures the correct theme rendering even before JS hydrates.
 *
 * @param {Object} props - Component props
 * @param {number} [props.count=15] - Number of fireflies to render
 * @returns {JSX.Element} Firefly component wrapped in theme-aware container
 */
export function DarkModeFirefly({ count = 15 }) {
  // Render always - CSS controls visibility based on theme
  // The .firefly-container class has CSS rules that hide in light mode
  return (
    <div className="firefly-container">
      <Firefly count={count} />
    </div>
  )
}
