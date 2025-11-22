"use client"

import { createContext, useContext } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

const MotionContext = createContext({ prefersReducedMotion: false })

/**
 * Provider component for motion preferences
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Motion provider component
 */
export function MotionProvider({ children }) {
  const prefersReducedMotion = useReducedMotion()
  return <MotionContext.Provider value={{ prefersReducedMotion }}>{children}</MotionContext.Provider>
}

/**
 * Hook to access motion context values
 * @returns {Object} Motion context with prefersReducedMotion flag
 */
export function useMotionContext() {
  return useContext(MotionContext)
}
