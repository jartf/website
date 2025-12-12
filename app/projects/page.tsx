import { generateMetadata as generateMeta } from "@/lib/metadata"
import { projects, type Project } from "@/content/project-items"
import ProjectsClientWrapper from "./ProjectsClientWrapper"

export const metadata = generateMeta({
  title: "Projects",
  description: "A showcase of my projects and work.",
  path: "projects",
})

export default function ProjectsPage() {
  // Pass projects data from server to minimal client wrapper
  return <ProjectsClientWrapper projects={projects} />
}
