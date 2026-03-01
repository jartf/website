import { generateMetadata as generateMeta } from "@/lib/metadata"
import { Code, Server, Palette } from "lucide-react"
import { PageAnimation } from "@/components/page-animation"
import { TranslatedText, TranslatedPageHeader, ExternalLinkText } from "@/components/translated-text"
import enTranslations from "@/translations/en.json"

export const metadata = generateMeta({
  title: "Colophon",
  description: "The story behind this website and how it was built.",
  path: "colophon",
})

const t = enTranslations.colophon

// Technology stack data - server defined with translations
const technologyStack = [
  { name: "Next.js", key: "nextjs", url: "https://nextjs.org/" },
  { name: "React", key: "react", url: "https://reactjs.org/" },
  { name: "Tailwind CSS", key: "tailwind", url: "https://tailwindcss.com/" },
  { name: "shadcn/ui", key: "shadcn", url: "https://ui.shadcn.com/" },
  { name: "Framer Motion", key: "framer", url: "https://www.framer.com/motion/" },
  { name: "react-i18next", key: "i18next", url: "https://react.i18next.com/" },
  { name: "TypeScript", key: "typescript", url: "https://www.typescriptlang.org/" },
]

export default function ColophonPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <PageAnimation sectionNavigation={{ count: 4 }}>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto">
            {/* Page header */}
            <TranslatedPageHeader
              titleKey="colophon.title"
              descriptionKey="colophon.description"
              staticTitle={t.title}
              staticDescription={t.description}
            />

            <div className="space-y-12">
              {/* Site History */}
              <section
                id="section-1"
                className="prose text-foreground dark:prose-invert max-w-none transition-all duration-300"
              >
                <h2 className="flex text-foreground items-center gap-2 text-2xl font-bold mb-4">
                  <Palette className="h-6 w-6 text-primary" />
                  <TranslatedText i18nKey="colophon.siteHistory.title" fallback={t.siteHistory.title} />
                </h2>
                <p>
                  <TranslatedText
                    i18nKey="colophon.siteHistory.content1"
                    fallback={t.siteHistory.content1}
                  />
                </p>
                <p>
                  <TranslatedText
                    i18nKey="colophon.siteHistory.content2"
                    fallback={t.siteHistory.content2}
                  />
                </p>
              </section>

              {/* Technology stack */}
              <section
                id="section-2"
                className="prose text-foreground dark:prose-invert max-w-none transition-all duration-300"
              >
                <h2 className="flex text-foreground items-center gap-2 text-2xl font-bold mb-4">
                  <Code className="h-6 w-6 text-primary" />
                  <TranslatedText i18nKey="colophon.technologyStack.title" fallback={t.technologyStack.title} />
                </h2>
                <ul className="space-y-2 list-disc pl-5">
                  {technologyStack.map((tech) => (
                    <li key={tech.name}>
                      <ExternalLinkText href={tech.url}>
                        {tech.name}
                      </ExternalLinkText>{" "}
                      - <TranslatedText
                        i18nKey={`colophon.technologyStack.${tech.key}`}
                        fallback={t.technologyStack[tech.key as keyof typeof t.technologyStack]}
                      />
                    </li>
                  ))}
                </ul>
              </section>

              {/* Hosting */}
              <section
                id="section-3"
                className="prose text-foreground dark:prose-invert max-w-none transition-all duration-300"
              >
                <h2 className="flex text-foreground items-center gap-2 text-2xl font-bold mb-4">
                  <Server className="h-6 w-6 text-primary" />
                  <TranslatedText i18nKey="colophon.hosting.title" fallback={t.hosting.title} />
                </h2>
                <p>
                  <TranslatedText i18nKey="colophon.hosting.content1" fallback={t.hosting.content1} />{" "}
                  <ExternalLinkText href="https://vercel.com/">Vercel</ExternalLinkText>
                  , <TranslatedText i18nKey="colophon.hosting.content2" fallback={t.hosting.content2} />
                </p>
                <p>
                  <TranslatedText i18nKey="colophon.hosting.content3" fallback={t.hosting.content3} />{" "}
                  <ExternalLinkText href="https://www.cloudflare.com/">Cloudflare</ExternalLinkText>
                  , <TranslatedText i18nKey="colophon.hosting.content4" fallback={t.hosting.content4} />
                </p>
              </section>

              {/* Inspiration */}
              <section
                id="section-4"
                className="prose text-foreground dark:prose-invert max-w-none transition-all duration-300"
              >
                <h2 className="flex text-foreground items-center gap-2 text-2xl font-bold mb-4">
                  <TranslatedText i18nKey="colophon.inspiration.title" fallback={t.inspiration.title} />
                </h2>
                <p>
                  <TranslatedText i18nKey="colophon.inspiration.content1" fallback={t.inspiration.content1} />{" "}
                  <ExternalLinkText href="https://binyam.in/colophon/">
                    Binyamin Aron Green&apos;s Colophon
                  </ExternalLinkText>
                  , <TranslatedText i18nKey="colophon.inspiration.content2" fallback={t.inspiration.content2} />{" "}
                  <ExternalLinkText href="https://ericwbailey.design/colophon.html">Eric Bailey</ExternalLinkText>
                  . <TranslatedText i18nKey="colophon.inspiration.content3" fallback={t.inspiration.content3} />{" "}
                  <ExternalLinkText href="https://indieweb.org/colophon">IndieWeb</ExternalLinkText>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </PageAnimation>
    </main>
  )
}
