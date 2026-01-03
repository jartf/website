import { generateMetadata } from "@/lib/metadata"
import { nowItems } from "@/content/now-items"
import NowClient, { type SerializableNowItem, type CategoryData } from "./client"
import { generateBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data"
import { NOW_ICONS } from "@/lib/icons"

export const metadata = generateMetadata({
  title: "Now",
  description: "What I'm focused on at this point in my life.",
  path: "now",
})

export default function NowPage() {
  // Convert nowItems to serializable format (get icon name directly)
  const serializableItems: SerializableNowItem[] = nowItems.map((item) => {
    // Find icon name by comparing component reference
    const iconName = Object.entries(NOW_ICONS).find(([_, Icon]) => Icon === item.icon)?.[0] || "Activity"
    return {
      id: item.id,
      category: item.category,
      iconName,
      content: item.content,
      date: item.date,
    }
  })

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
      {renderJsonLd([breadcrumbSchema])}
      <NowClient
        items={serializableItems}
        groupedItems={groupedItems}
        categories={categories}
      />
    </>
  )
}
