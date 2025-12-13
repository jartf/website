# Structured Data for Google Rich Results

This document explains the structured data (JSON-LD) implementation for enhancing Google search results.

## Overview

Structured data has been added across the website to help Google better understand and display your content in search results. This can lead to rich snippets, enhanced search cards, and better visibility in Google Search.

## Implementation

All structured data utilities are in [`lib/structured-data.tsx`](lib/structured-data.tsx).

### Schemas Implemented

#### 1. **WebSite Schema** (Homepage)

- Identifies the site as a whole
- Includes search action for blog posts
- Multi-language support

**Location**: [app/page.jsx](app/page.jsx)

```jsx
const webSiteSchema = generateWebSiteSchema()
```

#### 2. **Person Schema** (Author/Creator)

- Personal profile information
- Links to social profiles (GitHub, Pronouns.page)
- Areas of expertise

**Locations**: Homepage, About page

```jsx
const personSchema = generatePersonSchema()
```

#### 3. **BlogPosting Schema** (Blog Posts)

- Article title, description, publish date
- Author information
- Tags and categories
- Reading time
- Language information

**Location**: [app/blog/[...slug]/page.tsx](app/blog/[...slug]/page.tsx)

```jsx
const blogPostSchema = generateBlogPostSchema({
  title: post.title,
  description: post.content.substring(0, 160),
  slug,
  date: post.date,
  tags: post.tags,
  category: post.category,
  language: post.language,
  readingTime: post.readingTime,
})
```

#### 4. **BreadcrumbList Schema** (Navigation)

- Breadcrumb navigation paths
- Helps Google understand site hierarchy

**Locations**: All major pages

```jsx
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Blog", url: "/blog" },
  { name: post.title, url: `/blog/${slug}` },
])
```

#### 5. **ItemList Schema** (Collections)

- Lists of blog posts, projects, tools
- Provides structured information about collections

**Locations**: Blog list, Projects, Uses pages

```jsx
const itemListSchema = generateItemListSchema(
  "Blog Posts",
  "Thoughts, reflections, and occasional rants by Jarema",
  blogPosts.map(post => ({
    title: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    date: post.date,
  }))
)
```

#### 6. **ProfilePage Schema** (About Page)

- Links to Person schema
- Identifies the page as a profile/about page

**Location**: [app/about/page.tsx](app/about/page.tsx)

```jsx
const profilePageSchema = generateProfilePageSchema()
```

## Pages with Structured Data

### ✅ Implemented

- **Homepage** (`/`): WebSite + Person schemas
- **Blog Post** (`/blog/[slug]`): BlogPosting + Breadcrumb schemas
- **Blog List** (`/blog`): ItemList + Breadcrumb schemas
- **About** (`/about`): Person + ProfilePage + Breadcrumb schemas
- **Projects** (`/projects`): ItemList + Breadcrumb schemas
- **Now** (`/now`): Breadcrumb schema
- **Uses** (`/uses`): ItemList + Breadcrumb schemas

## Benefits

### For Google Search

1. **Rich Snippets**: Blog posts can show publication date, author, and reading time
2. **Breadcrumbs**: Clear navigation paths in search results
3. **Author Information**: Your personal profile appears with articles
4. **Site Search**: Google may provide a search box in results
5. **Knowledge Panel**: Potential appearance in Knowledge Graph

### For Other Services

- **Social Media**: Better link previews when sharing
- **RSS Readers**: Enhanced article metadata
- **Developer Tools**: Schema validation in Google Search Console

## Testing & Validation

### Google Rich Results Test

Test your pages at: <https://search.google.com/test/rich-results>

Example URLs to test:

- Homepage: `https://jarema.me`
- Blog post: `https://jarema.me/blog/[any-slug]`
- About: `https://jarema.me/about`

### Google Search Console

Monitor structured data performance:

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Check "Enhancements" section
3. Look for:
   - Article rich results
   - Breadcrumb issues
   - Site search box

### Schema.org Validator

Validate at: <https://validator.schema.org/>

## Maintenance

### Adding New Schemas

To add structured data to a new page:

1. Import utilities:

```tsx
import { generateBreadcrumbSchema, renderJsonLd } from "@/lib/structured-data"
```

1. Generate schema data:

```tsx
const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "/" },
  { name: "Your Page", url: "/your-page" },
])
```

1. Render in component:

```tsx
return (
  <>
    {renderJsonLd([breadcrumbSchema])}
    <YourPageContent />
  </>
)
```

### Updating Existing Schemas

Edit [`lib/structured-data.tsx`](lib/structured-data.tsx) to modify any schema function.

Key considerations:

- Keep URLs absolute (use `SITE_URL` constant)
- Validate with Google's Rich Results Test
- Follow [schema.org](https://schema.org) specifications

## Available Schema Functions

All functions are exported from `lib/structured-data.tsx`:

- `generatePersonSchema()` - Author/creator information
- `generateWebSiteSchema()` - Site-wide information
- `generateBlogPostSchema(props)` - Blog article markup
- `generateBreadcrumbSchema(items)` - Navigation breadcrumbs
- `generateItemListSchema(name, description, items)` - Collections/lists
- `generateFAQSchema(items)` - FAQ pages (not yet used)
- `generateProfilePageSchema()` - About/profile pages
- `renderJsonLd(data)` - Render JSON-LD script tags

## Future Enhancements

Potential additions:

- **Event Schema**: For any events or meetups
- **FAQ Schema**: For FAQ sections in About/Colophon
- **HowTo Schema**: For tutorial blog posts
- **Video Schema**: If adding video content
- **Product Schema**: If showcasing products

## Resources

- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Schema.org Documentation](https://schema.org/)
- [JSON-LD Specification](https://json-ld.org/)
- [Rich Results Test](https://search.google.com/test/rich-results)

## Notes

- All structured data is rendered server-side for SEO
- JSON-LD is minified in production (no pretty-printing)
- Multiple schemas can be rendered on a single page
- Schemas are validated during type-checking with TypeScript
