# Jarema's digital garden, version 5 (Astro)

A personal website built with [Astro](https://astro.build), migrated from Next.js.

![Screenshot of the first fold of website's homepage in dark mode. The hero section centers a main heading, a short bio and a flex row of four action buttons. The lower section uses a two column layout. The left column displays three blog post cards with titles, excerpts, dates and read times. The right column displays a dynamic now section.](<jarema.me - Salvestamata.jpg>)

## Architecture

This is an Astro website using islands architecture, static HTML by default and React for some specific interactive components.

### Key points

- Static-first, most components are `.astro` files to utilize server-rendered HTML
- React islands, with `client:only="react"` for client-side interactivity and `client:load` for SSR with hydration
- State management using `nanostores` with `@nanostores/react` for shared state across islands

## Features

- Static site generation with Astro
- Tailwind CSS for styling
- Content collections for blog posts, now, projects, uses, scrapbook, and webrings
- Dark/light theme support
- Multilingual support
- Accessible (WCAG 2.1 AA)
- Responsive design
- RSS, Atom, JSON feeds, sitemap
- IndieWeb: h-card, webmentions, IndieAuth
- Global command bar
- Games: 2048, Tetris

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
public/
├── fonts/            # Self-hosted web fonts
├── keys/             # Public PGP and SSH keys
├── robots.txt        # Ask bad robots to go away politely :D
├── site.webmanifest  # Manifest file
└── ...               # Other static assets
src/
├── components/       # .astro (static) and .tsx (React islands)
│   ├── blog/         # Blog components
│   ├── home/         # Homepage components
│   ├── game/         # Game components
│   ├── ...
│   ├── CommandBar.tsx    # Command bar
│   └── T.astro       # Translation component
├── content/          # Astro content collections
│   ├── blog/         # Blog posts, in Markdown
│   ├── now/          # Now entries, in JSON
│   ├── projects/     # Project entries, in JSON
│   ├── scrapbook/    # Scrapbook entries, in JSON
│   ├── uses/         # Uses page categories, in JSON
│   ├── webrings/     # Webring membership data, in JSON
│   └── config.ts     # Collection schemas and exported types
├── hooks/            # React hooks
│   ├── index.ts
│   └── use-game-2048.ts
├── i18n/             # Translations and language utilities
│   ├── client.ts     # Client-side language utilities
│   ├── index.ts      # Server-side i18n utilities
│   ├── routing.ts    # Locale routing helpers
│   └── translations/ # JSON translation files (one per locale)
├── layouts/
│   ├── BaseLayout.astro    # Main site layout
│   └── RetroLayout.astro   # Layout for browser compatibility pages
├── lib/              # Shared utilities and constants
│   ├── constants.ts  # Site metadata, author info, service config
│   ├── escape.ts     # HTML escaping
│   ├── feed.ts       # RSS/Atom/JSON feed helpers
│   ├── now-utils.ts  # Helpers for the /now page
│   ├── theme-utils.ts      # Theme helper
│   └── timezone-utils.ts   # Timezone helper
├── pages/            # File-based routing
│   ├── [locale]/     # Localised layout catch-all
│   ├── blog/         # Blog pages
│   ├── api/          # API routes
│   ├── ...           # Other pages
│   ├── atom.xml.ts   # Atom feed
│   ├── feed.json.ts  # JSON feed
│   ├── rss.xml.ts    # RSS feed
│   ├── sitemap.xml.ts      # Sitemap
│   ├── sitemap-index.xml.ts
│   └── index.astro   # Homepage
└── styles/           # Global styling
```

## Development

### Adding a blog post

Create a new Markdown file in `src/content/blog/` with the following frontmatter:

```yaml
---
title: "Post title"           # Required
date: "2025-01-08"            # Required
updated: "2025-01-10"         # Optional
excerpt: "Brief description"  # Optional
language: "en"                # Default: "en"
mood: "optimistic"            # Default: "contemplative"
catApproved: true             # Default: true
readingTime: 5                # Optional, in minutes
tags: ["tag1", "tag2"]        # Optional array
category: "coding"            # Optional
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
- Use the `T.astro` component for static translations
- Language state managed via `languageStore` nanostore
- Language detection from browser or localStorage

### Component conventions

**When to use `.astro` vs `.tsx`:**

- Use `.astro` for static content, layouts, pages
- Use `.tsx` with `client:only="react"` for interactive features (command bar, language toggle, games)

**Island hydration directives:**

```astro
<!-- No JS needed -->
<StaticComponent />

<!-- Interactive, skip SSR -->
<CommandBar client:only="react" />

<!-- Interactive with SSR -->
<Game2048 client:load />
```

## Commands

| Command        | Action                                      |
|----------------|---------------------------------------------|
| `pnpm dev`     | Start dev server at `localhost:4321`        |
| `pnpm build`   | Build for production to `./dist/`           |
| `pnpm preview` | Preview production build locally            |
| `pnpm check`   | Check TypeScript and Astro components       |

## External integrations

- Deployment: Vercel (static output via `@astrojs/vercel`)
- IndieAuth: implemented via indieauth.com
- Webmentions: implemented via webmention.io
- Last.fm: music listening data via API
- imood and status.cafe: mood and status widgets

## License

**TL;DR: You are free to use, modify, redistribute, and sell the source code and the content on this website, provided proper attribution is given back to me. Attribution should include a link to my website (https://jarema.me).**

This repository is dual-licensed.

All source code is licensed under the [MIT License](LICENSE).

All non-code content, such as text, posts, essays, documentation, photos, videos, and other materials, is licensed under the [Creative Commons Attribution 4.0 International License (CC BY 4.0)](http://creativecommons.org/licenses/by/4.0/).

These licenses do not apply to third-party libraries, assets, or content included in the project. Third-party components and assets are subject to their own respective licenses.
