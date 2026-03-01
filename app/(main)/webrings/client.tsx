"use client"

import { useTranslation } from "react-i18next"
import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExternalLinkText } from "@/components/translated-text"
import type { WebringItem } from "@/content/webring-items"
import enTranslations from "@/translations/en.json"
import { useMounted } from "@/hooks"

interface WebringClientProps {
  webrings: WebringItem[]
}

export default function WebringClient({ webrings }: WebringClientProps) {
  const { t } = useTranslation()
  const mounted = useMounted()

  // Static content for no-JS users
  if (!mounted) {
    const staticT = enTranslations.webrings
    return (
      <>
        <h1 className="text-3xl font-bold mb-4">{staticT.title}</h1>

        <div className="mb-8 space-y-4">
          <p className="text-muted-foreground">
            {staticT.intro1}
          </p>

          <p className="text-muted-foreground">
            {staticT.intro2}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {webrings.map((webring) => (
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
                  aria-label={staticT.previousAria.replace('{{name}}', webring.name)}
                >
                  <a href={webring.previous} target="_blank" rel="noopener">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    {staticT.previous}
                  </a>
                </Button>

                {webring.random ? (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1"
                    aria-label={staticT.randomAria.replace('{{name}}', webring.name)}
                  >
                    <a href={webring.random} target="_blank" rel="noopener">
                      <Shuffle className="h-4 w-4 mr-1" />
                      {staticT.random}
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
                  aria-label={staticT.nextAria.replace('{{name}}', webring.name)}
                >
                  <a href={webring.next} target="_blank" rel="noopener">
                    {staticT.next}
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </>
    )
  }

  // Client-side rendered content with i18n
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{t('webrings.title')}</h1>

      <div className="mb-8 space-y-4">
        <p className="text-muted-foreground">
          {t('webrings.intro1')}
        </p>

        <p className="text-muted-foreground">
          {t('webrings.intro2')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {webrings.map((webring) => (
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
                aria-label={t('webrings.previousAria', { name: webring.name })}
              >
                <a href={webring.previous} target="_blank" rel="noopener">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {t('webrings.previous')}
                </a>
              </Button>

              {webring.random ? (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex-1"
                  aria-label={t('webrings.randomAria', { name: webring.name })}
                >
                  <a href={webring.random} target="_blank" rel="noopener">
                    <Shuffle className="h-4 w-4 mr-1" />
                    {t('webrings.random')}
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
                aria-label={t('webrings.nextAria', { name: webring.name })}
              >
                <a href={webring.next} target="_blank" rel="noopener">
                  {t('webrings.next')}
                  <ArrowRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
