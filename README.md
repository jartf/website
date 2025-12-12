# Personal website

This is my personal website, a mix of blog, portfolio, and experimental space. It is built with Next.js, React, Tailwind CSS, shadcn/ui, Framer Motion, react-i18next, and TypeScript.
I originally made it for myself to share what I am learning, share my thoughts, and store my projects. I like to think of it as a digital garden.

## Features

- **Blog**: Long-form posts about technology, economics, culture, and personal experiences
  - Markdown-based with frontmatter support
  - Nested directory structure for organization
  - Reading time estimates, mood indicators, and related posts
  - RSS/Atom/JSON feeds for all posts and language-specific variants
- **Projects**: Portfolio showcasing open-source work and personal projects
- **Multilingual support**: Fully internationalized using `react-i18next`
  - 12 languages: English, Vietnamese, Vietnamese Hán-Nôm, Estonian, Russian, Danish, Turkish, Chinese, Polish, Swedish, Finnish, and Toki Pona
  - Language detection and toggle
  - Synchronous i18n loading
- **Dark mode by default**: Eye-friendly theming with `next-themes`, because nobody wants to burn their eyes at 2 am
- **Responsive design**: Optimized for mobile, tablet (768px), and desktop (1280px) breakpoints
- **Keyboard navigation**: Global shortcuts for quick navigation (see below)
- **Live activity**: Real-time Last.fm listening status and Discord presence via PreMID
- **Security**: Comprehensive security headers configured in `next.config.mjs`

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `h` | Go to Home |
| `a` | Go to About |
| `b` | Go to Blog |
| `p` | Go to Projects |
| `n` | Go to Now |
| `u` | Go to Uses |
| `c` | Go to Contact |
| `l` | Go to Colophon |
| `m` | Cycle theme |
| `g` | Cycle language |
| `r` | Refresh mood cat |
| `.` | Open command palette |

## Getting started

If you want to run this project locally, it only takes a few steps.

### Prerequisites

- Node.js (v18 or higher)
- `pnpm` (or `npm`, or any other package manager you prefer)

### Installation

1. Clone the repo:
   `
   git clone https://github.com/jartf/website-v4.git
   `

2. Navigate to the project directory (if not already in it):
   `
   cd website-v4
   `

3. Install dependencies:
   `
   pnpm install
   `

4. Start the development server:
   `
   pnpm dev
   `

The website should now be running at `http://localhost:3000`.

## Scripts

The main scripts are straightforward:

- `pnpm dev`: Runs the development server at `http://localhost:3000`
- `pnpm build`: Builds the project for production
- `pnpm start`: Starts the production server
- `pnpm lint`: Lints the codebase with ESLint
- `pnpm type-check`: Validates TypeScript

## Project structure

The project follows the Next.js 16 App Router architecture:

```text
website-v4/
├── app/                      # Next.js App Router pages and layouts
│   ├── layout.jsx           # Root layout with providers, fonts, security headers
│   ├── page.jsx             # Homepage (server component)
│   ├── HomeClientInteractive.jsx  # Homepage interactive UI (client component)
│   ├── globals.css          # Global styles
│   ├── blog/                # Blog section
│   │   ├── page.tsx         # Server component (fetches posts)
│   │   ├── BlogList.tsx     # Client component (interactive list)
│   │   └── [...slug]/       # Dynamic blog post routes
│   ├── {route}/             # Other pages follow same pattern
│   │   ├── page.tsx         # Server component - data fetching, metadata
│   │   └── *ClientWrapper.tsx  # Client component - interactivity only
│   ├── rss.xml/             # RSS feed route
│   ├── atom.xml/            # Atom feed route
│   └── feed.json/           # JSON feed route
├── components/              # Reusable UI components
│   ├── ui/                  # shadcn/ui components (button, card, etc.)
│   ├── header.tsx           # Navigation with responsive overflow handling
│   ├── footer.jsx           # Site footer
│   ├── theme-provider.tsx   # Dark mode provider
│   ├── i18n-provider.jsx    # Internationalization provider
│   ├── mood-cat.tsx         # Interactive mood cat component
│   └── keyboard-navigation.jsx  # Global keyboard shortcuts handler
├── content/                 # Content files (multilingual)
│   ├── blog/                # Markdown blog posts with frontmatter
│   ├── now-items.ts         # "Now" page content
│   ├── project-items.ts     # Project portfolio items
│   └── uses-items.tsx       # Tech stack and tools
├── hooks/                   # Custom React hooks
│   └── index.ts             # All hooks exported from single file
├── i18n/                    # Internationalization
│   └── i18n.jsx             # Synchronous i18n initialization (single source of truth)
├── lib/                     # Utility functions and shared code
│   ├── constants.js         # Languages, routes, keyboard shortcuts, themes
│   ├── blog.ts              # Blog post fetching and processing
│   ├── metadata.js          # SEO metadata generator
│   ├── feed.ts              # RSS/Atom/JSON feed generation
│   └── utils.ts             # General utilities
├── pages/api/               # API routes
│   ├── lastfm/              # Last.fm recent tracks feed
│   └── premid/              # PreMID Discord presence data
├── public/                  # Static assets
│   ├── fonts/               # Local fonts
│   ├── favicons.svg         # Site favicon
│   ├── robots.txt           # SEO crawler directives
│   ├── humans.txt           # Credits and tech stack
│   ├── ai.txt               # AI crawler directives
│   └── site.webmanifest     # PWA manifest
├── translations/            # i18n translation files (JSON)
│   ├── en.json              # English
│   ├── vi.json              # Vietnamese
│   ├── vi-Hani.json         # Vietnamese Hán-Nôm
│   └── {lang}.json          # Other languages
├── next.config.mjs          # Next.js config with security headers
├── tailwind.config.ts       # Tailwind CSS 4 configuration
└── tsconfig.json            # TypeScript configuration
```

## Development guide

### Adding blog posts

1. Create a markdown file in `content/blog/` (supports nested folders)
2. Add frontmatter with required fields:

   ```yaml
   ---
   title: "Post title"
   excerpt: "Description"
   date: "2025-12-07"
   mood: "hmm"
   catApproved: false/true
   readingTime: 5
   language: "en"
   tags: ["technology", "economics"]
   category: "tech"
   ---
   ```

3. Posts auto-sort by date (descending) and are fetched via `getAllBlogPosts()` from `lib/blog.ts`

### Adding translations

1. Add keys to language files in `translations/`
2. Use nested objects for namespacing: `{ "nav": { "home": "Home" } }`
3. Access via: `const { t } = useTranslation()` then `t('nav.home')`
4. For content items (now, projects, uses), provide language keys:

   ```typescript
   {
     en: { title: "...", description: "..." },
     vi: { ... },
     et: { ... },
     // ... languages: en, vi, et, ru, da, zh, tr, pl, sv, fi, tok, vih
   }
   ```

5. Test with the language switcher in the header

### Creating new pages

1. Create `app/{route}/page.{jsx,tsx}` as a Server Component
2. Use `generateMetadata()` from `lib/metadata.js` for SEO:

   ```javascript
   import { generateMetadata } from "@/lib/metadata"

   export const metadata = generateMetadata({
     title: "Page Title",
     description: "...",
     path: "route",  // optional
   })
   ```

3. Create `app/{route}/*ClientWrapper.tsx` for interactive UI (only if needed)
4. Add route to `lib/constants.js` `ROUTES` if needed
5. Add keyboard shortcut to `KEYBOARD_SHORTCUTS` if appropriate

### Custom hooks

All hooks are exported from `hooks/index.ts`:

| Hook | Purpose |
|------|---------|
| `useMounted()` | **Required** for client-only rendering to avoid hydration mismatches |
| `useViewport()` | Debounced responsive breakpoint detection (`isMobile`, `isTablet`, `isDesktop`) |
| `useCurrentLanguage()` | Normalized language code from i18n |
| `useReducedMotion()` | Respects user's motion preferences for animations |
| `useKeyboardNavigation()` | Global keyboard shortcuts (auto-initialized in layout) |
| `usePlatform()` | OS and device detection (`isMac`, `isWindows`, `isMobile`, etc.) |
| `useDebounce()` | Debounced value hook |
| `useLanguageTracker()` | Track visited languages (for easter egg) |

### Hydration-safe pattern

Always use `useMounted()` for client-only features:

```tsx
const mounted = useMounted()
if (!mounted) return <StaticFallback />
return <InteractiveComponent />
```

## Testing & debugging

- Check `http://localhost:3000` with JS disabled to verify site working without JS
- Use `pnpm lint` and `pnpm type-check` to validate code quality
- Use browser DevTools > Lighthouse for performance/accessibility audits
- Verify translations by switching languages via header dropdown or pressing `g`
- Test keyboard shortcuts (`h`, `b`, `p`, `n`, `m`, `g`, etc.)
- Check responsive behavior at 768px (tablet) and 1280px (desktop) breakpoints

## Contributing

This repo is mostly for my own use, but I'm keeping it public for anyone curious. Feel free to explore, fork it, and dig through the code.
If you come across an issue or notice something that could be improved, feel free to open a pull request or issue.

### What NOT to do

- ❌ Don't use async i18n loading or `<Suspense>` for translations
- ❌ Don't mark components as `"use client"` unless they use hooks, state, or events
- ❌ Don't modify shadcn/ui components in `components/ui/` directly
- ❌ Don't forget `useMounted()` for client-only content
- ❌ Don't use `next/image` unoptimized prop unless required

## License

This project is distributed under the Unlicense license. See the `LICENSE` file for more information.
