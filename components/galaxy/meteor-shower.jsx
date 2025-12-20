"use client"

import { useEffect, useRef, useState, useId, memo } from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion, useMounted } from "@/hooks"

/**
 * Individual meteor component using CSS animations
 */
const Meteor = memo(function Meteor({ id, left, top, direction, styleId }) {
  const directionClasses = {
    ur: "rotate-45",
    dr: "rotate-[135deg]",
    dl: "-rotate-45",
    ul: "rotate-[225deg]",
  }

  return (
    <div
      key={id}
      style={{
        position: "absolute",
        left: `${left}px`,
        top: `${top}px`,
        animation: `meteor-fade-${styleId} 3.5s ease-out forwards`,
      }}
      className={cn("meteor", directionClasses[direction])}
    >
      <div className="meteor-body"></div>
    </div>
  )
})

/**
 * MeteorShower component - renders animated meteors using CSS.
 * Visibility is controlled via CSS (parent #galaxy element),
 * so this component doesn't need to check theme state.
 */
export function MeteorShower() {
  const [meteors, setMeteors] = useState([])
  const mounted = useMounted()
  const nextIdRef = useRef(0)
  const prefersReducedMotion = useReducedMotion()
  const baseId = useId()
  const styleId = baseId.replace(/:/g, '')

  useEffect(() => {
    // Wait for mount to access window dimensions
    if (!mounted || prefersReducedMotion) return

    const directions = ["ur", "dr", "dl", "ul"]

    const generateMeteor = () => {
      const id = nextIdRef.current++
      const left = Math.round(Math.random() * window.innerWidth)
      const top = Math.round(Math.random() * window.innerHeight)
      const direction = directions[Math.floor(Math.random() * directions.length)]

      setMeteors((prevMeteors) => [...prevMeteors, { id, left, top, direction }])

      // Remove the meteor after animation completes
      setTimeout(() => {
        setMeteors((prevMeteors) => prevMeteors.filter((meteor) => meteor.id !== id))
      }, 3500)
    }

    const interval = setInterval(generateMeteor, 4000)
    return () => clearInterval(interval)
  }, [mounted, prefersReducedMotion])

  // Don't render anything if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className="fixed inset-0 pointer-events-none" />
  }

  return (
    <>
      <style>{`
        @keyframes meteor-fade-${styleId} {
          0% { opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none">
        {meteors.map((meteor) => (
          <Meteor key={meteor.id} {...meteor} styleId={styleId} />
        ))}
      </div>
    </>
  )
}
