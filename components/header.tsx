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
import { useViewport } from "@/hooks/use-viewport"
import { useMounted } from "@/hooks/use-mounted"
import { NAV_ITEMS } from "@/lib/constants"

/**
 * Header component with responsive navigation
 * @returns {JSX.Element|null} The header component or null if not mounted
 */
export function Header() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const mounted = useMounted()
  const [overflowIndex, setOverflowIndex] = useState<number | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([])
  const { windowWidth } = useViewport()

  // Memoize navigation items to prevent recreation on every render
  const navItems = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        href: item.href,
        label: t(`nav.${item.key}`, item.key.charAt(0).toUpperCase() + item.key.slice(1)),
      })),
    [t]
  )

  // Memoize isActive function
  const isActive = useCallback(
    (path: string) => {
      if (path === "/" && pathname !== "/") return false
      return pathname === path || pathname.startsWith(`${path}/`)
    },
    [pathname]
  )

  useEffect(() => {
    if (!mounted) return

    const calculateOverflow = () => {
      if (windowWidth < 768 || windowWidth >= 1280 || !navRef.current) {
        setOverflowIndex(null)
        return
      }

      const containerWidth = document.querySelector(".container")?.clientWidth || 0
      const availableWidth = containerWidth - 120 - 150 - 48 - 16

      if (availableWidth <= 0) {
        setOverflowIndex(0)
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

      setOverflowIndex(totalWidth <= availableWidth ? null : breakIndex < navItems.length ? breakIndex : null)
    }

    const timer = setTimeout(calculateOverflow, 50)
    window.addEventListener("resize", calculateOverflow)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("resize", calculateOverflow)
    }
  }, [mounted, windowWidth])

  if (!mounted) return null

  // Only apply overflow logic for tablet sizes
  const isTabletSize = windowWidth >= 768 && windowWidth < 1280
  const visibleItems = isTabletSize && overflowIndex !== null ? navItems.slice(0, overflowIndex) : navItems
  const overflowItems = isTabletSize && overflowIndex !== null ? navItems.slice(overflowIndex) : []

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="relative size-8 overflow-hidden">
              <Image src="/favicons.svg" alt="Jarema Logo" width={32} height={32} className="size-8" />
            </div>
            <span className="font-heading font-bold text-lg hidden sm:inline-block">Jarema</span>
          </Link>

          <div ref={navRef} className="hidden md:flex items-center ml-6 overflow-hidden">
            <div className="flex items-center gap-6 overflow-hidden">
              {visibleItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-nav-item="true"
                  ref={(el) => (itemsRef.current[index] = el)}
                  className={`text-sm transition-colors hover:text-primary whitespace-nowrap ${
                    isActive(item.href) ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div
                      className="h-0.5 bg-primary mt-0.5"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {overflowItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-1 flex-shrink-0">
                    <MoreHorizontal className="h-5 w-5" />
                    <span className="sr-only">More pages</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm">
                  {overflowItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className={`w-full ${isActive(item.href) ? "font-medium" : ""}`}>
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1">
            <LanguageToggle />
            <ThemeToggle />
            <MusicToggle />
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 py-6">
                <div className="grid gap-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`text-sm transition-colors hover:text-primary ${
                        isActive(item.href) ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
