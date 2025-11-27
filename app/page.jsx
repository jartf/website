import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { generateMetadata } from "@/lib/metadata"
import { getAllBlogPosts } from "@/lib/blog-utils"
import HomeClient from "./HomeClient"

export const metadata = generateMetadata({
  title: "Home",
  description: "Economics major, sometimes coder, most times cat whisperer.",
  isHomePage: true,
})

/**
 * The home page component.
 * @returns {JSX.Element} The home page component.
 */
export default async function Home() {
  const blogPosts = await getAllBlogPosts()
  return <HomeClient blogPosts={blogPosts} />
}
