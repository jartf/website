/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-i18next', 'date-fns'],
  },

  // Output configuration
  output: 'standalone',

  // Use trailing slashes for better compatibility with archivers like Wayback Machine
  trailingSlash: true,

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    unoptimized: true,
    minimumCacheTTL: 60,
  },

  // Compression
  compress: true,

  // Production source maps (disable for smaller bundles)
  productionBrowserSourceMaps: false,

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Xss-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin',
          },
          {
            key: 'Feature-Policy',
            value: "geolocation 'none'; microphone 'none'; camera 'none'",
          },
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=(), browsing-topics=(), camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'none'",
              "connect-src 'self' jarema.me ws.audioscrobbler.com api-gateway.umami.dev scripts.simpleanalyticscdn.com",
              "font-src 'self' fonts.gstatic.com cdn.jsdelivr.net",
              "frame-src jarema.atabook.org",
              "img-src 'self' https: *.ytimg.com *.rcd.gg *.googleusercontent.com *.githubusercontent.com moods.imood.com queue.simpleanalyticscdn.com",
              "manifest-src 'self'",
              "media-src 'self'",
              "object-src 'none'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "worker-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self' geekring.net kagi.com",
              "upgrade-insecure-requests",
            ].join('; '),
          },
          {
            key: 'Server',
            value: 'Jarema',
          },
        ],
      },
    ]
  },
}

export default nextConfig
