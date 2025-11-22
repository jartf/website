"use client"

import { useState, useEffect } from "react"

/**
 * A hook that returns `true` once the component has mounted.
 * This is useful for avoiding hydration errors with server-side rendering.
 * @returns {boolean} `true` if the component has mounted, otherwise `false`.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return mounted
}
