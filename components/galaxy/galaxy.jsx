"use client"

import { TwinklingStars } from "./twinkling-stars"
import { MeteorShower } from "./meteor-shower"

/**
 * Galaxy component that renders theme-specific background effects.
 * Uses CSS-first approach: visibility is controlled via CSS classes (.dark)
 * and prefers-color-scheme media queries, not JavaScript conditional rendering.
 *
 * This ensures the correct theme is shown even before JS hydrates,
 * preventing flash of wrong theme.
 */
export function Galaxy() {
  return (
    <>
      {/* Light Mode: Particles - CSS controls visibility via .particles-* rules */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="fixed inset-0 particles-1"></div>
        <div className="fixed inset-0 particles-2"></div>
        <div className="fixed inset-0 particles-3"></div>
      </div>

      {/* Dark Theme: Stars - CSS controls visibility via .stars-* rules */}
      <div className="absolute inset-0 bg-black/0 pointer-events-none">
        <div className="fixed inset-0 stars-1"></div>
        <div className="fixed inset-0 stars-2"></div>
        <div className="fixed inset-0 stars-3"></div>
      </div>

      {/* Dark Theme: Twinkling Stars / Meteors - CSS controls visibility via #galaxy rules */}
      <div id="galaxy" className="fixed inset-0 pointer-events-none">
        <TwinklingStars />
        <MeteorShower />
      </div>
    </>
  )
}
