import { generateMetadata as generateMeta } from "@/lib/metadata"
import { WEBRING_ITEMS } from "@/content/webring-items"
import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExternalLinkText } from "@/components/translated-text"
import enTranslations from "@/translations/en.json"

export const metadata = generateMeta({
  title: "Webrings",
  description: "Webrings I'm part of. Discover more independent websites and personal blogs.",
  path: "webring",
})

const t = enTranslations.webrings

export default function WebringPage() {
  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-4">{t.title}</h1>

      <div className="mb-8 space-y-4">
        <p className="text-muted-foreground">
          {t.intro1}
        </p>

        <p className="text-muted-foreground">
          {t.intro2}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WEBRING_ITEMS.map((webring) => (
          <div
            key={webring.url}
            className="border rounded-lg p-6 bg-card hover:shadow-lg transition-all flex flex-col"
          >
            <div className="mb-4">
              <ExternalLinkText
                href={webring.url}
                className="text-xl font-bold text-primary hover:underline inline-flex items-center gap-2"
                iconClassName="h-4 w-4"
              >
                {webring.name}
              </ExternalLinkText>
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
                aria-label={t.previousAria.replace('{{name}}', webring.name)}
              >
                <a href={webring.previous} target="_blank" rel="noopener">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {t.previous}
                </a>
              </Button>

              {webring.random ? (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1"
                  aria-label={t.randomAria.replace('{{name}}', webring.name)}
                >
                  <a href={webring.random} target="_blank" rel="noopener">
                    <Shuffle className="h-4 w-4 mr-1" />
                    {t.random}
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
                aria-label={t.nextAria.replace('{{name}}', webring.name)}
              >
                <a href={webring.next} target="_blank" rel="noopener">
                  {t.next}
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
