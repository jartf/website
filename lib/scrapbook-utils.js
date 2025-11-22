import fs from "fs"
import path from "path"
import matter from "gray-matter"

export function getScrapbookEntries() {
  const scrapbookDirectory = path.join(process.cwd(), "content/scrapbook")

  return fs.readdirSync(scrapbookDirectory)
    .map((filename) => {
      const { data, content } = matter(fs.readFileSync(path.join(scrapbookDirectory, filename), "utf8"))
      return {
        date: data.date,
        content: content.trim(),
        slug: filename.replace(/\.md$/, ""),
      }
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
}
