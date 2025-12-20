"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Keyboard } from "lucide-react"
import { useTranslation } from "react-i18next"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { KeyboardShortcut } from "@/components/keyboard-shortcut"

/**
 * @typedef {Object} ShortcutItem
 * @property {string} key - The keyboard key or combination
 * @property {string} description - Description of what the shortcut does
 */

/**
 * @typedef {Object} ShortcutCategory
 * @property {string} title - Category title
 * @property {ShortcutItem[]} shortcuts - Array of shortcuts in this category
 */

export function KeyboardShortcutsHelp() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Determine page type for context-specific shortcuts
  const isGamePage = pathname?.includes("/2048") || pathname?.includes("/tetris")
  const isProjectsPage = pathname?.includes("/projects")
  const isAboutPage = pathname?.includes("/about")
  const isNowPage = pathname?.includes("/now")
  const isUsesPage = pathname?.includes("/uses")
  const isColophonPage = pathname?.includes("/colophon")
  const isBlogPage = pathname?.includes("/blog")
  const isBlogPostPage = pathname?.includes("/blog/") && pathname !== "/blog"

  // Handle keyboard shortcut to open dialog
  const handleKeyDown = useCallback((e) => {
    // Skip if user is typing in an input, textarea, or contentEditable element
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement ||
      (document.activeElement && document.activeElement.getAttribute("contenteditable") === "true")
    ) {
      return
    }

    if (e.key === ",") {
      e.preventDefault()
      setOpen(true)
    }
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Define common navigation shortcuts
  const navigationShortcuts = {
    title: t("keyboardShortcuts.navigation", "Navigation"),
    shortcuts: [
      { key: "h", description: t("keyboardShortcuts.home", "Home") },
      { key: "a", description: t("keyboardShortcuts.about", "About") },
      { key: "b", description: t("keyboardShortcuts.blog", "Blog") },
      { key: "p", description: t("keyboardShortcuts.projects", "Projects") },
      { key: "n", description: t("keyboardShortcuts.now", "Now") },
      { key: "u", description: t("keyboardShortcuts.uses", "Uses") },
      { key: "c", description: t("keyboardShortcuts.contact", "Contact") },
      { key: "g", description: t("keyboardShortcuts.guestbook", "Guestbook") },
      { key: "l", description: t("keyboardShortcuts.colophon", "Colophon") },
      { key: "/", description: t("keyboardShortcuts.slashes", "Slashes") },
      { key: "d", description: t("keyboardShortcuts.scrapbook", "Scrapbook") },
      { key: "t", description: t("keyboardShortcuts.tetris", "Tetris") },
      { key: "z", description: t("keyboardShortcuts.2048", "2048") },
      { key: ",", description: t("keyboardShortcuts.openShortcuts", "Open keyboard shortcuts") },
    ],
  }

  // Define common action shortcuts
  const actionShortcuts = {
    title: t("keyboardShortcuts.actions", "Actions"),
    shortcuts: [
      { key: "y", description: t("keyboardShortcuts.cycleLanguage", "Cycle through languages") },
      { key: "m", description: t("keyboardShortcuts.cycleTheme", "Cycle through themes") },
      { key: "r", description: t("keyboardShortcuts.refreshCat", "Refresh Mood Cat") },
      { key: ".", description: t("keyboardShortcuts.actionSearch", "Open Action Search") },
    ],
  }

  // Define project card shortcuts
  const projectCardShortcuts = {
    title: "Project Cards",
    shortcuts: [
      { key: "1-9", description: "Flip project card" },
      { key: "Esc", description: "Close flipped card" },
      { key: "←→", description: "Navigate between cards" },
      { key: "↑↓", description: "Navigate/scroll content" },
      { key: "Tab", description: "Navigate within flipped card" },
      { key: "Enter", description: "Activate focused element" },
    ],
  }

  // Define about page shortcuts
  const aboutPageShortcuts = {
    title: "About Page Chapters",
    shortcuts: [{ key: "1-5", description: "Jump to chapter" }],
  }

  // Define now page shortcuts
  const nowPageShortcuts = {
    title: "Now Page Categories",
    shortcuts: [{ key: "1-7", description: "Jump to category" }],
  }

  // Define uses page shortcuts
  const usesPageShortcuts = {
    title: "Uses Page Categories",
    shortcuts: [{ key: "1-9, 0, -", description: "Jump to category" }],
  }

  // Define colophon page shortcuts
  const colophonPageShortcuts = {
    title: "Colophon Page Sections",
    shortcuts: [{ key: "1-4", description: "Jump to section" }],
  }

  // Define blog list shortcuts
  const blogListShortcuts = {
    title: "Blog List Navigation",
    shortcuts: [
      { key: "j", description: "Next post" },
      { key: "k", description: "Previous post" },
      { key: "1-9", description: "Jump to post" },
      { key: "Enter", description: "Read post" },
      { key: "s", description: "Focus search" },
    ],
  }

  // Define blog post shortcuts
  const blogPostShortcuts = {
    title: "Blog Post Navigation",
    shortcuts: [
      { key: "h", description: "Previous post" },
      { key: "l", description: "Next post" },
      { key: "b", description: "Back to blog list" },
    ],
  }

  // Define game page shortcuts
  const gamePageShortcuts = {
    title: "Game Controls",
    shortcuts: [
      { key: "h", description: t("keyboardShortcuts.home", "Home") },
      { key: "m", description: t("keyboardShortcuts.cycleTheme", "Cycle through themes") },
      { key: "g", description: t("keyboardShortcuts.cycleLanguage", "Cycle through languages") },
    ],
  }

  // Determine which shortcut categories to show based on current page
  const shortcutCategories = []

  if (isGamePage) {
    shortcutCategories.push(gamePageShortcuts)
  } else {
    shortcutCategories.push(navigationShortcuts, actionShortcuts)

    if (isProjectsPage) shortcutCategories.push(projectCardShortcuts)
    if (isAboutPage) shortcutCategories.push(aboutPageShortcuts)
    if (isNowPage) shortcutCategories.push(nowPageShortcuts)
    if (isUsesPage) shortcutCategories.push(usesPageShortcuts)
    if (isColophonPage) shortcutCategories.push(colophonPageShortcuts)
    if (isBlogPage && !isBlogPostPage) shortcutCategories.push(blogListShortcuts)
    if (isBlogPostPage) shortcutCategories.push(blogPostShortcuts)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label={t("footer.keyboardShortcuts", "Keyboard Shortcuts")}
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("keyboardShortcuts.title", "Keyboard Shortcuts")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {isGamePage && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t(
                  "keyboardShortcuts.gamePageNotice",
                  "Most keyboard shortcuts are disabled in game pages to avoid conflicts with game controls.",
                )}
              </p>
            </div>
          )}

          {shortcutCategories.map((category, index) => (
            <div key={index}>
              <h3 className="text-sm font-medium mb-2">{category.title}</h3>
              <div className="grid grid-cols-2 gap-2">
                {category.shortcuts.map((shortcut, shortcutIndex) => (
                  <div key={shortcutIndex} className="flex items-center gap-2">
                    <KeyboardShortcut className="px-2 py-1">{shortcut.key}</KeyboardShortcut>
                    <span className="text-sm">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
