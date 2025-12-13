"use client"

import { useState, useEffect, useRef, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import { LanguageToggle } from "@/components/language-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { MusicToggle } from "@/components/music-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
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
  colophon: "Colophon",
}

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
  const navRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const { windowWidth } = useViewport()

  // Memoize navigation items - use translated labels when mounted, static labels otherwise
  const navItems = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
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

  useEffect(() => {
    if (!mounted) return

    const calculateOverflow = () => {
      // Early return for mobile or desktop sizes
      if (windowWidth < 768 || windowWidth >= 1280) {
        if (overflowIndex !== null) setOverflowIndex(null)
        return
      }

      if (!navRef.current) return

      const containerWidth = document.querySelector(".container")?.clientWidth || 0
      const availableWidth = containerWidth - 120 - 150 - 48 - 16

      if (availableWidth <= 0) {
        if (overflowIndex !== 0) setOverflowIndex(0)
        return
      }

      const navItems = Array.from(navRef.current.querySelectorAll('a[data-nav-item="true"]'))
      let totalWidth = 0
      let breakIndex = navItems.length

      for (let i = 0; i < navItems.length; i++) {
        totalWidth += (navItems[i] as HTMLElement).offsetWidth + (i > 0 ? 24 : 0)
        if (totalWidth > availableWidth) {
          breakIndex = i
          break
        }
      }

      const newIndex = totalWidth <= availableWidth ? null : breakIndex < navItems.length ? breakIndex : null
      if (newIndex !== overflowIndex) setOverflowIndex(newIndex)
    }

    // Use requestAnimationFrame for better performance
    let rafId: number | null = null
    const debouncedCalculate = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(calculateOverflow)
    }

    const timer = setTimeout(calculateOverflow, 50)
    window.addEventListener("resize", debouncedCalculate)
    return () => {
      clearTimeout(timer)
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener("resize", debouncedCalculate)
    }
  }, [mounted, windowWidth, overflowIndex])

  // Only apply overflow logic for tablet sizes when mounted
  const isTabletSize = mounted && windowWidth >= 768 && windowWidth < 1280
  const visibleItems = isTabletSize && overflowIndex !== null ? navItems.slice(0, overflowIndex) : navItems
  const overflowItems = isTabletSize && overflowIndex !== null ? navItems.slice(overflowIndex) : []

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80" aria-label="Homepage">
            <div className="relative size-8 overflow-hidden">
              <Image src="/favicons.svg" alt="Logo" width={32} height={32} className="size-8 u-photo" aria-hidden="true" />
            </div>
            <span className="font-heading font-bold text-lg hidden sm:inline-block">Jarema</span>
          </Link>

          <nav ref={navRef} className="hidden md:flex items-center ml-6 overflow-hidden" aria-label="Main navigation">
            <div className="flex items-center gap-6 overflow-hidden">
              {visibleItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-nav-item="true"
                  ref={(el) => { itemsRef.current[index] = el }}
                  className={`text-sm transition-colors hover:text-primary whitespace-nowrap ${
                    isActive(item.href) ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                  {mounted && isActive(item.href) && (
                    <motion.div
                      className="h-0.5 bg-primary mt-0.5"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", duration: 0.6 }}
                      aria-hidden="true"
                    />
                  )}
                </Link>
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
