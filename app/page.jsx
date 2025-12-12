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

// Static fallback content for SSR (English)
const STATIC_CONTENT = {
  heading: "hi there, i'm Jarema",
  subheading: "Economics major, sometimes coder, most times cat whisperer.",
  contactButton: "Contact me",
  aboutButton: "About me",
  blogButton: "Read my blog",
  recentPosts: "Recent blog posts",
  minRead: "min read",
  mood: "Mood",
}

/**
 * The home page component.
 * @returns {JSX.Element} The home page component.
 */
export default async function Home() {
  const blogPosts = await getAllBlogPosts()
  // Get English posts as default for SSR
  const englishPosts = blogPosts.filter(post => post.language === "en").slice(0, 3)

  return <HomeClient blogPosts={blogPosts} staticContent={STATIC_CONTENT} staticPosts={englishPosts} />
}
