import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { generateMetadata } from "@/lib/metadata"
import HomeClient from "./HomeClient"

/**
 * Recursively gets all .md files in a directory and its subdirectories.
 * @param {string} dir - The directory to search.
 * @returns {string[]} - A list of all markdown files.
 */
function getAllMarkdownFiles(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach((file) => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(filePath))
    } else if (file.endsWith(".md")) {
      results.push(filePath)
    }
  })
  return results
}

/**
 * Gets all blog posts from the content/blog directory.
 * @returns {Promise<Object[]>} - A promise that resolves to a list of all blog posts.
 */
async function getBlogPosts() {
  try {
    const postsDirectory = path.join(process.cwd(), "content/blog")
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
      return []
    }
    const filePaths = getAllMarkdownFiles(postsDirectory)
    if (filePaths.length === 0) {
      return []
    }
    const allPostsData = filePaths
      .map((fullPath) => {
        try {
          let slug = path.relative(postsDirectory, fullPath).replace(/\.md$/, "")
          slug = slug.split(path.sep).join("/")
          const fileContents = fs.readFileSync(fullPath, "utf8")
          const matterResult = matter(fileContents)
          return {
            slug,
            title: matterResult.data.title || "Untitled Post",
            excerpt: matterResult.data.excerpt || "No excerpt available",
            date: matterResult.data.date || new Date().toISOString(),
            mood: matterResult.data.mood || "contemplative",
            catApproved: matterResult.data.catApproved ?? true,
            readingTime: matterResult.data.readingTime || 5,
            language: matterResult.data.language || "en",
            tags: matterResult.data.tags || [],
            category: matterResult.data.category || null,
          }
        } catch (error) {
          // Skip invalid blog posts silently in production
          if (process.env.NODE_ENV === 'development') {
            console.error(`Error processing blog post ${fullPath}:`, error)
          }
          return null
        }
      })
      .filter((post) => post !== null)
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1
      } else {
        return -1
      }
    })
  } catch (error) {
    // Return empty array if blog directory doesn't exist or has errors
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching blog posts:", error)
    }
    return []
  }
}

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
  const blogPosts = await getBlogPosts()
  return <HomeClient blogPosts={blogPosts} />
}
