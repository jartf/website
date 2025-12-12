"use client"

import { useCallback, memo } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, Laptop } from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"

const THEME_ICONS = {
  dark: Moon,
  light: Sun,
  system: Laptop
}

export const ThemeToggle = memo(function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const mounted = useMounted()

  // Memoize theme change handlers
  const handleLightTheme = useCallback(() => setTheme("light"), [setTheme])
  const handleDarkTheme = useCallback(() => setTheme("dark"), [setTheme])
  const handleSystemTheme = useCallback(() => setTheme("system"), [setTheme])

  if (!mounted) return null

  const Icon = THEME_ICONS[theme] || Laptop

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          aria-haspopup="menu"
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Toggle theme, current: {theme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" role="menu" aria-label="Theme options">
        <DropdownMenuItem onClick={handleLightTheme} role="menuitemradio" aria-checked={theme === "light"}>
          <Sun className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDarkTheme} role="menuitemradio" aria-checked={theme === "dark"}>
          <Moon className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSystemTheme} role="menuitemradio" aria-checked={theme === "system"}>
          <Laptop className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
