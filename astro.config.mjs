import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel';
import netlify from '@astrojs/netlify';

const adapter = process.env.NETLIFY ? netlify() : vercel();

// https://astro.build/config
export default defineConfig({
  site: 'https://jarema.me',
  trailingSlash: 'ignore',
  output: 'static',
  adapter,

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    preact({ compat: true }),
  ],

  // Image optimization
  image: {
    domains: ['moods.imood.com', 'ytimg.com', 'rcd.gg'],
  },

  vite: {
    ssr: {
      noExternal: ['lucide-preact'],
    },
  },

  // Build output optimization
  build: {
    format: 'directory',
    inlineStylesheets: 'auto',
  },
});
