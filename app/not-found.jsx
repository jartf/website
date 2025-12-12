import { generateMetadata } from "@/lib/metadata"
import Link from "next/link"
import { Cat, Home, Map, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoodCat } from "@/components/mood-cat"
import {
  NotFoundAnimation,
  AnimatedCatIcon,
  AnimatedCompass,
  AnimatedSection,
} from "./not-found/NotFoundAnimation"
import {
  NotFoundTitle,
  NotFoundDescription,
  NotFoundButtonText,
  NotFoundSitemapText,
  NotFoundEnjoycatText,
} from "./not-found/NotFoundTranslations"

export const metadata = generateMetadata({
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist or has been moved.",
  path: "404",
})

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <NotFoundAnimation>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-md mx-auto text-center">
            {/* Animated cat icon */}
            <AnimatedSection>
              <div className="mb-8 flex justify-center">
                <AnimatedCatIcon>
                  <div className="bg-primary rounded-full p-6">
                    <Cat className="h-16 w-16 text-primary-foreground" />
                  </div>
                </AnimatedCatIcon>
              </div>
            </AnimatedSection>

            {/* Main content */}
            <AnimatedSection delay={0.3}>
              <h1 className="text-4xl font-bold mb-4">
                <NotFoundTitle fallback="Page Not Found" />
              </h1>

              <p className="text-muted-foreground mb-8">
                <NotFoundDescription fallback="The page you're looking for doesn't exist or has been moved." />
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/">
                  <Button>
                    <Home className="mr-2 h-4 w-4" />
                    <NotFoundButtonText fallback="Go Home" />
                  </Button>
                </Link>
                <Link href="/slashes">
                  <Button variant="outline">
                    <Map className="mr-2 h-4 w-4" />
                    <NotFoundSitemapText fallback="Site Directory" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>

            {/* Animated compass */}
            <AnimatedSection delay={0.6}>
              <div className="mt-12 flex justify-center">
                <AnimatedCompass>
                  <Compass className="h-12 w-12 text-muted-foreground/50" />
                </AnimatedCompass>
              </div>
            </AnimatedSection>

            {/* MoodCat section */}
            <AnimatedSection delay={0.9}>
              <div className="mt-16">
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold mb-4">
                    <NotFoundEnjoycatText fallback="Here's a cat to cheer you up" />
                  </h2>
                  <MoodCat />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </NotFoundAnimation>
    </main>
  )
}
