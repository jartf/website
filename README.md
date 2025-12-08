# Personal website

This is my personal website, a mix of blog, portfolio, and experimental space. It is built with Next.js, React, Tailwind CSS, shadcn/ui, Framer Motion, react-i18next, and TypeScript.
I originally made it for myself to share what I am learning, share my thoughts, and store my projects. I like to think of it as a digital garden.

## Features

- **Blog**: Where I write long-form posts about technology, economics, culture, and personal experiences
  - Markdown-based with frontmatter support
  - Nested directory structure
  - Reading time estimates and mood indicators
- **Projects**: Portfolio showcasing open-source work and personal projects
- **Multilingual support**: Fully internationalized using `react-i18next`
  - 12 languages: English, Vietnamese, Vietnamese Hán-Nôm, Estonian, Russian, Danish, Turkish, Chinese, Polish, Swedish, Finnish, and Toki Pona
  - Language detection and toggle
  - Synchronous i18n loading
- **Dark mode by default**: Eye-friendly theming with `next-themes`, because nobody wants to burn their eyes at 2 am
- **Responsive design**: Optimized for all screen sizes
- **Keyboard navigation**: Global shortcuts for quick navigation
- **Live activity**: Real-time Last.fm listening status and Discord presence via PreMID
- **Security**: Comprehensive security headers configured in `next.config.mjs`

## Getting started

If you want to run this project locally, it only takes a few steps.

### Prerequisites

- Node.js (v18 or higher)
- `pnpm` (or `npm`, or any other package manager you prefer)

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/jartf/website-v4.git
   ```

2. Navigate to the project directory (if not already in it)

   ```sh
   cd website-v4
   ```

3. Install dependencies

   ```sh
   pnpm install
   ```

4. Start the development server

   ```sh
   pnpm dev
   ```

The website should now be running at `http://localhost:3000`.

## Scripts

The main scripts are straightforward:

- `pnpm dev`: Runs the development server at `http://localhost:3000`
- `pnpm build`: Builds the project for production
- `pnpm start`: Starts the production server
- `pnpm lint`: Lints the codebase with ESLint
- `pnpm type-check`: Validates TypeScript

## Project structure

The project follows the Next.js 16 app router architecture:

```text
website-v4/
├── app/                      # Next.js App Router pages and layouts
│   ├── layout.jsx           # Root layout with providers, fonts, security headers
│   ├── page.jsx             # Homepage (server component)
│   ├── HomeClient.jsx       # Homepage interactive UI (client component)
│   ├── blog/                # Blog section
│   │   ├── page.tsx         # Server component (fetches posts)
│   │   ├── BlogList.tsx     # Client component (interactive list)
│   │   └── [...slug]/       # Dynamic blog post routes
│   └── {route}/             # Other pages follow same pattern
├── components/              # Reusable UI components
│   ├── ui/                  # shadcn/ui components (Button, Card, etc.)
│   ├── header.tsx           # Navigation with responsive overflow handling
│   ├── footer.jsx           # Site footer
│   ├── theme-provider.tsx   # Dark mode provider
│   └── i18n-provider.jsx    # Internationalization provider
├── content/                 # Content files
│   ├── blog/                # Markdown blog posts with frontmatter
│   ├── now-items.ts         # "Now" page content (multilingual)
│   ├── project-items.ts     # Project portfolio items
│   └── uses-items.tsx       # Tech stack and tools
├── hooks/                   # Custom React hooks
│   ├── use-mounted.js       # Prevents hydration mismatches
│   ├── use-viewport.js      # Responsive breakpoint detection
│   ├── use-current-language.js  # Get active i18n language
│   └── use-reduced-motion.js    # Respect user motion preferences
├── i18n/                    # Internationalization
│   └── i18n.jsx             # Synchronous i18n initialization (single source of truth)
├── lib/                     # Utility functions and shared code
│   ├── constants.js         # All global constants (languages, routes, shortcuts)
│   ├── blog.ts              # Blog post fetching and processing
│   ├── metadata.js          # SEO metadata generator
│   └── utils.ts             # General utilities
├── pages/api/               # API routes
│   ├── lastfm/              # Last.fm recent tracks feed
│   └── premid/              # PreMID Discord presence data
├── public/                  # Static assets
│   ├── fonts/               # Local fonts
│   ├── favicons.svg         # Site favicon
│   ├── robots.txt           # SEO crawler directives
│   ├── humans.txt           # Credits and tech stack
│   └── ai.txt               # AI crawler directives
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

3. Posts auto-sort by date (descending)

### Adding translations

1. Add keys to language files in `translations/`
2. Use nested objects for namespacing: `{ "nav": { "home": "Home" } }`
3. Test with the language switcher in the header
4. For content items (now, projects, uses), add translations to language properties

### Creating new pages

1. Create `app/{route}/page.{jsx,tsx}` as a Server Component
2. Create `app/{route}/*Client.{tsx,jsx}` for interactive UI
3. Use `generateMetadata()` from `lib/metadata.js` for metadata

### Custom hooks

- `useMounted()` - Prevents hydration mismatches for client-only features
- `useViewport()` - Responsive breakpoint detection
- `useCurrentLanguage()` - Get active i18n language
- `useReducedMotion()` - Respect user motion preferences

## Contributing

This repo is mostly for my own use, but I'm keeping it public for anyone curious. Feel free to explore, fork it, and dig through the code.
If you come across an issue or notice something that could be improved, feel free to open a pull request or issue.

## License

This project is distributed under the Unlicense license. See the `LICENSE` file for more information.
