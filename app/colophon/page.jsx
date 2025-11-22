import { generateMetadata } from "@/lib/metadata"
import ColophonClient from "./ColophonClient"

export const metadata = generateMetadata({
  title: "Colophon",
  description: "The story behind this website and how it was built.",
  path: "colophon",
})

export default () => <ColophonClient />
