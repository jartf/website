import { generateMetadata } from "@/lib/metadata"
// Update import for the home page client component
import Home from "./HomeClient"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

function getAllBlogPosts() {
  const postsDirectory = path.join(process.cwd(), "app/blog")
  const files = fs.readdirSync(postsDirectory)
  return files
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file) => {
      const filePath = path.join(postsDirectory, file)
      const fileContents = fs.readFileSync(filePath, "utf8")
      const { data, content } = matter(fileContents)
      return {
        slug: file.replace(/\.(md|mdx)$/, ""),
        ...data,
        excerpt: data.excerpt || content.slice(0, 180),
      }
    })
}

export const metadata = generateMetadata({
  title: "Home",
  description: "Economics major, sometimes coder, most times cat whisperer.",
  isHomePage: true,
})

export default function HomePage() {
  const blogPosts = getAllBlogPosts()
  return <Home blogPosts={blogPosts} />
}
