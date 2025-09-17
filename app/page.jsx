import { generateMetadata } from "@/lib/metadata"
// Update import for the home page client component
import Home from "./HomeClient"
import BlogList from "./blog/BlogList"
import blogPosts from "./blog/page.tsx"

export const metadata = generateMetadata({
  title: "Home",
  description: "Economics major, sometimes coder, most times cat whisperer.",
  isHomePage: true,
})

export default function HomePage() {
  // blogPosts import should match how BlogList gets its data
  return <Home blogPosts={blogPosts} />
}
