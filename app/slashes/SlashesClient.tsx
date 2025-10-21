"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Firefly } from "@/components/firefly"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slash, Home, User, Code, BookOpen, Clock, Mail, FileText, Wrench, Calendar } from "lucide-react"

type PageRoute = {
  path: string
  name: string
  description: string
  icon: React.ReactNode
}

/**
 * The client-side component for the slashes page.
 * This component displays a directory of all accessible pages on the site.
 * @returns {JSX.Element | null} The rendered slashes page client component.
 */
export default function SlashesPageClient() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const routes: PageRoute[] = [
    {
      path: "/",
      name: "Home",
      description: "The main landing page of the website",
      icon: <Home className="h-5 w-5" />,
    },
    {
      path: "/about",
      name: "About",
      description: "Learn more about me and my background",
      icon: <User className="h-5 w-5" />,
    },
    {
      path: "/projects",
      name: "Projects",
      description: "Explore my personal, academic, and activism projects",
      icon: <Code className="h-5 w-5" />,
    },
    {
      path: "/blog",
      name: "Blog",
      description: "Read my thoughts, reflections, and occasional rants",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      path: "/now",
      name: "Now",
      description: "See what I'm currently doing, thinking about, and focusing on",
      icon: <Clock className="h-5 w-5" />,
    },
    {
      path: "/uses",
      name: "Uses",
      description: "Discover the tools, gadgets, and software I use daily",
      icon: <Wrench className="h-5 w-5" />,
    },
    {
      path: "/scrapbook",
      name: "Scrapbook",
      description: "Behind-the-scenes devlog of building this site",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      path: "/contact",
      name: "Contact",
      description: "Find ways to reach out and connect with me",
      icon: <Mail className="h-5 w-5" />,
    },
    {
      path: "/colophon",
      name: "Colophon",
      description: "The story behind this website and how it was built",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      path: "/tetris",
      name: "Shhhh...",
      description: "What could this page be?",
      icon: <Slash className="h-5 w-5" />,
    },
    {
      path: "/2048",
      name: "The Forbidden Math",
      description: "A mysterious game where numbers double but sanity halves",
      icon: <Slash className="h-5 w-5" />,
    },
    {
      path: "/404",
      name: "404 - Not Found",
      description: "The page that appears when you try to access a non-existent page",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      path: "/slashes",
      name: "Slashes",
      description: "This page - a directory of all accessible pages on the site",
      icon: <Slash className="h-5 w-5" />,
    },
    {
      path: "/badges",
      name: "Badges",
      description: "A collection of classic web badges and buttons used on my website",
      icon: <FileText className="h-5 w-5" />,
    },
  ]

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

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {theme === "dark" && <Firefly count={15} />}

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Site Directory</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete list of all accessible pages on this website
            </p>
          </div>

          <motion.div className="grid gap-6 md:grid-cols-2" variants={container} initial="hidden" animate="show">
            {routes.map((route) => (
              <motion.div key={route.path} variants={item}>
                <Link href={route.path} className="block group">
                  <Card className="transition-all duration-300 group-hover:shadow-md h-full">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <div className="bg-primary/10 p-2 rounded-full">{route.icon}</div>
                      <CardTitle className="group-hover:text-primary transition-colors">{route.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Slash className="h-4 w-4" />
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{route.path}</code>
                      </div>
                      <p className="text-muted-foreground">{route.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </main>
  )
}
