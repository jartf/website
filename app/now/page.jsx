import { generateMetadata } from "@/lib/metadata"
import NowClient from "./NowClient"

export const metadata = generateMetadata({
  title: "Now",
  description: "What I'm focused on at this point in my life.",
  path: "now",
})

export default () => <NowClient />
