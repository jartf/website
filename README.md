# Jarema's Digital Garden - Astro Edition

A personal website built with [Astro](https://astro.build), migrated from Next.js.

## Features

- 🚀 Static site generation with Astro
- 🎨 Tailwind CSS for styling
- 📝 Content collections for blog posts
- 🌙 Dark/light theme support
- 🌐 Multilingual support ready
- ♿ Accessible (WCAG 2.1 AA)
- 📱 Responsive design
- 🔗 RSS, Atom, and JSON feeds
- 🕸️ IndieWeb compatible (h-card, webmentions)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

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

## Project Structure

```
src/
├── components/       # Astro and React components
├── content/          # Content collections (blog, scrapbook)
│   ├── blog/         # Blog posts in Markdown
│   └── config.ts     # Content collection schemas
├── layouts/          # Page layouts
├── lib/              # Utilities and constants
├── pages/            # File-based routing
│   ├── blog/         # Blog pages
│   └── ...           # Other pages
├── stores/           # State management (nanostores)
└── styles/           # Global CSS
```

## Development

### Adding a Blog Post

Create a new markdown file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
excerpt: "A brief description"
date: "2024-01-01"
mood: "happy"
catApproved: true
readingTime: 5
language: "en"
tags: ["tag1", "tag2"]
---

Your content here...
```

### Theming

The site supports dark and light modes. Theme preference is stored in localStorage and respects the user's system preference.

## Commands

| Command       | Action                                      |
|---------------|---------------------------------------------|
| `pnpm dev`    | Start dev server at `localhost:4321`        |
| `pnpm build`  | Build for production to `./dist/`           |
| `pnpm preview`| Preview production build locally            |
| `pnpm check`  | Check TypeScript and Astro components       |

## Migration Notes

This site was migrated from Next.js (v4) to Astro (v5). Key changes:

1. **Server-first architecture**: Components render static HTML by default
2. **Islands architecture**: Only interactive components (like ThemeToggle) load React
3. **Content collections**: Blog posts use Astro's built-in content collections
4. **Simplified routing**: File-based routing without route groups

## License

MIT - See [LICENSE](LICENSE) for details.
