import { ArrowLeft, ArrowRight, Shuffle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { WebringItem } from '@/content/webring-items'

type WebringGridProps = {
  webrings: WebringItem[]
}

/**
 * Server component for rendering webring grid
 * No client-side interactivity needed - all links are regular anchor tags
 */
export default function WebringGrid({ webrings }: WebringGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {webrings.map((webring) => (
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
  )
}
