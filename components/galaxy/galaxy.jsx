"use client"

import { useTheme } from "next-themes"
import { TwinklingStars } from "./twinkling-stars"
import { MeteorShower } from "./meteor-shower"
import { useMounted } from "@/hooks/use-mounted"

export function Galaxy() {
  const { resolvedTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <>
      {/* Light Mode: Particles */}
      {!isDark && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="fixed inset-0 particles-1"></div>
          <div className="fixed inset-0 particles-2"></div>
          <div className="fixed inset-0 particles-3"></div>
        </div>
      )}

      {/* Dark Theme: Stars */}
      {isDark && (
        <div className="absolute inset-0 bg-black/0 pointer-events-none">
          <div className="fixed inset-0 stars-1"></div>
          <div className="fixed inset-0 stars-2"></div>
          <div className="fixed inset-0 stars-3"></div>
        </div>
      )}

      {/* Dark Theme: Twinkling Stars / Meteors */}
      {isDark && (
        <div id="galaxy" className="fixed inset-0 pointer-events-none">
          <TwinklingStars />
          <MeteorShower />
        </div>
      )}
    </>
  )
}
