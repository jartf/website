# Jarema's digital garden, version 5

A personal website built with [Astro](https://astro.build), migrated from Next.js.

## Architecture

This is an Astro website using islands architecture, static HTML by default and React for some specific interactive components.

### Key points

- Static-first, most components are `.astro` files to utilize server-rendered HTML
- React islands, with `client:only="react"` for client-side interactivity and `client:load` for SSR with hydration
- State management using `nanostores` with `@nanostores/react` for shared state across islands

## Features

- Static site generation with Astro
- Tailwind CSS for styling
- Content collections for blog posts
- Dark/light theme support
- Multilingual support ready
- Accessible (WCAG 2.1 AA)
- Responsive design
- RSS, Atom, and JSON feeds
- Follows IndieWeb conventions with h-card

## Getting started

### Prerequisites

- Node.js 18+
- pnpm (preferred) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Project structure

```text
src/
├── components/       # .astro (static) and .tsx (islands)
├── content/          # Content for blog and scrapbook
│   ├── blog/         # Blog posts in Markdown
│   ├── scrapbook/    # Scrapbook entries
│   └── config.ts     # Content collection schemas
├── hooks/            # React hooks for islands
├── i18n/             # Translations and language utilities
│   └── translations/ # JSON translation files
├── layouts/          # BaseLayout.astro, RetroLayout.astro
├── lib/              # constants.ts, utils.ts, feed.ts
├── pages/            # File-based routing
│   ├── blog/         # Blog pages
│   ├── api/          # API routes
│   └── ...           # Other pages
└── styles/           # globals.css
```

## Development

### Adding a blog post

Create a new Markdown file in `src/content/blog/` with the beginning as follows:
```yaml
---
title: "Post title"           # Required
date: "2025-01-08"            # Required
excerpt: "Brief description"  # Optional
language: "en"                # Default: "en"
mood: "optimistic"            # Default: "contemplative"
catApproved: true             # Default: true
readingTime: 5                # Optional, in minutes
tags: ["tag1", "tag2"]        # Optional array
draft: false                  # Default: false
alternates:                   # Optional, for multilingual posts
  - language: vi
    slug: vietnamese-article
---

Your content goes here.
```

**File naming:** `src/content/blog/YYYY/MM/slug.md` or `src/content/blog/slug.md`

### Theming

The site supports dark and light modes:

- Dark mode is the default
- Theme preference stored in `localStorage`
- CSS variables in `:root` / `.light` / `.dark` selectors (see `src/styles/globals.css`)
- Theme applied via `class` on `<html>` element
- Respects user's system preference on first visit

### Internationalization (i18n)

**12 languages** supported: English, Tiếng Việt, Русский, Eesti, Dansk, 中文, Türkçe, Polski, Svenska, Suomi, toki pona, 漢喃

- Translations in `src/i18n/translations/*.json`
- Use `data-i18n="key.path"` attribute for client-side translation
- Language state managed via `languageStore` nanostore
- Language detection from browser or localStorage

### Component conventions

**When to use `.astro` vs `.tsx`:**

- Use `.astro` for static content, layouts, pages
- Use `.tsx` with `client:only="react"` for interactive features (search, toggles, games)

**Island hydration directives:**

```astro
<!-- No JS needed -->
<StaticComponent />

<!-- Interactive, skip SSR -->
<LanguageToggle client:only="react" />

<!-- Interactive with SSR -->
<Game2048 client:load />
```

**Utility functions:**

Use `cn()` from `src/lib/utils.ts` for conditional Tailwind classes:

```tsx
import { cn } from "@/lib/utils";
<div className={cn("base-class", isActive && "active-class")} />
```

## Commands

| Command       | Action                                      |
|---------------|---------------------------------------------|
| `pnpm dev`    | Start dev server at `localhost:4321`        |
| `pnpm build`  | Build for production to `./dist/`           |
| `pnpm preview`| Preview production build locally            |
| `pnpm check`  | Check TypeScript and Astro components       |

## Migration notes

This site was migrated from Next.js (v4) to Astro (v5). Key changes:

1. Server-first architecture, components render static HTML by default
2. Islands architecture for only interactive components in React
3. Content collections using Astro's built-in content collections
4. Simplified routing, file-based routing without route groups

## External integrations

The site is deployed using Vercel, `vercel.json` adapter is configured for static output.

## License

This repository is dual-licensed.

All source code is licensed under the [MIT License](LICENSE).

All non-code content (text, posts, essays, documentation, photos, and other material if any) is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](http://creativecommons.org/licenses/by/4.0/).

You are free to use, modify, redistribute, and sell both, provided proper attribution is given.
