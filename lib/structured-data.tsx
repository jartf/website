/**
 * Structured Data (JSON-LD) Utilities for Google Rich Results
 * Provides schema.org markup for better search engine visibility
 */

import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./constants"

// ============================================================================
// Person Schema (Author/Creator)
// ============================================================================
export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Jarema",
    url: SITE_URL,
    description: "Economics major, sometimes coder, most times cat whisperer.",
    image: `${SITE_URL}/android-chrome-512x512.png`,
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
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    author: {
      "@id": `${SITE_URL}/#person`,
    },
    inLanguage: ["en", "vi", "et", "ru", "da", "zh", "tr", "pl", "sv", "fi"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/blog?q={search_term_string}`,
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
  const url = `${SITE_URL}/blog/${slug}`
  const imageUrl = `${SITE_URL}/android-chrome-512x512.png`

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
      "@id": `${SITE_URL}/#person`,
    },
    publisher: {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Jarema",
      url: SITE_URL,
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
      item: `${SITE_URL}${item.url}`,
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
    "@id": `${SITE_URL}/about`,
    mainEntity: {
      "@id": `${SITE_URL}/#person`,
    },
    name: "About Jarema",
    description: "Learn more about Jarema - economics major, developer, and cat enthusiast.",
    url: `${SITE_URL}/about`,
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
      {schemaArray.map((schema: object, index: number) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0), // Minified for production
          }}
        />
      ))}
    </>
  )
}
