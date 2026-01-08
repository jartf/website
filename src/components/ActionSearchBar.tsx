// ActionSearchBar - Command palette / Quick actions search
// Ported from Next.js v4

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useStore } from "@nanostores/react";
import { languageStore, setLanguage, initLanguage, supportedLanguages, translations, type SupportedLanguage } from "@/i18n";
import {
  Search, Home, User, Code, BookOpen, Clock, Wrench, Mail, FileText,
  Moon, Sun, Languages, RefreshCw, Gamepad2, Slash, KeyRound, FlipHorizontal,
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, X, Coffee, Headphones, Brain,
  GraduationCap, Lightbulb, Laptop, Smartphone, Globe, Shield, Settings,
  Map, ImageIcon, Palette, Server, Tag, MessagesSquare, Calendar,
} from "lucide-react";

// Inline KeyboardShortcut component
const KeyboardShortcut = ({ children }: { children: React.ReactNode }) => (
  <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded border border-border font-mono">
    {children}
  </kbd>
);

// Inline useDebounce hook
function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

// Helpers
const dispatchKey = (key: string) => document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
const scrollTo = (id: string, block: ScrollLogicalPosition = "start") => {
  const el = document.getElementById(id) || document.querySelector(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block });
    el.classList.add("ring-2", "ring-primary", "ring-offset-2");
    setTimeout(() => el.classList.remove("ring-2", "ring-primary", "ring-offset-2"), 1000);
  }
};

interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  category: string;
  action: () => void;
  description?: string;
  showOn?: string[];
}

export function ActionSearchBar() {
  const [theme, setThemeState] = useState<string>("dark");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [pathname, setPathname] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 200);
  const lang = useStore(languageStore);

  useEffect(() => {
    initLanguage();
    setMounted(true);
    setPathname(window.location.pathname);
    setThemeState(localStorage.getItem("theme") || "dark");
  }, []);

  const setTheme = useCallback((newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.remove("light", "dark");
    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.classList.add(systemTheme);
      document.documentElement.style.colorScheme = systemTheme;
    } else {
      document.documentElement.classList.add(newTheme);
      document.documentElement.style.colorScheme = newTheme;
    }
  }, []);

  const t = useCallback((key: string, fallbackOrParams?: string | Record<string, any>): string => {
    const trans = translations[lang] || translations.en;
    const keys = key.split(".");
    let value: any = trans;
    for (const k of keys) {
      value = value?.[k];
    }
    if (typeof value !== "string") {
      return typeof fallbackOrParams === "string" ? fallbackOrParams : key;
    }
    // Handle interpolation like {{title}}
    if (typeof fallbackOrParams === "object") {
      for (const [paramKey, paramValue] of Object.entries(fallbackOrParams)) {
        value = value.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, "g"), String(paramValue));
        }
      }
      return value;
  }, [lang]);

  // Build all actions
  const allActions = useMemo(() => {
    const isPage = (p: string) => pathname?.includes(p);
    const close = () => setOpen(false);
    const nav = (path: string) => () => { window.location.href = path; close() };

    // Navigation actions
    const navItems: Action[] = [
      {
        id: "home",
        label: t("nav.home", "Home"),
        icon: <Home className="h-4 w-4 text-primary" />,
        shortcut: "h",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: nav("/"),
      },
      {
        id: "about",
        label: t("nav.about", "About"),
        icon: <User className="h-4 w-4 text-primary" />,
        shortcut: "a",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: nav("/about/"),
      },
      {
        id: "projects",
        label: t("nav.projects", "Projects"),
        icon: <Code className="h-4 w-4 text-primary" />,
        shortcut: "p",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: nav("/projects/"),
      },
      {
        id: "blog",
        label: t("nav.blog", "Blog"),
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        shortcut: "b",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: nav("/blog/"),
      },
      {
        id: "now",
        label: t("nav.now", "Now"),
        icon: <Clock className="h-4 w-4 text-primary" />,
        shortcut: "n",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: nav("/now/"),
      },
      {
        id: "uses",
        label: t("nav.uses", "Uses"),
        icon: <Wrench className="h-4 w-4 text-primary" />,
        shortcut: "u",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: nav("/uses/"),
      },
      {
        id: "contact",
        label: t("nav.contact", "Contact"),
        icon: <Mail className="h-4 w-4 text-primary" />,
        shortcut: "c",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: nav("/contact/"),
      },
      {
        id: "guestbook",
        label: t("nav.guestbook", "Guestbook"),
        icon: <MessagesSquare className="h-4 w-4 text-primary" />,
        shortcut: "g",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: nav("/guestbook/"),
      },
      {
        id: "colophon",
        label: t("nav.colophon", "Colophon"),
        icon: <FileText className="h-4 w-4 text-primary" />,
        shortcut: "l",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: nav("/colophon/"),
      },
      {
        id: "webring",
        label: t("nav.webring", "Webrings"),
        icon: <FlipHorizontal className="h-4 w-4 text-primary" />,
        shortcut: "w",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: nav("/webrings/"),
      },
      {
        id: "scrapbook",
        label: t("nav.scrapbook", "Scrapbook"),
        icon: <Calendar className="h-4 w-4 text-primary" />,
        shortcut: "d",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: nav("/scrapbook/"),
      },
      {
        id: "slashes",
        label: "Slashes",
        icon: <Slash className="h-4 w-4 text-primary" />,
        shortcut: "/",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: nav("/slashes/"),
      },
    ];

    // Theme + language
    const themeActions: Action[] = [
      {
        id: "theme-toggle",
        label: theme === "dark" ? t("actionSearch.switchLightMode", "Light mode") : t("actionSearch.switchDarkMode", "Dark mode"),
        icon: theme === "dark" ? (<Sun className="h-4 w-4 text-yellow-500" />) : (<Moon className="h-4 w-4 text-blue-500" />),
        shortcut: "m",
        category: t("actionSearch.appearance", "Appearance"),
        action: () => { setTheme(theme === "dark" ? "light" : "dark"); close(); },
      },
      {
        id: "language-toggle",
        label: t("actionSearch.cycleLanguage", "Change language"),
        icon: <Languages className="h-4 w-4 text-green-500" />,
        shortcut: "y",
        category: t("blog.language", "Language"),
        action: () => {
          const codes = supportedLanguages.map((l) => l.code);
          const idx = codes.indexOf(lang);
          const nextIdx = idx === -1 ? 0 : (idx + 1) % codes.length;
          setLanguage(codes[nextIdx] as SupportedLanguage);
          close();
        },
      },
    ];

    // General actions
    const generalActions: Action[] = [
      {
        id: "refresh-cat",
        label: t("keyboardShortcuts.refreshCat", "Refresh mood cat"),
        icon: <RefreshCw className="h-4 w-4 text-purple-500" />,
        shortcut: "r",
        category: t("actionSearch.fun", "Fun"),
        action: () => {
          document
            .querySelector('button[aria-label="Refresh mood cat"]')
            ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
          close();
        },
      },
      {
        id: "tetris",
        label: t("actionSearch.tetris", "Play Tetris"),
        icon: <Gamepad2 className="h-4 w-4 text-red-500" />,
        shortcut: "t",
        category: t("actionSearch.games", "Games"),
        action: nav("/tetris/"),
      },
      {
        id: "2048",
        label: t("actionSearch.2048", "Play 2048"),
        icon: <Gamepad2 className="h-4 w-4 text-orange-500" />,
        shortcut: "z",
        category: t("actionSearch.games", "Games"),
        action: nav("/2048/"),
      },
      {
        id: "keyboard-shortcuts",
        label: t("keyboardShortcuts.openShortcuts", "Keyboard shortcuts"),
        icon: <KeyRound className="h-4 w-4 text-gray-500" />,
        shortcut: ",",
        category: t("actionSearch.help", "Help"),
        action: () => {
          dispatchKey(",");
          close();
        },
      },
    ];

    // Project page actions
    const projectActions: Action[] = !isPage("/projects")
      ? []
      : [
          {
            id: "close-card",
            label: t("actionSearch.projects.closeCard", "Close card"),
            icon: <X className="h-4 w-4 text-red-500" />,
            shortcut: "Esc",
            category: t("actionSearch.projects.category", "Projects"),
            action: () => {
              document
                .querySelector('.rotate-y-180 [id^="project-card-back-"]')
                ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
              close();
            },
            showOn: ["/projects"],
          },
          {
            id: "nav-left",
            label: t("actionSearch.projects.left", "Navigate left"),
            icon: <ArrowLeft className="h-4 w-4 text-blue-500" />,
            shortcut: "←",
            category: t("actionSearch.projects.category", "Projects"),
            action: () => {
              dispatchKey("ArrowLeft");
              close();
            },
            showOn: ["/projects"],
          },
          {
            id: "nav-right",
            label: t("actionSearch.projects.right", "Navigate right"),
            icon: <ArrowRight className="h-4 w-4 text-blue-500" />,
            shortcut: "→",
            category: t("actionSearch.projects.category", "Projects"),
            action: () => {
              dispatchKey("ArrowRight");
              close();
            },
            showOn: ["/projects"],
          },
          {
            id: "nav-up",
            label: t("actionSearch.projects.up", "Navigate up"),
            icon: <ArrowUp className="h-4 w-4 text-blue-500" />,
            shortcut: "↑",
            category: t("actionSearch.projects.category", "Projects"),
            action: () => {
              dispatchKey("ArrowUp");
              close();
            },
            showOn: ["/projects"],
          },
          {
            id: "nav-down",
            label: t("actionSearch.projects.down", "Navigate down"),
            icon: <ArrowDown className="h-4 w-4 text-blue-500" />,
            shortcut: "↓",
            category: t("actionSearch.projects.category", "Projects"),
            action: () => {
              dispatchKey("ArrowDown");
              close();
            },
            showOn: ["/projects"],
          },
        ];

    // Blog actions
    const blogActions: Action[] = !isPage("/blog")
      ? []
      : pathname !== "/blog" && pathname !== "/blog/"
        ? [
            {
              id: "blog-prev",
              label: t("actionSearch.blog.prev", "Previous"),
              icon: <ArrowLeft className="h-4 w-4 text-blue-500" />,
              shortcut: "h",
              category: t("actionSearch.blog.category", "Blog"),
              action: () => {
                dispatchKey("h");
                close();
              },
              showOn: ["/blog/"],
            },
            {
              id: "blog-next",
              label: t("actionSearch.blog.next", "Next"),
              icon: <ArrowRight className="h-4 w-4 text-blue-500" />,
              shortcut: "l",
              category: t("actionSearch.blog.category", "Blog"),
              action: () => {
                dispatchKey("l");
                close();
              },
              showOn: ["/blog/"],
            },
            {
              id: "blog-back",
              label: t("actionSearch.blog.back", "Back to list"),
              icon: <ArrowLeft className="h-4 w-4 text-blue-500" />,
              shortcut: "b",
              category: t("actionSearch.blog.category", "Blog"),
              action: nav("/blog/"),
              showOn: ["/blog/"],
            },
          ]
        : [
            {
              id: "blog-down",
              label: t("actionSearch.blog.next", "Next post"),
              icon: <ArrowDown className="h-4 w-4 text-blue-500" />,
              shortcut: "j",
              category: t("actionSearch.blog.category", "Blog"),
              action: () => {
                dispatchKey("j");
                close();
              },
              showOn: ["/blog"],
            },
            {
              id: "blog-up",
              label: t("actionSearch.blog.prev", "Previous post"),
              icon: <ArrowUp className="h-4 w-4 text-blue-500" />,
              shortcut: "k",
              category: t("actionSearch.blog.category", "Blog"),
              action: () => {
                dispatchKey("k");
                close();
              },
              showOn: ["/blog"],
            },
            {
              id: "blog-search",
              label: t("actionSearch.blog.search", "Search"),
              icon: <Search className="h-4 w-4 text-blue-500" />,
              shortcut: "s",
              category: t("actionSearch.blog.category", "Blog"),
              action: () => {
                (
                  document.querySelector(
                    'input[placeholder*="Search"]',
                  ) as HTMLInputElement
                )?.focus();
                close();
              },
              showOn: ["/blog"],
            },
            {
              id: "blog-filter",
              label: t("actionSearch.blog.filterTag", "Filter"),
              icon: <Tag className="h-4 w-4 text-green-500" />,
              category: t("actionSearch.blog.category", "Blog"),
              action: () => {
                document
                  .querySelector("button:has(.lucide-filter)")
                  ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                close();
              },
              showOn: ["/blog"],
            },
          ];

    // About page - chapters 1-5
    const aboutActions: Action[] = !isPage("/about")
      ? []
      : [1, 2, 3, 4, 5].map((i) => ({
          id: `chapter-${i}`,
          label: t("actionSearch.about.jumpToChapter", { i }),
          icon: <BookOpen className="h-4 w-4 text-green-500" />,
          shortcut: `${i}`,
          category: t("actionSearch.about.category", "About"),
          action: () => {
            scrollTo(`chapter-${i}`, "center");
            close();
          },
          showOn: ["/about"],
        }));

    // Now page - categories
    const nowCategories = ["reading", "coding", "drinking", "listening", "thinking", "studying", "planning"];
    const CATEGORY_ICONS: Record<string, any> = {
      reading: BookOpen,
      coding: Code,
      drinking: Coffee,
      listening: Headphones,
      thinking: Brain,
      studying: GraduationCap,
      planning: Lightbulb,
    };
    const nowActions: Action[] = !isPage("/now")
      ? []
      : nowCategories.map((cat, idx) => {
          const Icon = CATEGORY_ICONS[cat] || Clock;
          const label = t(`now.categories.${cat}`, cat);
          return {
            id: `now-${cat}`,
            label: t("actionSearch.now.jumpToCategory", { category: label }),
            icon: <Icon className="h-4 w-4 text-green-500" />,
            shortcut: `${idx + 1}`,
            category: t("actionSearch.now.category", "Now"),
            action: () => {
              scrollTo(`category-${cat}`);
              close();
            },
            showOn: ["/now"],
          };
        });

    // Uses page - categories
    const usesCategories = ["hardware", "mobile", "audio", "os", "development", "email", "privacy", "mobile_tools", "mapping", "gaming", "multimedia"];
    const USES_ICONS = [Laptop, Smartphone, Headphones, Globe, Code, Coffee, Shield, Settings, Map, Gamepad2, ImageIcon];
    const usesActions: Action[] = !isPage("/uses")
      ? []
      : usesCategories.map((cat, idx) => {
          const Icon = USES_ICONS[idx] || Clock;
          const label = t(`uses.categories.${cat}`, cat);
          return {
            id: `uses-${idx}`,
            label: t("actionSearch.uses.jumpToCategory", { category: label }),
            icon: <Icon className="h-4 w-4 text-blue-500" />,
            shortcut: idx < 9 ? `${idx + 1}` : idx === 9 ? "0" : "-",
            category: t("actionSearch.uses.category", "Uses"),
            action: () => {
              scrollTo(`[id^="category-"]:nth-of-type(${idx + 1})`);
              close();
            },
            showOn: ["/uses"],
          };
        });

    // Colophon page - sections
    const colophonSections = ["siteHistory", "technologyStack", "hosting", "inspiration"];
    const COLOPHON_ICONS = [Palette, Code, Server, BookOpen];
    const colophonActions: Action[] = !isPage("/colophon")
      ? []
      : colophonSections.map((sec, idx) => {
          const Icon = COLOPHON_ICONS[idx] || FileText;
          const label = t(`colophon.${sec}.title`, sec);
          return {
            id: `colophon-${idx}`,
            label: t("actionSearch.colophon.jumpToSection", { section: label }),
            icon: <Icon className="h-4 w-4 text-purple-500" />,
            shortcut: `${idx + 1}`,
            category: t("actionSearch.colophon.category", "Colophon"),
            action: () => {
              scrollTo(`[id^="section-"]:nth-of-type(${idx + 1})`);
              close();
            },
            showOn: ["/colophon"],
          };
        });

    return [
      ...navItems,
      ...themeActions,
      ...generalActions,
      ...projectActions,
      ...blogActions,
      ...aboutActions,
      ...nowActions,
      ...usesActions,
      ...colophonActions,
    ].filter((a) => !a.showOn || a.showOn.some((p) => pathname?.includes(p)));
  }, [t, theme, setTheme, lang, pathname]);

  // Filter by query
  const filteredActions = useMemo(() => {
    if (!debouncedQuery) return allActions;
    const q = debouncedQuery.toLowerCase();
    return allActions.filter((a) =>
      `${a.label} ${a.description || ""}`.toLowerCase().includes(q),
    );
  }, [allActions, debouncedQuery]);

  // Group by category
  const groupedActions = useMemo(
    () =>
      filteredActions.reduce(
        (acc, a) => {
          (acc[a.category] ||= []).push(a);
          return acc;
        },
        {} as Record<string, Action[]>,
      ),
    [filteredActions],
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Skip if typing in input (except for our search input)
      const el = document.activeElement;
      if (el instanceof HTMLInputElement && el !== inputRef.current) return;
      if (el instanceof HTMLTextAreaElement) return;
      if (el?.getAttribute("contenteditable") === "true") return;

      if (e.key === "." && !open && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filteredActions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (i) => (i - 1 + filteredActions.length) % filteredActions.length,
        );
      } else if (e.key === "Enter" && filteredActions.length) {
        e.preventDefault();
        filteredActions[selectedIndex].action();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, filteredActions, selectedIndex]);

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
    else {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  if (!mounted) return null;

  return (
    <>
      {/* Dialog backdrop and content */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Dialog content */}
          <div className="relative bg-background border rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Search input */}
            <div className="p-4 pb-2">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t(
                    "actionSearch.placeholder",
                    "Search actions...",
                  )}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="w-full pl-10 pr-4 h-10 bg-background border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {filteredActions.length > 0 ? (
                <div className="pb-2 animate-in fade-in duration-200">
                  {Object.entries(groupedActions).map(([category, actions]) => (
                    <div key={category} className="px-2">
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
                        {category}
                      </div>
                      {actions.map((a) => {
                        const idx = filteredActions.findIndex(
                          (x) => x.id === a.id,
                        );
                        return (
                          <div
                            key={a.id}
                            className={`px-2 py-1.5 flex items-center justify-between rounded-md cursor-pointer transition-colors ${idx === selectedIndex ? "bg-muted" : "hover:bg-muted/50"}`}
                            onClick={() => a.action()}
                            onMouseEnter={() => setSelectedIndex(idx)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="flex-shrink-0">{a.icon}</span>
                              <span className="text-sm font-medium">
                                {a.label}
                              </span>
                              {a.description && (
                                <span className="text-xs text-muted-foreground">
                                  {a.description}
                                </span>
                              )}
                            </div>
                            {a.shortcut && (
                              <KeyboardShortcut>{a.shortcut}</KeyboardShortcut>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center animate-in fade-in duration-200">
                  <p className="text-muted-foreground">
                    {t("actionSearch.noResults", "No actions found")}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
                <span>
                  {t(
                    "actionSearch.pressToOpen",
                    "Press . to open command palette",
                  )}
                </span>
                <span>{t("actionSearch.escToClose", "ESC to close")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
