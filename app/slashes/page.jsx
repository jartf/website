import { generateMetadata } from "@/lib/metadata"
import SlashesClient from "./SlashesClient"

export const metadata = generateMetadata({
  title: "Slashes",
  description: "A collection of slashes that define me.",
  path: "slashes",
})

export default function SlashesPage() {
  return <SlashesClient />
}
