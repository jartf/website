import { generateMetadata as generateMeta } from "@/lib/metadata"
import Link from "next/link"
import { ExternalLink, Code, Server, Palette } from "lucide-react"
import ColophonClientWrapper from "./ColophonClientWrapper"

export const metadata = generateMeta({
  title: "Colophon",
  description: "The story behind this website and how it was built.",
  path: "colophon",
})

// Technology stack data - server defined
const technologyStack = [
  { name: "Next.js", url: "https://nextjs.org/", descKey: "colophon.technologyStack.nextjs" },
  { name: "React", url: "https://reactjs.org/", descKey: "colophon.technologyStack.react" },
  { name: "Tailwind CSS", url: "https://tailwindcss.com/", descKey: "colophon.technologyStack.tailwind" },
  { name: "shadcn/ui", url: "https://ui.shadcn.com/", descKey: "colophon.technologyStack.shadcn" },
  { name: "Framer Motion", url: "https://www.framer.com/motion/", descKey: "colophon.technologyStack.framer" },
  { name: "react-i18next", url: "https://react.i18next.com/", descKey: "colophon.technologyStack.i18next" },
  { name: "TypeScript", url: "https://www.typescriptlang.org/", descKey: "colophon.technologyStack.typescript" },
]

const sections = [
  { id: "site-history", icon: "Palette", titleKey: "colophon.siteHistory.title", contentKeys: ["colophon.siteHistory.content1", "colophon.siteHistory.content2"] },
  { id: "technology-stack", icon: "Code", titleKey: "colophon.technologyStack.title", techStack: technologyStack },
  { id: "hosting", icon: "Server", titleKey: "colophon.hosting.title", hasHostingContent: true },
  { id: "inspiration", icon: null, titleKey: "colophon.inspiration.title", hasInspirationContent: true },
]

export default function ColophonPage() {
  return <ColophonClientWrapper sections={sections} technologyStack={technologyStack} />
}
