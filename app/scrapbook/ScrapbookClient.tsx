"use client"

import { motion } from "framer-motion"
import { DarkModeFirefly } from "@/components/dark-mode-firefly"
import { Calendar, Code, FileText } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"

type DevlogEntry = {
  date: string
  content: string
  slug: string
}

interface ScrapbookClientProps {
  entries: DevlogEntry[]
}

/**
 * The client-side component for the scrapbook/devlog page.
 * This component displays a timeline of development log entries.
 * @param {ScrapbookClientProps} props - The component props.
 * @returns {JSX.Element | null} The rendered scrapbook page client component.
 */
export default function ScrapbookClient({ entries }: ScrapbookClientProps) {
  const mounted = useMounted()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Static content for no-JS users
  if (!mounted) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Devlog</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                this site wasn&apos;t born clean. this is the messy, nerdy, behind-the-scenes corner.
              </p>
            </div>

            <div className="space-y-12">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">
                  i didn&apos;t build this site in one sitting. i built it in bursts of insomnia, between breakdowns, during
                  those 3am windows where everything hurts a bit less and i can pretend i&apos;m just another guy writing some
                  Tailwind and trying to make sense of things.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  i could&apos;ve made it pretty and minimal and cold. but i wanted this place to feel like me. which means it
                  had to be a little messy, a little too honest, and occasionally weird as hell.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Entries</h2>
                </div>

                <div className="relative space-y-8 md:space-y-12 md:ml-12">
                  {entries.map((entry) => (
                    <div key={entry.slug} className="relative">
                      {/* Mobile layout */}
                      <div className="flex items-start gap-4 md:hidden">
                        <div className="flex-shrink-0 bg-primary text-primary-foreground p-2 rounded-full">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-medium mb-2 font-mono">{entry.date}</h3>
                          <p className="text-muted-foreground">{entry.content}</p>
                        </div>
                      </div>

                      {/* Desktop layout without timeline */}
                      <div className="hidden md:block">
                        <div className="absolute -left-[42px] bg-background p-1.5 rounded-full">
                          <div className="bg-primary text-primary-foreground p-2 rounded-full flex items-center justify-center">
                            <Calendar className="h-5 w-5" />
                          </div>
                        </div>

                        <div className="pl-8">
                          <h3 className="text-xl font-medium mb-2 font-mono">{entry.date}</h3>
                          <p className="text-muted-foreground">{entry.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-16">
                <div className="inline-flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-full px-4 py-2">
                  <Code className="h-4 w-4" />
                  <span>Last updated: {entries[0]?.date || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <DarkModeFirefly count={15} />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Devlog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              this site wasn&apos;t born clean. this is the messy, nerdy, behind-the-scenes corner.
            </p>
          </div>

          <motion.div className="space-y-12" variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="prose dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">
                i didn&apos;t build this site in one sitting. i built it in bursts of insomnia, between breakdowns, during
                those 3am windows where everything hurts a bit less and i can pretend i&apos;m just another guy writing some
                Tailwind and trying to make sense of things.
              </p>
              <p className="text-lg leading-relaxed mt-4">
                i could&apos;ve made it pretty and minimal and cold. but i wanted this place to feel like me. which means it
                had to be a little messy, a little too honest, and occasionally weird as hell.
              </p>
            </motion.div>

            <motion.div variants={item}>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileText className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">Entries</h2>
              </div>

              <div className="relative space-y-8 md:space-y-12 md:ml-12">
                {entries.map((entry, index) => (
                  <motion.div
                    key={entry.slug}
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Mobile layout */}
                    <div className="flex items-start gap-4 md:hidden">
                      <div className="flex-shrink-0 bg-primary text-primary-foreground p-2 rounded-full">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium mb-2 font-mono">{entry.date}</h3>
                        <p className="text-muted-foreground">{entry.content}</p>
                      </div>
                    </div>

                    {/* Desktop layout without timeline */}
                    <div className="hidden md:block">
                      <div className="absolute -left-[42px] bg-background p-1.5 rounded-full">
                        <div className="bg-primary text-primary-foreground p-2 rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="pl-8">
                        <h3 className="text-xl font-medium mb-2 font-mono">{entry.date}</h3>
                        <p className="text-muted-foreground">{entry.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item} className="flex justify-center mt-16">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-full px-4 py-2">
                <Code className="h-4 w-4" />
                <span>Last updated: {entries[0]?.date || "N/A"}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
