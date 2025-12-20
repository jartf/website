import { generateMetadata } from "@/lib/metadata"
import Link from "next/link"
import { Slash, Home, User, Code, BookOpen, Clock, Mail, FileText, Wrench, Calendar, MessagesSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageAnimation, AnimatedEntry } from "@/components/page-animation"

export const metadata = generateMetadata({
  title: "Slashes",
  description: "A collection of slashes that define me.",
  path: "slashes",
})

// Icon map for server rendering
const iconMap = {
  Home,
  User,
  Code,
  BookOpen,
  Clock,
  Mail,
  FileText,
  Wrench,
  Calendar,
  MessagesSquare,
  Slash,
}

// Static routes data - defined on server
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
    path: "/guestbook",
    name: "Guestbook",
    description: "Sign my guestbook and leave a message",
    iconName: "MessagesSquare",
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
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <PageAnimation>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Site Directory</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A complete list of all accessible pages on this website
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {routes.map((route, index) => {
                const IconComponent = iconMap[route.iconName] || Slash
                return (
                  <AnimatedEntry key={route.path} index={index} className="">
                    <Link href={route.path} className="block group">
                      <Card className="transition-all duration-300 group-hover:shadow-md h-full">
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <CardTitle className="group-hover:text-primary transition-colors">
                            {route.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 text-muted-foreground mb-2">
                            <Slash className="h-4 w-4" />
                            <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{route.path}</code>
                          </div>
                          <p className="text-muted-foreground">{route.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  </AnimatedEntry>
                )
              })}
            </div>
          </div>
        </div>
      </PageAnimation>
    </main>
  )
}
