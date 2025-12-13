"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguageTracker } from "@/hooks"
import { Cat } from "lucide-react"

/** Easter egg when user visits all language versions */
export function EasterEgg() {
  const { allLanguagesVisited, resetLanguageTracker } = useLanguageTracker()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!allLanguagesVisited) return
    queueMicrotask(() => setShow(true))
    const timer = setTimeout(() => {
      setShow(false)
      resetLanguageTracker()
    }, 5000)
    return () => clearTimeout(timer)
  }, [allLanguagesVisited, resetLanguageTracker])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 1, ease: "easeOut" } }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <motion.div
              className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full whitespace-nowrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.5 } }}
            >
              unlocked: polyglot chaos!
            </motion.div>
            <div className="relative bg-primary rounded-full p-4 shadow-lg">
              <Cat className="h-12 w-12 text-primary-foreground" />
              <motion.div
                className="absolute -bottom-6 -right-4 w-10 h-16 bg-orange-500 rounded-br-full rounded-bl-full"
                animate={{ rotate: [0, 10, -10, 0], transition: { repeat: Infinity, duration: 0.5 } }}
                style={{ transformOrigin: "top center" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
