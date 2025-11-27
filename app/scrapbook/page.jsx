import { generateMetadata } from "@/lib/metadata"
import { getScrapbookEntries } from "@/lib/scrapbook-utils"
import ScrapbookClient from "./ScrapbookClient"

export const metadata = generateMetadata({
  title: "Devlog",
  description: "Behind-the-scenes notes and thoughts about building this site.",
  path: "scrapbook",
})

export default function ScrapbookPage() {
  return <ScrapbookClient entries={getScrapbookEntries()} />
}
