"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useMounted } from "@/hooks/use-mounted"

/**
 * @typedef {Object} MeteorProps
 * @property {number} id - Unique identifier for the meteor
 * @property {number} left - Left position in pixels
 * @property {number} top - Top position in pixels
 * @property {'ur'|'dr'|'dl'|'ul'} direction - Direction of the meteor (up-right, down-right, down-left, up-left)
 */

const Meteor = ({ id, left, top, direction }) => {
  const directionClasses = {
    ur: "rotate-45",
    dr: "rotate-[135deg]",
    dl: "-rotate-45",
    ul: "rotate-[225deg]",
  }

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 3.5, ease: "easeOut" }}
      style={{ position: "absolute", left: `${left}px`, top: `${top}px` }}
      className={cn("meteor", directionClasses[direction])}
    >
      <div className="meteor-body"></div>
    </motion.div>
  )
}

export function MeteorShower() {
  const { resolvedTheme } = useTheme()
  const [meteors, setMeteors] = useState([])
  const mounted = useMounted()
  const nextIdRef = useRef(0)
  const directions = ["ur", "dr", "dl", "ul"]
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (!mounted || resolvedTheme !== "dark") return

    const generateMeteor = () => {
      // Skip meteor generation if user prefers reduced motion
      if (prefersReducedMotion) return

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

    // Don't set interval if user prefers reduced motion
    if (prefersReducedMotion) return

    const interval = setInterval(generateMeteor, 1500)
    return () => clearInterval(interval)
  }, [mounted, resolvedTheme, prefersReducedMotion])

  if (!mounted || resolvedTheme !== "dark") return null

  return (
    <div className="fixed inset-0 pointer-events-none">
      <AnimatePresence>
        {meteors.map((meteor) => (
          <Meteor key={meteor.id} {...meteor} />
        ))}
      </AnimatePresence>
    </div>
  )
}
