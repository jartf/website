import { generateMetadata } from "@/lib/metadata"
import UsesClient from "./UsesClient"

export const metadata = generateMetadata({
  title: "Uses",
  description: "Software and hardware I use every day.",
  path: "uses",
})

export default () => <UsesClient />
