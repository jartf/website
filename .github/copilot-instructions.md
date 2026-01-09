# Copilot Instructions for Jarema's Digital Garden

## Architecture Overview

This is an **Astro 5** personal website using **islands architecture**—static HTML by default, React only for interactive components. Migrated from Next.js v4.

### Key Patterns

- **Static-first**: Most components are `.astro` files (server-rendered HTML)
- **React islands**: Use `client:only="react"` for client-side interactivity, `client:load` for SSR+hydration
- **State management**: `nanostores` with `@nanostores/react` for shared state across islands
- **Styling**: Tailwind CSS with CSS variables for theming (see [globals.css](src/styles/globals.css))

## Project Structure

```
src/
├── components/     # .astro (static) and .tsx (islands)
├── content/        # Astro content collections (blog/, scrapbook/)
├── hooks/          # React hooks for islands
├── i18n/           # Translations and language utilities
├── layouts/        # BaseLayout.astro, RetroLayout.astro
├── lib/            # constants.ts, utils.ts, feed.ts
├── pages/          # File-based routing
└── styles/         # globals.css with CSS variables
```

## Development Commands

```bash
pnpm dev      # Start dev server at localhost:4321
pnpm build    # Build for production
pnpm check    # TypeScript + Astro component checks
```

## Content Collections

Blog posts go in `src/content/blog/` with this frontmatter schema:

```yaml
title: "Post Title"           # Required
date: "2025-01-08"            # Required, coerced to Date
excerpt: "Brief description"  # Optional
language: "en"                # Default: "en"
mood: "optimistic"            # Default: "contemplative"
catApproved: true             # Default: true
tags: ["tag1"]                # Optional array
draft: false                  # Default: false
alternates:                   # For multilingual posts
  - language: vi
    slug: bai-viet-tieng-viet
```

## i18n System

- **12 languages** supported (see [supportedLanguages](src/lib/constants.ts))
- Translations in `src/i18n/translations/*.json`
- Import the T component and use it for client-side translation
- Language state in `languageStore` nanostore

## Component Conventions

### Astro vs React Decision
- Use `.astro` for static content, layouts, pages
- Use `.tsx` with `client:only="react"` for interactive features (search, toggles, games)

### Island Hydration
```astro
<!-- No JS needed -->
<StaticComponent />

<!-- Interactive, skip SSR -->
<LanguageToggle client:only="react" />

<!-- Interactive with SSR -->
<Game2048 client:load />
```

### Utility Functions
Use `cn()` from [lib/utils.ts](src/lib/utils.ts) for conditional Tailwind classes:
```tsx
import { cn } from "@/lib/utils";
<div className={cn("base-class", isActive && "active-class")} />
```

## Theming

- Dark mode default, toggleable light mode
- CSS variables in `:root` / `.light` / `.dark` selectors
- Theme stored in `localStorage`, applied via `class` on `<html>`

## File Naming

- Pages: `src/pages/[route]/index.astro`
- Blog posts: `src/content/blog/YYYY/MM/slug.md` or `src/content/blog/slug.md`
- Translations: `src/i18n/translations/{lang}.json`

## External Integrations

- **Vercel**: Deployment adapter configured
- **IndieWeb**: h-card microformats, webmentions enabled
- **Feeds**: RSS, Atom, JSON Feed at `/rss.xml`, `/atom.xml`, `/feed.json`
