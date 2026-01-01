import { generateMetadata as generateMeta } from "@/lib/metadata"
import { projects, type Project } from "@/content/project-items"
import ProjectsClient from "./client";
import { generateItemListSchema, generateBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data"
import { SITE_URL } from "@/lib/constants"

export const metadata = generateMeta({
  title: "Projects",
  description: "A showcase of my projects and work.",
  path: "projects",
})

export default function ProjectsPage() {
  // Generate structured data for projects page
  const itemListSchema = generateItemListSchema(
    "Projects by Jarema",
    "A showcase of my personal projects, experiments, and work",
    projects.map((project) => ({
      title: project.content.en.title,
      description: project.content.en.description,
      url: `${SITE_URL}/projects`,
    }))
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
  ])

  // Pass projects data from server to minimal client wrapper
  return (
    <>
      {/* Structured Data for Google Rich Results */}
      {renderJsonLd([itemListSchema, breadcrumbSchema])}

      <ProjectsClient projects={projects} />
    </>
  )
}
