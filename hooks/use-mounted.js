"use client"

import { useState, useEffect } from "react"

export function useMounted() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    queueMicrotask(() => setMounted(true))
  }, [])
  return mounted
}
