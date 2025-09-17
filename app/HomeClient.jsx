"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useTheme } from "next-themes"
import Link from "next/link"
import { MoodCat } from "@/components/mood-cat"
import { EasterEgg } from "@/components/easter-egg"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useMounted } from "@/hooks/use-mounted"
// Import the useReducedMotion hook
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { useTranslationReady } from "@/hooks/use-translation-ready"

/**
 * Home page client component
 * @returns {JSX.Element} The home page component
 */
export default function Home() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [greeting, setGreeting] = useState("")
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()
  const isTranslationReady = useTranslationReady()

  useEffect(() => {
    if (mounted) {
      const hour = new Date().getHours()

      if (hour >= 5 && hour < 12) {
        setGreeting(t("greetings.morning"))
      } else if (hour >= 12 && hour < 18) {
        setGreeting(t("greetings.afternoon"))
      } else if (hour >= 18 && hour < 22) {
        setGreeting(t("greetings.evening"))
      } else {
        setGreeting(t("greetings.night"))
      }
    }
  }, [t, mounted])

  if (!isTranslationReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!mounted) return null

  // Define animation properties based on motion preference
  const animationProps = prefersReducedMotion ? { initial: {}, animate: {}, transition: {} } : {}

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section with Curved Shape */}
          <div className="relative pt-16 pb-24 mb-12">
            {/* Curved shape for light mode */}
            {theme === "light" && (
              <div className="absolute top-0 left-0 right-0 h-64 -z-10 overflow-hidden">
                <div className="w-full h-[500px] bg-gray-100 rounded-[100%] transform translate-y-[-70%]"></div>
              </div>
            )}

            <div className="text-center">
              <motion.p
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.5 }}
                className="text-lg md:text-xl text-muted-foreground mb-4"
              >
                {greeting}
              </motion.p>

              <motion.h1
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
              >
                {t("home.heading")}
              </motion.h1>

              <motion.p
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground mb-8"
              >
                {t("home.subheading")}
              </motion.p>

              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? {} : { duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/contact">
                  <Button variant="default" size="lg" className="w-full sm:w-auto">
                    {t("home.contactButton")}
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t("home.aboutButton")}
                  </Button>
                </Link>
                <Link href="/blog">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    {t("home.blogButton")}
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          <div className="mt-16">
            <MoodCat />
          </div>
        </div>
      </div>

      <EasterEgg />
    </main>
  )
}
