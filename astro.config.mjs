import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://jarema.me',
  trailingSlash: 'ignore',
  output: 'static',
  adapter: vercel(),

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],

  // Image optimization
  image: {
    domains: ['moods.imood.com', 'ytimg.com', 'rcd.gg'],
  },

  vite: {
    ssr: {
      noExternal: ['lucide-react'],
    },
  },

  // Build output optimization
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
});
