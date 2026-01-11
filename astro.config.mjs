import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://jarema.me',
  trailingSlash: 'ignore',
  output: 'static',
  adapter: vercel(),

  experimental: {
    csp: {
      directives: [
        "default-src 'none'",
        "connect-src 'self' jarema.me z.is-a.dev ws.audioscrobbler.com api-gateway.umami.dev cloud.umami.is cusdis.com vercel.live",
        "font-src 'self'",
        "frame-src jarema.atabook.org vercel.live",
        "img-src 'self' https: *.ytimg.com *.rcd.gg *.googleusercontent.com *.githubusercontent.com moods.imood.com lastfm.freetls.fastly.net",
        "manifest-src 'self'",
        "media-src 'self'",
        "object-src 'none'",
        "worker-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'self' geekring.net kagi.com",
        'upgrade-insecure-requests',
      ],
      scriptDirective: {
        resources: ["'self'", 'cusdis.com', 'cloud.umami.is', 'https://vercel.live'],
      },
      styleDirective: {
        resources: ["'self'", 'cusdis.com', 'https://vercel.live'],
      },
    },
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    mdx(),
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
