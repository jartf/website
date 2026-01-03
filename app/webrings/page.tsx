import { generateMetadata as generateMeta } from "@/lib/metadata"
import { WEBRING_ITEMS } from "@/content/webring-items"
import { ArrowLeft, ArrowRight, Shuffle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata = generateMeta({
  title: "Webrings",
  description: "Webrings I'm part of. Discover more independent websites and personal blogs.",
  path: "webring",
})

export default function WebringPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-4">Webrings</h1>

      <div className="mb-8 space-y-4">
        <p className="text-muted-foreground">
          A webring is a collection of websites made by like-minded folks, usually centered around a topic, aesthetic, or common interest. (from the <a href="https://xandra.cc/safonts/" target="_blank" rel="noopener noreferrer">safonts webring</a>)
        </p>

        <p className="text-muted-foreground">
          This website is part of these webrings. Click on the links to visit my neighbors&apos; sites, and other members&apos;, if that webring has random functionality. Choose any ring you like!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WEBRING_ITEMS.map((webring) => (
          <div
            key={webring.url}
            className="border rounded-lg p-6 bg-card hover:shadow-lg transition-all flex flex-col"
          >
            <div className="mb-4">
              <a
                href={webring.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl font-bold text-primary hover:underline inline-flex items-center gap-2"
              >
                {webring.name}
                <ExternalLink className="h-4 w-4" />
              </a>
              {webring.description && (
                <p className="text-sm text-muted-foreground mt-2">
                  {webring.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 mt-auto">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1"
                aria-label={`Previous site in ${webring.name}`}
              >
                <a href={webring.previous} target="_blank" rel="noopener">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </a>
              </Button>

              {webring.random ? (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1"
                  aria-label={`Random site in ${webring.name}`}
                >
                  <a href={webring.random} target="_blank" rel="noopener">
                    <Shuffle className="h-4 w-4 mr-1" />
                    Random
                  </a>
                </Button>
              ) : (
                <div className="flex-1" />
              )}

              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1"
                aria-label={`Next site in ${webring.name}`}
              >
                <a href={webring.next} target="_blank" rel="noopener">
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
