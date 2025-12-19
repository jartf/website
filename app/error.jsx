"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Home, RefreshCw, Bug } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoodCat } from "@/components/mood-cat"
import { PageAnimation, AnimatedSection } from "@/components/page-animation"
import { TranslatedText } from "@/components/translated-text"

/**
 * Error boundary component for handling runtime errors
 * This file is automatically used by Next.js App Router for error handling
 * @param {Object} props - Component props
 * @param {Error} props.error - The error that was thrown
 * @param {Function} props.reset - Function to reset the error boundary and retry
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service in production
    if (process.env.NODE_ENV === "development") {
      console.error("Error boundary caught an error:", error)
    }
  }, [error])

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <PageAnimation fireflyCount={25}>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-md mx-auto text-center">
            {/* Animated error icon */}
            <AnimatedSection>
              <div className="mb-8 flex justify-center">
                <div className="bg-destructive/10 rounded-full p-6 animate-pulse">
                  <AlertTriangle className="h-16 w-16 text-destructive" />
                </div>
              </div>
            </AnimatedSection>

            {/* Main content */}
            <AnimatedSection delay={0.3}>
              <h1 className="text-4xl font-bold mb-4">
                <TranslatedText i18nKey="error.title" fallback="Something went wrong" />
              </h1>

              <p className="text-muted-foreground mb-8">
                <TranslatedText
                  i18nKey="error.description"
                  fallback="We encountered an unexpected error. Please try again or go back home."
                />
              </p>

              {/* Error details in development */}
              {process.env.NODE_ENV === "development" && error && (
                <details className="mb-6 text-left max-w-full">
                  <summary className="cursor-pointer text-sm font-medium mb-2 flex items-center gap-2">
                    <Bug className="h-4 w-4" />
                    <TranslatedText i18nKey="error.details" fallback="Error details (development only)" />
                  </summary>
                  <pre className="text-xs bg-muted p-4 rounded overflow-auto max-h-60 text-left">
                    {error.message}
                    {"\n\n"}
                    {error.stack}
                  </pre>
                </details>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => reset()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <TranslatedText i18nKey="error.retry" fallback="Try again" />
                </Button>
                <Link href="/">
                  <Button variant="outline">
                    <Home className="mr-2 h-4 w-4" />
                    <TranslatedText i18nKey="error.home" fallback="Go Home" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* MoodCat section */}
            <AnimatedSection delay={0.6}>
              <div className="mt-16">
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold mb-4">
                    <TranslatedText i18nKey="error.catMessage" fallback="Here's a cat to cheer you up" />
                  </h2>
                  <MoodCat />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </PageAnimation>
    </main>
  )
}
