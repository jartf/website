"use client"

import { useEffect, useState } from "react"
import { debounce } from "@/lib/utils"

export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const updateValue = debounce(() => setDebouncedValue(value), delay)
    updateValue()
  }, [value, delay])

  return debouncedValue
}
