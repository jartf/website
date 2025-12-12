import { generateMetadata } from "@/lib/metadata"
import SlashesClient from "./SlashesClient"

export const metadata = generateMetadata({
  title: "Slashes",
  description: "A collection of slashes that define me.",
  path: "slashes",
})

// Static routes data - defined on server, passed to client
const routes = [
  {
    path: "/",
    name: "Home",
    description: "The main landing page of the website",
    iconName: "Home",
  },
  {
    path: "/about",
    name: "About",
    description: "Learn more about me and my background",
    iconName: "User",
  },
  {
    path: "/projects",
    name: "Projects",
    description: "Explore my personal, academic, and activism projects",
    iconName: "Code",
  },
  {
    path: "/blog",
    name: "Blog",
    description: "Read my thoughts, reflections, and occasional rants",
    iconName: "BookOpen",
  },
  {
    path: "/now",
    name: "Now",
    description: "See what I'm currently doing, thinking about, and focusing on",
    iconName: "Clock",
  },
  {
    path: "/uses",
    name: "Uses",
    description: "Discover the tools, gadgets, and software I use daily",
    iconName: "Wrench",
  },
  {
    path: "/scrapbook",
    name: "Scrapbook",
    description: "Behind-the-scenes devlog of building this site",
    iconName: "Calendar",
  },
  {
    path: "/contact",
    name: "Contact",
    description: "Find ways to reach out and connect with me",
    iconName: "Mail",
  },
  {
    path: "/colophon",
    name: "Colophon",
    description: "The story behind this website and how it was built",
    iconName: "FileText",
  },
  {
    path: "/tetris",
    name: "Shhhh...",
    description: "What could this page be?",
    iconName: "Slash",
  },
  {
    path: "/2048",
    name: "The Forbidden Math",
    description: "A mysterious game where numbers double but sanity halves",
    iconName: "Slash",
  },
  {
    path: "/404",
    name: "404 - Not Found",
    description: "The page that appears when you try to access a non-existent page",
    iconName: "FileText",
  },
  {
    path: "/slashes",
    name: "Slashes",
    description: "This page - a directory of all accessible pages on the site",
    iconName: "Slash",
  },
  {
    path: "/badges",
    name: "Badges",
    description: "A collection of classic web badges and buttons used on my website",
    iconName: "FileText",
  },
]

export default function SlashesPage() {
  return <SlashesClient routes={routes} />
}
