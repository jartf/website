"use client"

import { useEffect, useRef, useState, memo } from "react"
import { useReducedMotion, useMounted } from "@/hooks"

/**
 * Individual twinkling star component using CSS animations
 */
const TwinkleStar = memo(function TwinkleStar({ id, left, top, size, styleId }) {
  return (
    <svg
      key={id}
      className="twinkle-star absolute"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${size}px`,
        height: `${size}px`,
        animation: `twinkle-star-${styleId} 2.5s ease-in-out forwards`,
      }}
      width="149"
      height="149"
      viewBox="0 0 149 149"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="74" cy="74" r="11" fill="white" />
      <rect
        y="141.421"
        width="200"
        height="10"
        transform="rotate(-45 0 141.421)"
        fill={`url(#paint0_linear_4_2_${id})`}
      />
      <rect
        x="7.07107"
        width="200"
        height="10"
        transform="rotate(45 7.07107 0)"
        fill={`url(#paint1_linear_4_2_${id})`}
      />
      <defs>
        <linearGradient
          id={`paint0_linear_4_2_${id}`}
          x1="0"
          y1="146.421"
          x2="200"
          y2="146.421"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1E1E1E" />
          <stop offset="0.445" stopColor="white" />
          <stop offset="0.58721" stopColor="white" />
          <stop offset="1" stopColor="#1E1E1E" />
        </linearGradient>
        <linearGradient
          id={`paint1_linear_4_2_${id}`}
          x1="7.07107"
          y1="5"
          x2="207.071"
          y2="5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1E1E1E" />
          <stop offset="0.42" stopColor="white" />
          <stop offset="0.555" stopColor="white" />
          <stop offset="1" stopColor="#1E1E1E" />
        </linearGradient>
      </defs>
    </svg>
  )
})

/**
 * TwinklingStars component - renders animated twinkling stars using CSS.
 * Visibility is controlled via CSS (parent #galaxy element),
 * so this component doesn't need to check theme state.
 */
export function TwinklingStars() {
  const [stars, setStars] = useState([])
  const mounted = useMounted()
  const nextIdRef = useRef(0)
  const prefersReducedMotion = useReducedMotion()
  const styleId = 'twinkle-animation'

  useEffect(() => {
    // Wait for mount to access window dimensions
    if (!mounted || prefersReducedMotion) return

    const generateStar = () => {
      const id = nextIdRef.current++
      const left = Math.floor(Math.random() * window.innerWidth)
      const top = Math.floor(Math.random() * (window.innerHeight / 3))
      const isMobile = window.innerWidth < 768
      const size = isMobile
        ? Math.floor(Math.random() * (15 - 7.5 + 1) + 7.5)
        : Math.floor(Math.random() * (30 - 15 + 1) + 15)

      setStars((prevStars) => [...prevStars, { id, left, top, size }])

      // Remove the star after animation completes
      setTimeout(() => {
        setStars((prevStars) => prevStars.filter((star) => star.id !== id))
      }, 2500)
    }

    const interval = setInterval(generateStar, 5000)
    return () => clearInterval(interval)
  }, [mounted, prefersReducedMotion])

  // Don't render anything if user prefers reduced motion
  if (prefersReducedMotion) {
    return <div className="fixed inset-0 pointer-events-none" />
  }

  return (
    <>
      <style>{`
        @keyframes twinkle-star-${styleId} {
          0% { opacity: 0; transform: scale(0); }
          20% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
          80% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0); }
        }
      `}</style>
      <div className="fixed inset-0 pointer-events-none">
        {stars.map((star) => (
          <TwinkleStar key={star.id} {...star} styleId={styleId} />
        ))}
      </div>
    </>
  )
}
