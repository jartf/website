"use client"

import { memo } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, Laptop } from "lucide-react"
import { useMounted } from "@/hooks"

const THEMES = [
  { id: "light", icon: Sun, label: "Light" },
  { id: "dark", icon: Moon, label: "Dark" },
  { id: "system", icon: Laptop, label: "System" },
]

/** Theme toggle with CSS-first approach - no flash of wrong theme */
export const ThemeToggle = memo(function ThemeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme()
  const mounted = useMounted()

  const displayTheme = mounted ? (theme === "system" ? "system" : resolvedTheme) : "system"
  const Icon = THEMES.find(t => t.id === displayTheme)?.icon || Laptop

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle theme" aria-haspopup="menu">
          <Icon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Toggle theme{mounted ? `, current: ${theme}` : ""}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" role="menu" aria-label="Theme options">
        {THEMES.map(({ id, icon: ItemIcon, label }) => (
          <DropdownMenuItem key={id} onClick={() => setTheme(id)} role="menuitemradio" aria-checked={theme === id}>
            <ItemIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
})
