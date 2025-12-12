import { generateMetadata } from "@/lib/metadata"
import { USES_CATEGORIES } from "@/content/uses-items"
import UsesClientWrapper from "./UsesClientWrapper"
import type { SerializableUsesCategory, SerializableSubsection, SerializableUsesItem } from "./types"
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
import type React from "react"

export const metadata = generateMetadata({
  title: "Uses",
  description: "Software and hardware I use every day.",
  path: "uses",
})

// Map of all icons used - for getting icon names from JSX
const iconComponents = {
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

// Extract icon name from React element
function getIconNameFromElement(element: React.ReactNode): string {
  if (!element || typeof element !== "object") return "ImageIcon"
  
  const el = element as React.ReactElement
  if (!el.type) return "ImageIcon"
  
  // Get the component function/class name
  const type = el.type as any
  const typeName = type.displayName || type.name || ""
  
  // Match against known icons
  for (const [name, component] of Object.entries(iconComponents)) {
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

  return <UsesClientWrapper categories={serializableCategories} />
}
