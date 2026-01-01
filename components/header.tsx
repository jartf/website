"use client"

import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { MusicToggle } from "@/components/music-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useViewport, useMounted } from "@/hooks"
import { NAV_ITEMS } from "@/lib/constants"

// Static fallback labels for when JS is disabled
const STATIC_NAV_LABELS: Record<string, string> = {
  home: "Home",
  about: "About",
  projects: "Projects",
  blog: "Blog",
  now: "Now",
  uses: "Uses",
  contact: "Contact",
  guestbook: "Guestbook",
  colophon: "Colophon",
  webring: "Webrings",
}

// Memoized nav link component to prevent re-renders
const NavLink = memo(function NavLink({
  href,
  label,
  isActive,
  showIndicator,
}: {
  href: string
  label: string
  isActive: boolean
  showIndicator: boolean
}) {
  return (
    <Link
      href={href}
      data-nav-item="true"
      className={`text-sm transition-colors hover:text-primary whitespace-nowrap ${
        isActive ? "text-foreground font-medium" : "text-muted-foreground"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
      {showIndicator && isActive && (
        <div
          className="h-0.5 bg-primary mt-0.5 animate-nav-indicator"
          aria-hidden="true"
        />
      )}
    </Link>
  )
})

/**
 * Header component with responsive navigation
 * Renders static content first for no-JS support, then enhances with JS
 * @returns {JSX.Element} The header component
 */
export function Header() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const mounted = useMounted()
  const [overflowIndex, setOverflowIndex] = useState<number | null>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const { windowWidth } = useViewport()

  // Memoize navigation items - use translated labels when mounted, static labels otherwise
  const navItems = useMemo(
    () =>
      // Exclude the "projects" nav item from the header
      NAV_ITEMS.filter((item) => item.key !== "projects").map((item) => ({
        href: item.href,
        label: mounted
          ? t(`nav.${item.key}`, STATIC_NAV_LABELS[item.key] || item.key.charAt(0).toUpperCase() + item.key.slice(1))
          : STATIC_NAV_LABELS[item.key] || item.key.charAt(0).toUpperCase() + item.key.slice(1),
      })),
    [t, mounted]
  )

  // Memoize isActive function
  const isActive = useCallback(
    (path: string) => {
      if (!pathname) return false
      if (path === "/" && pathname !== "/") return false
      return pathname === path || pathname.startsWith(`${path}/`)
    },
    [pathname]
  )

  // Stable overflow calculation using ResizeObserver to avoid forced reflows
  // This prevents loops by always measuring the same set of items
  useEffect(() => {
    if (!mounted || !measureRef.current) return

    // Skip for mobile or large desktop
    if (windowWidth < 768 || windowWidth >= 1280) {
      queueMicrotask(() => setOverflowIndex(null))
      return
    }

    const container = document.querySelector(".container")
    if (!container) return

    let rafId: number | null = null

    const calculateOverflow = () => {
      if (!measureRef.current) return

      const containerWidth = container.getBoundingClientRect().width
      // Logo (~120px) + toggles (~150px) + dropdown button (~48px) + gaps (~16px)
      const availableWidth = containerWidth - 120 - 150 - 48 - 16

      if (availableWidth <= 0) {
        setOverflowIndex(0)
        return
      }

      // Measure ALL items from the hidden measurement container (always renders all items)
      const items = Array.from(measureRef.current.querySelectorAll('[data-measure-item="true"]'))
      let totalWidth = 0
      let breakIndex: number | null = null

      for (let i = 0; i < items.length; i++) {
        const itemWidth = (items[i] as HTMLElement).getBoundingClientRect().width
        totalWidth += itemWidth + (i > 0 ? 24 : 0) // 24px = gap-6
        if (totalWidth > availableWidth && breakIndex === null) {
          breakIndex = i
        }
      }

      // Only update if value actually changed
      setOverflowIndex(prev => (prev === breakIndex ? prev : breakIndex))
    }

    // Use ResizeObserver to avoid forced reflows during initial load
    const resizeObserver = new ResizeObserver(() => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      rafId = requestAnimationFrame(calculateOverflow)
    })

    resizeObserver.observe(container)

    // Initial calculation after a slight delay to avoid blocking initial render
    setTimeout(calculateOverflow, 0)

    return () => {
      resizeObserver.disconnect()
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [mounted, windowWidth, navItems]) // Include navItems since labels affect widths

  // Only apply overflow logic for tablet sizes when mounted
  const isTabletSize = mounted && windowWidth >= 768 && windowWidth < 1280
  const visibleItems = isTabletSize && overflowIndex !== null ? navItems.slice(0, overflowIndex) : navItems
  const overflowItems = isTabletSize && overflowIndex !== null ? navItems.slice(overflowIndex) : []

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      {/* Hidden measurement container - always renders ALL items for stable measurement */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="absolute -left-[9999px] flex items-center gap-6 text-sm whitespace-nowrap"
        style={{ visibility: 'hidden', pointerEvents: 'none' }}
      >
        {navItems.map((item) => (
          <span key={item.href} data-measure-item="true">
            {item.label}
          </span>
        ))}
      </div>

      <div className="container flex h-16 items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 h-card" aria-label="Homepage">
            <div className="relative size-8 overflow-hidden">
              <Image src="/favicon.svg" alt="Logo" width={32} height={32} className="size-8 u-photo" aria-hidden="true" />
            </div>
            <span className="font-heading font-bold text-lg hidden sm:inline-block p-name">Jarema</span>
          </Link>

          <nav className="hidden md:flex items-center ml-6 overflow-hidden" aria-label="Main navigation">
            <div className="flex items-center gap-6 overflow-hidden">
              {visibleItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  isActive={isActive(item.href)}
                  showIndicator={mounted}
                />
              ))}
            </div>

            {mounted && overflowItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-1 flex-shrink-0" aria-label="More navigation pages" aria-haspopup="menu">
                    <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm" role="menu" aria-label="Additional pages">
                  {overflowItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild role="menuitem">
                      <Link
                        href={item.href}
                        className={`w-full ${isActive(item.href) ? "font-medium" : ""}`}
                        aria-current={isActive(item.href) ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* JS-only interactive controls */}
          {mounted && (
            <div className="flex items-center gap-1">
              <LanguageToggle />
              <ThemeToggle />
              <MusicToggle />
            </div>
          )}

          {/* Mobile menu - only show when mounted since Sheet requires JS */}
          {mounted && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu" aria-haspopup="dialog">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" aria-label="Navigation menu">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">Main site navigation links</SheetDescription>
                <nav className="grid gap-6 py-6" aria-label="Mobile navigation">
                  <div className="grid gap-3">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`text-sm transition-colors hover:text-primary ${
                          isActive(item.href) ? "text-foreground font-medium" : "text-muted-foreground"
                        }`}
                        aria-current={isActive(item.href) ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          )}

          {/* No-JS mobile navigation fallback */}
          <noscript>
            <nav className="md:hidden" aria-label="Mobile navigation">
              <details className="relative">
                <summary className="list-none cursor-pointer p-2 rounded hover:bg-muted">
                  <Menu className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Open navigation menu</span>
                </summary>
                <div className="absolute right-0 top-full mt-2 bg-background border rounded-md shadow-lg p-4 min-w-[160px] z-50">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2 text-sm hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            </nav>
          </noscript>
        </div>
      </div>
    </header>
  )
}
