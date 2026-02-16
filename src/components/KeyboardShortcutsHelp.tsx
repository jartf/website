// KeyboardShortcutsHelp - Dialog showing all keyboard shortcuts
// Ported from Next.js v4

import { useState, useEffect, useCallback } from "react";
import { Keyboard, X } from "lucide-react";
import { useStore } from "@nanostores/react";
import { languageStore, t as i18nT } from "@/i18n";
import { routes } from "@/lib/constants";

// Inline KeyboardShortcut component
const KeyboardShortcut = ({ children }: { children: React.ReactNode }) => (
  <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border border-border font-mono">
    {children}
  </kbd>
);

interface ShortcutItem {
  key: string;
  description: string;
}

interface ShortcutCategory {
  title: string;
  shortcuts: ShortcutItem[];
}

export function KeyboardShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lang = useStore(languageStore);
  void lang;

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = (key: string, fallback?: string): string => {
    const translated = i18nT(key);
    return translated === key ? fallback || key : translated;
  };

  // Determine page type for context-specific shortcuts
  const [pathname, setPathname] = useState("");
  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  const isGamePage = pathname.includes(routes.game2048) || pathname.includes(routes.tetris);
  const isProjectsPage = pathname.includes(routes.projects);
  const isAboutPage = pathname.includes(routes.about);
  const isNowPage = pathname.includes(routes.now);
  const isUsesPage = pathname.includes(routes.uses);
  const isColophonPage = pathname.includes(routes.colophon);
  const isBlogPage = pathname.includes(routes.blog);
  const isBlogPostPage = pathname.includes(routes.blog) && pathname !== routes.blog && pathname !== routes.blog;

  // Handle keyboard shortcut to open dialog
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement ||
      document.activeElement?.getAttribute("contenteditable") === "true"
    ) {
      return;
    }

    if (e.key === ",") {
      e.preventDefault();
      setOpen(true);
    }
    if (e.key === "Escape" && open) {
      setOpen(false);
    }
  }, [open]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Define shortcuts
  const navigationShortcuts: ShortcutCategory = {
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
  };

  const actionShortcuts: ShortcutCategory = {
    title: t("keyboardShortcuts.actions", "Actions"),
    shortcuts: [
      { key: "y", description: t("keyboardShortcuts.cycleLanguage","Cycle through languages") },
      { key: "m", description: t("keyboardShortcuts.cycleTheme", "Cycle through themes") },
      { key: "r", description: t("keyboardShortcuts.refreshCat", "Refresh mood cat") },
      { key: ".", description: t("keyboardShortcuts.actionSearch", "Open Action Search") },
    ],
  };

  const projectCardShortcuts: ShortcutCategory = {
    title: "Project cards",
    shortcuts: [
      { key: "1-9", description: "Flip project card" },
      { key: "Esc", description: "Close flipped card" },
      { key: "←→", description: "Navigate between cards" },
      { key: "↑↓", description: "Navigate/scroll content" },
    ],
  };

  const aboutPageShortcuts: ShortcutCategory = {
    title: "About page chapters",
    shortcuts: [{ key: "1-5", description: "Jump to chapter" }],
  };

  const nowPageShortcuts: ShortcutCategory = {
    title: "Now page categories",
    shortcuts: [{ key: "1-7", description: "Jump to category" }],
  };

  const usesPageShortcuts: ShortcutCategory = {
    title: "Uses page categories",
    shortcuts: [{ key: "1-9, 0, -", description: "Jump to category" }],
  };

  const colophonPageShortcuts: ShortcutCategory = {
    title: "Colophon page sections",
    shortcuts: [{ key: "1-4", description: "Jump to section" }],
  };

  const blogListShortcuts: ShortcutCategory = {
    title: "Blog list navigation",
    shortcuts: [
      { key: "j", description: "Next post" },
      { key: "k", description: "Previous post" },
      { key: "1-9", description: "Jump to post" },
      { key: "Enter", description: "Read post" },
      { key: "s", description: "Focus search" },
    ],
  };

  const blogPostShortcuts: ShortcutCategory = {
    title: "Blog post navigation",
    shortcuts: [
      { key: "h", description: "Previous post" },
      { key: "l", description: "Next post" },
      { key: "b", description: "Back to blog list" },
    ],
  };

  const gamePageShortcuts: ShortcutCategory = {
    title: "Game controls",
    shortcuts: [
      { key: "h", description: t("keyboardShortcuts.home", "Home") },
      { key: "m", description: t("keyboardShortcuts.cycleTheme", "Cycle through themes") },
      { key: "y", description: t("keyboardShortcuts.cycleLanguage", "Cycle through languages") },
    ],
  };

  // Determine which shortcuts to show
  const shortcutCategories: ShortcutCategory[] = [];

  if (isGamePage) {
    shortcutCategories.push(gamePageShortcuts);
  } else {
    shortcutCategories.push(navigationShortcuts, actionShortcuts);
    if (isProjectsPage) shortcutCategories.push(projectCardShortcuts);
    if (isAboutPage) shortcutCategories.push(aboutPageShortcuts);
    if (isNowPage) shortcutCategories.push(nowPageShortcuts);
    if (isUsesPage) shortcutCategories.push(usesPageShortcuts);
    if (isColophonPage) shortcutCategories.push(colophonPageShortcuts);
    if (isBlogPage && !isBlogPostPage) shortcutCategories.push(blogListShortcuts);
    if (isBlogPostPage) shortcutCategories.push(blogPostShortcuts);
  }

  if (!mounted) return null;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
        aria-label={t("footer.keyboardShortcuts", "Keyboard Shortcuts")}
      >
        <Keyboard className="h-4 w-4" />
      </button>

      {/* Dialog backdrop and content */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog content */}
          <div className="relative bg-background border rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">
                {t("keyboardShortcuts.title", "Keyboard Shortcuts")}
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 hover:bg-muted transition-colors"
                aria-label={t("keyboardShortcuts.close", "Close")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
              {isGamePage && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {t("keyboardShortcuts.gamePageNotice","Most keyboard shortcuts are disabled in game pages to avoid conflicts with game controls.")}
                  </p>
                </div>
              )}

              {shortcutCategories.map((category, index) => (
                <div key={index}>
                  <h3 className="text-sm font-medium mb-2">{category.title}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {category.shortcuts.map((shortcut, shortcutIndex) => (
                      <div key={shortcutIndex} className="flex items-center gap-2">
                        <KeyboardShortcut>{shortcut.key}</KeyboardShortcut>
                        <span className="text-sm">{shortcut.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
