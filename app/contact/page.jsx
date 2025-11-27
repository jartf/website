import { generateMetadata } from "@/lib/metadata"
import ContactClient from "./ContactClient"

export const metadata = generateMetadata({
  title: "Contact",
  description: "Get in touch with me.",
  path: "contact",
})

export default function ContactPage() {
  return <ContactClient />
}
