"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Firefly } from "@/components/firefly"
import { MoodCat } from "@/components/mood-cat"
import { Button } from "@/components/ui/button"
import { Cat, Home, Map, Compass } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"

/**
 * Client component for the 404 Not Found page with animations and interactive elements
 */
export default function NotFoundClient() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const mounted = useMounted()
  const [randomPosition] = useState(() => ({
    // Generate random position for the lost cat
    x: Math.random() * 40 - 20,
    y: Math.random() * 40 - 20,
  }))

  if (!mounted) return null

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {theme === "dark" && <Firefly count={25} />}

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-md mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="mb-8 flex justify-center">
              <motion.div
                className="relative"
                animate={{
                  x: [randomPosition.x, -randomPosition.x, randomPosition.x],
                  y: [randomPosition.y, -randomPosition.y, randomPosition.y],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <div className="bg-primary rounded-full p-6 relative">
                  <Cat className="h-16 w-16 text-primary-foreground" />
                  <motion.div
                    className="absolute top-0 right-0 w-full h-full rounded-full border-2 border-primary/30"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                </div>
                <motion.div
                  className="absolute -top-4 -right-4 bg-muted-foreground text-background text-xs px-2 py-1 rounded-full"
                  initial={{ rotate: -5 }}
                  animate={{ rotate: 5 }}
                  transition={{
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "reverse",
                    duration: 1,
                  }}
                >
                  ?!?
                </motion.div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
              <h1 className="text-4xl font-bold mb-4">{t("404.title")}</h1>

              <p className="text-muted-foreground mb-8">{t("404.description")}</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button>
                    <Home className="mr-2 h-4 w-4" />
                    {t("404.button")}
                  </Button>
                </Link>
                <Link href="/slashes">
                  <Button variant="outline">
                    <Map className="mr-2 h-4 w-4" />
                    {t("404.sitemap")}
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="mt-12 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="relative">
                <Compass className="h-12 w-12 text-muted-foreground/50" />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <div className="w-1 h-6 bg-gradient-to-b from-primary to-transparent rounded-full transform translate-y-[-4px]" />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-4">{t("404.enjoycat")}</h2>
                <MoodCat />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
