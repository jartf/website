import { generateMetadata } from "@/lib/metadata"
import AboutClient from "./AboutClient"

export const metadata = generateMetadata({
  title: "About Me",
  description: "Learn more about me, my background, and my journey.",
  path: "about",
})

export default function AboutPage() {
  return <AboutClient />
}
