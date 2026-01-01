import type React from "react"
import {
  Laptop,
  Headphones,
  Smartphone,
  Code,
  Coffee,
  Globe,
  Shield,
  ImageIcon,
  Map,
  Gamepad2,
  Palette,
  Camera,
  Video,
  Music,
  Settings,
} from "lucide-react"
import { generateMetadata } from "@/lib/metadata"
import { USES_CATEGORIES } from "@/content/uses-items"
import UsesClient from "./client";
import type { SerializableUsesCategory } from "./types"
import { generateItemListSchema, generateBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data"
import { SITE_URL } from "@/lib/constants"

const usesIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop,
  Headphones,
  Smartphone,
  Code,
  Coffee,
  Globe,
  Shield,
  ImageIcon,
  Map,
  Gamepad2,
  Palette,
  Camera,
  Video,
  Music,
  Settings,
}

export const metadata = generateMetadata({
  title: "Uses",
  description: "Software and hardware I use every day.",
  path: "uses",
})

// Extract icon name from React element
function getIconNameFromElement(element: React.ReactNode): string {
  if (!element || typeof element !== "object") return "ImageIcon"

  const el = element as React.ReactElement
  if (!el.type) return "ImageIcon"

  // Get the component function/class name
  const type = el.type as unknown as { displayName?: string; name?: string }
  const typeName = type.displayName || type.name || ""

  // Match against known icons
  for (const [name, component] of Object.entries(usesIconMap)) {
    if (type === component || typeName === name) {
      return name
    }
  }

  return "ImageIcon"
}

export default function UsesPage() {
  // Convert USES_CATEGORIES to serializable format
  const serializableCategories: SerializableUsesCategory[] = USES_CATEGORIES.map(
    (category) => ({
      title: category.title,
      iconName: getIconNameFromElement(category.icon),
      items: category.items.map((item) => ({
        name: item.name,
        descriptionKey: item.descriptionKey,
        link: item.link,
      })),
      subsections: category.subsections?.map((sub) => ({
        title: sub.title,
        iconName: sub.icon ? getIconNameFromElement(sub.icon) : undefined,
        items: sub.items.map((item) => ({
          name: item.name,
          descriptionKey: item.descriptionKey,
          description: item.description,
          link: item.link,
        })),
      })),
    })
  )

  // Generate structured data
  const allItems = serializableCategories.flatMap((cat) =>
    cat.items.map((item) => ({
      title: item.name,
      url: item.link || `${SITE_URL}/uses`,
    }))
  )

  const itemListSchema = generateItemListSchema(
    "Tools and software I use",
    "Hardware and software I use for development, productivity, and daily work",
    allItems
  )

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Uses", url: "/uses" },
  ])

  return (
    <>
      {/* Structured Data for Google Rich Results */}
      {renderJsonLd([itemListSchema, breadcrumbSchema])}

      <UsesClient categories={serializableCategories} />
    </>
  )
}
