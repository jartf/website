import { generateMetadata } from "@/lib/metadata"
import { nowItems } from "@/content/now-items"
import NowClient from "./client";
import type { SerializableNowItem, CategoryData } from "./types"
import { generateBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data"
import { NOW_ICONS, getIconName } from "@/lib/icons"

export const metadata = generateMetadata({
  title: "Now",
  description: "What I'm focused on at this point in my life.",
  path: "now",
})

// Use shared getIconName with NOW_ICONS map
const getIconNameFromNow = (icon: typeof nowItems[number]["icon"]) =>
  getIconName(icon, NOW_ICONS)

export default function NowPage() {
  // Convert nowItems to serializable format (replace icon components with names)
  const serializableItems: SerializableNowItem[] = nowItems.map((item) => ({
    id: item.id,
    category: item.category,
    iconName: getIconNameFromNow(item.icon),
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

  // Generate structured data
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Now", url: "/now" },
  ])

  return (
    <>
      {/* Structured Data for Google Rich Results */}
      {renderJsonLd([breadcrumbSchema])}

      <NowClient
        items={serializableItems}
        groupedItems={groupedItems}
        categories={categories}
      />
    </>
  )
}
