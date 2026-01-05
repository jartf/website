/**
 * Structured Data (JSON-LD) Utilities for Google Rich Results
 * Provides schema.org markup for better search engine visibility
 */

import { siteUrl, siteName, siteDescription } from "./constants"

// ============================================================================
// Person Schema (Author/Creator)
// ============================================================================
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: "Jarema",
    url: siteUrl,
    description: "Economics major, sometimes coder, most times cat whisperer.",
    image: `${siteUrl}/android-chrome-512x512.png`,
    sameAs: [
      "https://github.com/jartf",
      "https://pronouns.page/@jerryv",
    ],
    knowsAbout: [
      "Economics",
      "Web Development",
      "Programming",
      "Software Engineering",
    ],
  }
}

// ============================================================================
// WebSite Schema (Homepage)
// ============================================================================
export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    description: siteDescription,
    url: siteUrl,
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
    inLanguage: ["en", "vi", "et", "ru", "da", "zh", "tr", "pl", "sv", "fi"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

// ============================================================================
// Blog Post (Article) Schema
// ============================================================================
export interface BlogPostSchemaProps {
  title: string
  description: string
  slug: string
  date: string
  dateModified?: string
  tags?: string[]
  category?: string
  language?: string
  readingTime?: number
}

export function generateBlogPostSchema({
  title,
  description,
  slug,
  date,
  dateModified,
  tags = [],
  category,
  language = "en",
  readingTime,
}: BlogPostSchemaProps) {
  const url = `${siteUrl}/blog/${slug}`
  const imageUrl = `${siteUrl}/android-chrome-512x512.png`

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    headline: title,
    description,
    url,
    image: imageUrl,
    datePublished: date,
    dateModified: dateModified || date,
    author: {
      "@id": `${siteUrl}/#person`,
    },
    publisher: {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: "Jarema",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: imageUrl,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: language,
    ...(tags.length > 0 && { keywords: tags.join(", ") }),
    ...(category && { articleSection: category }),
    ...(readingTime && {
      timeRequired: `PT${readingTime}M`,
    }),
  }
}

// ============================================================================
// Breadcrumb Schema
// ============================================================================
export interface BreadcrumbItem {
  name: string
  url: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  }
}

// ============================================================================
// ItemList Schema (for Blog list, Projects, etc.)
// ============================================================================
export interface ListItem {
  title: string
  description?: string
  url: string
  date?: string
  image?: string
}

export function generateItemListSchema(
  name: string,
  description: string,
  items: ListItem[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: item.url,
      name: item.title,
      ...(item.description && { description: item.description }),
      ...(item.date && { datePublished: item.date }),
      ...(item.image && { image: item.image }),
    })),
  }
}

// ============================================================================
// FAQ Schema (useful for About/Colophon pages)
// ============================================================================
export interface FAQItem {
  question: string
  answer: string
}

export function generateFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

// ============================================================================
// ProfilePage Schema (for About page)
// ============================================================================
export function generateProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/about`,
    mainEntity: {
      "@id": `${siteUrl}/#person`,
    },
    name: "About Jarema",
    description: "Learn more about Jarema - economics major, developer, and cat enthusiast.",
    url: `${siteUrl}/about`,
  }
}

// ============================================================================
// Helper: Render JSON-LD script tag
// ============================================================================
export function renderJsonLd(data: object | object[]): React.JSX.Element {
  // Handle array of schemas (multiple schemas on one page)
  const schemaArray = Array.isArray(data) ? data : [data]

  return (
    <>
      {schemaArray.map((schema: object, index: number) => {
        const jsonString = JSON.stringify(schema, null, 0)

        return (
          <script
            key={index}
            type="application/ld+json"
            suppressHydrationWarning
          >
            {jsonString}
          </script>
        )
      })}
    </>
  )
}
