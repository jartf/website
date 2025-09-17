import { generateMetadata } from "@/lib/metadata"
// Update import for the home page client component
import HomeClient from "./HomeClient"

export const metadata = generateMetadata({
  title: "Home",
  description: "Economics major, sometimes coder, most times cat whisperer.",
  isHomePage: true,
})

export default function Home() {
  return <HomeClient />
}
