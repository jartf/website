import { generateMetadata } from "@/lib/metadata"
import { USES_CATEGORIES } from "@/content/uses-items"
import UsesClient, { type SerializableUsesCategory } from "./client"
import { generateItemListSchema, generateBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data"
import { SITE_URL } from "@/lib/constants"
import { USES_ICONS } from "@/lib/icons"
import enTranslations from "@/translations/en.json"

export const metadata = generateMetadata({
  title: "Uses",
  description: "Software and hardware I use every day.",
  path: "uses",
})

export default function UsesPage() {
  // Convert USES_CATEGORIES to serializable format with descriptions
  const serializableCategories: SerializableUsesCategory[] = USES_CATEGORIES.map(
    (category) => {
      // Find icon name directly
      const iconName = Object.entries(USES_ICONS).find(([_, Icon]) => {
        if (typeof category.icon === 'object' && category.icon && 'type' in category.icon) {
          return Icon === category.icon.type
        }
        return false
      })?.[0] || "ImageIcon"

      return {
        title: category.title,
        iconName,
        items: category.items.map((item) => {
          const description = item.descriptionKey
            ? enTranslations.uses.itemDescriptions[item.descriptionKey as keyof typeof enTranslations.uses.itemDescriptions]
            : undefined
          return {
            name: item.name,
            descriptionKey: item.descriptionKey,
            description,
            link: item.link,
          }
        }),
        subsections: category.subsections?.map((sub) => {
          const subIconName = sub.icon ? Object.entries(USES_ICONS).find(([_, Icon]) => {
            if (typeof sub.icon === 'object' && sub.icon && 'type' in sub.icon) {
              return Icon === sub.icon.type
            }
            return false
          })?.[0] : undefined

          return {
            title: sub.title,
            iconName: subIconName,
            items: sub.items.map((item) => {
              const description = item.descriptionKey
                ? enTranslations.uses.itemDescriptions[item.descriptionKey as keyof typeof enTranslations.uses.itemDescriptions]
                : item.description
              return {
                name: item.name,
                descriptionKey: item.descriptionKey,
                description,
                link: item.link,
              }
            }),
          }
        }),
      }
    }
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
      {renderJsonLd([itemListSchema, breadcrumbSchema])}
      <UsesClient categories={serializableCategories} />
    </>
  )
}
