import { generateMetadata } from "@/lib/metadata"
import { nowItems } from "@/content/now-items"
import NowClientWrapper from "./NowClientWrapper"
import type { SerializableNowItem, CategoryData } from "./types"
import {
  BookOpen,
  Code,
  Coffee,
  Headphones,
  Brain,
  GraduationCap,
  Lightbulb,
  Activity,
} from "lucide-react"

export const metadata = generateMetadata({
  title: "Now",
  description: "What I'm focused on at this point in my life.",
  path: "now",
})

// Reverse lookup to get icon name from component
function getIconName(
  icon: React.ComponentType<{ className?: string }>
): string {
  if (icon === BookOpen) return "BookOpen"
  if (icon === Code) return "Code"
  if (icon === Coffee) return "Coffee"
  if (icon === Headphones) return "Headphones"
  if (icon === Brain) return "Brain"
  if (icon === GraduationCap) return "GraduationCap"
  if (icon === Lightbulb) return "Lightbulb"
  if (icon === Activity) return "Activity"
  return "Activity" // default fallback
}

export default function NowPage() {
  // Convert nowItems to serializable format (replace icon components with names)
  const serializableItems: SerializableNowItem[] = nowItems.map((item) => ({
    id: item.id,
    category: item.category,
    iconName: getIconName(item.icon),
    content: item.content,
    date: item.date,
  }))

  // Pre-compute grouped items on the server
  const groupedItems = serializableItems.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, SerializableNowItem[]>
  )

  // Pre-compute categories with their icon names
  const categories: CategoryData[] = Object.keys(groupedItems).map(
    (category) => {
      const categoryItem = serializableItems.find(
        (item) => item.category === category
      )
      return {
        name: category,
        iconName: categoryItem?.iconName || "Activity",
      }
    }
  )

  return (
    <NowClientWrapper
      items={serializableItems}
      groupedItems={groupedItems}
      categories={categories}
    />
  )
}
