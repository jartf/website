"use client"

import { createContext, useContext, useMemo } from "react"
import { useReducedMotion } from "@/hooks"

const MotionContext = createContext({ prefersReducedMotion: false })

/**
 * Provider component for motion preferences
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Motion provider component
 */
export function MotionProvider({ children }) {
  const prefersReducedMotion = useReducedMotion()

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({ prefersReducedMotion }), [prefersReducedMotion])

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
}

/**
 * Hook to access motion context values
 * @returns {Object} Motion context with prefersReducedMotion flag
 */
export function useMotionContext() {
  return useContext(MotionContext)
}
