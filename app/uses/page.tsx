import { generateMetadata } from "@/lib/metadata"
import { USES_CATEGORIES } from "@/content/uses-items"
import UsesClient from "./client";
import type { SerializableUsesCategory } from "./types"
import { generateItemListSchema, generateBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data"
import { SITE_URL } from "@/lib/constants"
import { USES_ICONS, getIconNameFromElement } from "@/lib/icons"

export const metadata = generateMetadata({
  title: "Uses",
  description: "Software and hardware I use every day.",
  path: "uses",
})

// Use shared utility with USES_ICONS map
const getUsesIconName = (element: React.ReactNode) =>
  getIconNameFromElement(element, USES_ICONS)

export default function UsesPage() {
  // Convert USES_CATEGORIES to serializable format
  const serializableCategories: SerializableUsesCategory[] = USES_CATEGORIES.map(
    (category) => ({
      title: category.title,
      iconName: getUsesIconName(category.icon),
      items: category.items.map((item) => ({
        name: item.name,
        descriptionKey: item.descriptionKey,
        link: item.link,
      })),
      subsections: category.subsections?.map((sub) => ({
        title: sub.title,
        iconName: sub.icon ? getUsesIconName(sub.icon) : undefined,
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
