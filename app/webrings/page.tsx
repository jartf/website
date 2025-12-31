import { generateMetadata as generateMeta } from "@/lib/metadata"
import WebringClientWrapper from "./WebringClientWrapper"
import { WEBRING_ITEMS } from "@/content/webring-items"

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

      <WebringClientWrapper webrings={WEBRING_ITEMS} />

    </div>
  )
}
