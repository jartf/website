import { generateMetadata } from "@/lib/metadata"
import ProjectsClient from "./ProjectsClient"

export const metadata = generateMetadata({
  title: "Projects",
  description: "A showcase of my projects and work.",
  path: "projects",
})

export default function ProjectsPage() {
  return <ProjectsClient />
}
