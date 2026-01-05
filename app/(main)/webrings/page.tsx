import { generateMetadata as generateMeta } from "@/lib/metadata"
import { WEBRING_ITEMS } from "@/content/webring-items"
import WebringClient from "./client"

export const metadata = generateMeta({
  title: "Webrings",
  description: "Webrings I'm part of. Discover more independent websites and personal blogs.",
  path: "webring",
})

export default function WebringPage() {
  return (
    <div className="container max-w-4xl py-8">
      <WebringClient webrings={WEBRING_ITEMS} />
    </div>
  )
}
