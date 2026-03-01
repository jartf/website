import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { retroRoutes } from '@/lib/constants'

/**
 * Detects ancient/legacy browsers that can't handle modern web technologies.
 * These browsers need the /retro version of the site.
 *
 * Detection criteria:
 * - Mosaic (1993) - No CSS, basic HTML
 * - Netscape Navigator 1-4 (1994-1997) - CSS1 only, basic JS
 * - Internet Explorer 1-5 (1995-1999) - Limited CSS, JScript
 * - Lynx, Links, w3m - Text-only browsers
 * - Other ancient or limited browsers
 */
function isLegacyBrowser(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()

  // Ancient browsers that need retro version
  const legacyPatterns = [
    // Mosaic and derivatives
    /mosaic/,
    /ncsa mosaic/,
    /spyglass/,

    // Netscape Navigator 1-4 (before Mozilla 5.0)
    /mozilla\/[1-4]\./,
    /netscape[1-4]/,
    /navigator\/[1-4]/,

    // Internet Explorer 1-5
    /msie [1-5]\./,

    // Text-only browsers (optional support)
    /lynx/,
    /links/,
    /w3m/,
    /elinks/,

    // Other ancient browsers
    /opera\/[1-6]\./,
    /konqueror\/[1-2]/,
    /icab\/[1-2]/,
    /seamonkey/,

    // Very old mobile browsers
    /nokia/,
    /ericsson/,
    /mot-/,
    /sie-/,

    // Curl, wget (command line tools)
    /curl\//,
    /wget\//,
    /libwww/,

    // Ancient search engine crawlers
    /infoseek/,
    /altavista/,
    /webcrawler/,
  ]

  // Check if any legacy pattern matches
  for (const pattern of legacyPatterns) {
    if (pattern.test(ua)) {
      return true
    }
  }

  // Also check for absence of modern browser indicators
  // If there's no Mozilla/5.0 and no modern browser engine, it's likely legacy
  const hasModernIndicator =
    ua.includes('mozilla/5.0') ||
    ua.includes('chrome') ||
    ua.includes('firefox') ||
    ua.includes('safari') ||
    ua.includes('edge') ||
    ua.includes('opera/') && parseFloat(ua.match(/opera\/(\d+)/)?.[1] || '0') >= 7

  // If user agent is very short or missing modern indicators, could be legacy
  if (!hasModernIndicator && ua.length < 50 && !ua.includes('bot')) {
    return true
  }

  return false
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get('user-agent') || ''

  // Handle retro routes - disable JavaScript via CSP
  if (pathname.startsWith('/retro')) {
    const response = NextResponse.next()

    // Set Content-Security-Policy to disable JavaScript execution
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'none'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' http: https:",
        "font-src 'self'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ')
    )

    return response
  }

  // Skip static files, API routes, and special routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||  // Files with extensions
    pathname.startsWith('/rss') ||
    pathname.startsWith('/atom') ||
    pathname.startsWith('/feed')
  ) {
    return NextResponse.next()
  }

  // Check for legacy browser
  if (isLegacyBrowser(userAgent)) {
    // Check if this route has a retro equivalent
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '')

    if (retroRoutes.includes(normalizedPath)) {
      // Redirect to retro version
      const retroUrl = new URL(`/retro${normalizedPath === '/' ? '' : normalizedPath}`, request.url)
      return NextResponse.redirect(retroUrl)
    }

    // For routes without retro equivalents, redirect to retro home with a notice
    const retroUrl = new URL('/retro', request.url)
    return NextResponse.redirect(retroUrl)
  }

  // Allow manual access to retro version via query parameter
  if (request.nextUrl.searchParams.get('retro') === 'true') {
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '')

    if (retroRoutes.includes(normalizedPath)) {
      const retroUrl = new URL(`/retro${normalizedPath === '/' ? '' : normalizedPath}`, request.url)
      return NextResponse.redirect(retroUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/).*)',
  ],
}
