import { generateMetadata as generateMeta } from "@/lib/metadata"
import ContactClient from "./client"

export const metadata = generateMeta({
  title: "Contact",
  description: "Get in touch with me.",
  path: "contact",
})

export default function ContactPage() {
  return <ContactClient />
}
