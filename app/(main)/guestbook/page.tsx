import { generateMetadata } from "@/lib/metadata"
import { TranslatedText } from "@/components/translated-text"

export const metadata = generateMetadata({
  title: "Guestbook",
  description: "Leave a message on my guestbook!",
})

// Static content for SSR (English)
const STATIC_CONTENT = {
  title: "Guestbook",
  description: "Leave a message in my guestbook!",
}

export default function GuestbookPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <TranslatedText i18nKey="guestbook.title" fallback={STATIC_CONTENT.title} />
          </h1>
          <p className="text-xl text-muted-foreground">
            <TranslatedText i18nKey="guestbook.description" fallback={STATIC_CONTENT.description} />
          </p>
        </div>

        <div className="w-full border rounded-lg overflow-hidden shadow-lg bg-card">
          <iframe
            src="https://jarema.atabook.org"
            className="w-full h-[800px] border-0"
            title="Guestbook - leave a message"
            loading="lazy"
            aria-label="Guestbook form and messages"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </main>
  )
}
