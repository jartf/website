"use client"

import { useState, useEffect, useRef, useMemo, memo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useMounted, useDebounce } from "@/hooks"
import {
  Search, Home, User, Code, BookOpen, Clock, Wrench, Mail, FileText, Calendar, Moon, Sun, Languages,
  RefreshCw, Gamepad2, Slash, KeyRound, FlipHorizontal, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  X, Coffee, Headphones, Brain, GraduationCap, Lightbulb, Laptop, Smartphone, Globe, Shield,
  Settings, Map, ImageIcon, Palette, Server, Tag, MessagesSquare,
} from "lucide-react"
import { projects } from "@/content/project-items"
import { nowItems } from "@/content/now-items"
import { KeyboardShortcut } from "@/components/keyboard-shortcut"
import { SUPPORTED_LANGUAGES } from "@/lib/constants"

// Helpers
const dispatchKey = (key) => document.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }))
const scrollTo = (id, block = "start") => {
  const el = document.getElementById(id) || document.querySelector(id)
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block })
    el.classList.add("ring-2", "ring-primary", "ring-offset-2")
    setTimeout(() => el.classList.remove("ring-2", "ring-primary", "ring-offset-2"), 1000)
  }
}

const CATEGORY_ICONS = { reading: BookOpen, coding: Code, drinking: Coffee, listening: Headphones, thinking: Brain, studying: GraduationCap, planning: Lightbulb }
const USES_ICONS = [Laptop, Smartphone, Headphones, Globe, Code, Coffee, Shield, Settings, Map, Gamepad2, ImageIcon]
const COLOPHON_ICONS = [Palette, Code, Server, BookOpen]

export const ActionSearchBar = memo(function ActionSearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const debouncedQuery = useDebounce(query, 200)
  const mounted = useMounted()
  const lang = i18n.language || "en"

  // Build all actions in one memoized object
  const allActions = useMemo(() => {
    const isPage = (p) => pathname?.includes(p)
    const close = () => setOpen(false)
    const nav = (path) => () => { router.push(path); close() }

    // Navigation actions
    const navItems = [
      ["home", "nav.home", Home, "/", "h"],
      ["about", "nav.about", User, "/about", "a"],
      ["projects", "nav.projects", Code, "/projects", "p"],
      ["blog", "nav.blog", BookOpen, "/blog", "b"],
      ["now", "nav.now", Clock, "/now", "n"],
      ["uses", "nav.uses", Wrench, "/uses", "u"],
      ["contact", "nav.contact", Mail, "/contact", "c"],
      ["guestbook", "nav.guestbook", MessagesSquare, "/guestbook", "g"],
      ["colophon", "nav.colophon", FileText, "/colophon", "l"],
      ["webring", "nav.webring", FlipHorizontal, "/webrings", "w"],
      ["scrapbook", "nav.scrapbook", Calendar, "/scrapbook", "d"],
      ["slashes", "Slashes", Slash, "/slashes", "/"],
    ].map(([id, label, Icon, path, shortcut]) => ({
      id, label: t(label, label.split(".").pop()), shortcut,
      icon: <Icon className="h-4 w-4 text-primary" />,
      category: t("keyboardShortcuts.navigation", "Navigation"),
      action: nav(path),
    }))

    // Theme + language
    const themeActions = [
      {
        id: "theme-toggle",
        label: theme === "dark" ? t("actionSearch.switchLightMode", "Light mode") : t("actionSearch.switchDarkMode", "Dark mode"),
        icon: theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-500" />,
        shortcut: "m", category: t("actionSearch.appearance", "Appearance"),
        action: () => { setTheme(theme === "dark" ? "light" : "dark"); close() },
      },
      {
        id: "language-toggle", label: t("actionSearch.cycleLanguage", "Change language"),
        icon: <Languages className="h-4 w-4 text-green-500" />, shortcut: "y", category: t("blog.language", "Language"),
        action: () => {
          const idx = Math.max(0, SUPPORTED_LANGUAGES.findIndex(l => lang.startsWith(l)))
          i18n.changeLanguage(SUPPORTED_LANGUAGES[(idx + 1) % SUPPORTED_LANGUAGES.length]); close()
        },
      },
    ]

    // General actions
    const generalActions = [
      { id: "refresh-cat", label: t("keyboardShortcuts.refreshCat", "Refresh mood cat"), icon: <RefreshCw className="h-4 w-4 text-purple-500" />, shortcut: "r", category: t("actionSearch.fun", "Fun"), action: () => { document.querySelector('button[aria-label="Refresh mood cat"]')?.click(); close() } },
      { id: "tetris", label: t("actionSearch.tetris", "Play Tetris"), icon: <Gamepad2 className="h-4 w-4 text-red-500" />, shortcut: "t", category: t("actionSearch.games", "Games"), action: nav("/tetris") },
      { id: "2048", label: t("actionSearch.2048", "Play 2048"), icon: <Gamepad2 className="h-4 w-4 text-orange-500" />, shortcut: "z", category: t("actionSearch.games", "Games"), action: nav("/2048") },
      { id: "keyboard-shortcuts", label: t("keyboardShortcuts.openShortcuts", "Keyboard shortcuts"), icon: <KeyRound className="h-4 w-4 text-gray-500" />, shortcut: ",", category: t("actionSearch.help", "Help"), action: () => { document.querySelector('button[aria-label="Keyboard Shortcuts"]')?.click(); close() } },
    ]

    // Project page actions
    const projectActions = !isPage("/projects") ? [] : [
      { id: "close-card", label: t("actionSearch.projects.closeCard", "Close card"), icon: <X className="h-4 w-4 text-red-500" />, shortcut: "Esc", category: t("actionSearch.projects.category", "Projects"), action: () => { document.querySelector('.rotate-y-180 [id^="project-card-back-"]')?.click(); close() }, showOn: ["/projects"] },
      ...["left", "right", "up", "down"].map(dir => ({
        id: `nav-${dir}`, label: t(`actionSearch.projects.${dir}`, dir), icon: ({ left: ArrowLeft, right: ArrowRight, up: ArrowUp, down: ArrowDown })[dir],
        shortcut: ({ left: "←", right: "→", up: "↑", down: "↓" })[dir], category: t("actionSearch.projects.category", "Projects"),
        action: () => { dispatchKey(`Arrow${dir[0].toUpperCase() + dir.slice(1)}`); close() }, showOn: ["/projects"],
      })).map(a => ({ ...a, icon: <a.icon className="h-4 w-4 text-blue-500" /> })),
      ...projects.filter(p => !p.hidden).slice(0, 9).map(p => {
        const content = lang === "vih" ? (p.content.vih || p.content.vi || p.content.en) : (p.content[lang] || p.content.en)
        return {
          id: `flip-${p.id}`, label: t("actionSearch.projects.flipCard", { title: content?.title || "Untitled" }),
          icon: <FlipHorizontal className="h-4 w-4 text-indigo-500" />, shortcut: `${p.id}`, category: t("actionSearch.projects.category", "Projects"),
          action: () => { document.getElementById(`project-card-${p.id}`)?.click(); close() }, showOn: ["/projects"],
        }
      }),
    ]

    // Blog actions
    const blogActions = !isPage("/blog") ? [] : pathname !== "/blog" ? [
      { id: "blog-prev", label: t("actionSearch.blog.prev", "Previous"), icon: <ArrowLeft className="h-4 w-4 text-blue-500" />, shortcut: "h", category: t("actionSearch.blog.category", "Blog"), action: () => { dispatchKey("h"); close() }, showOn: ["/blog/"] },
      { id: "blog-next", label: t("actionSearch.blog.next", "Next"), icon: <ArrowRight className="h-4 w-4 text-blue-500" />, shortcut: "l", category: t("actionSearch.blog.category", "Blog"), action: () => { dispatchKey("l"); close() }, showOn: ["/blog/"] },
      { id: "blog-back", label: t("actionSearch.blog.back", "Back to list"), icon: <ArrowLeft className="h-4 w-4 text-blue-500" />, shortcut: "b", category: t("actionSearch.blog.category", "Blog"), action: nav("/blog"), showOn: ["/blog/"] },
    ] : [
      { id: "blog-down", label: t("actionSearch.blog.next", "Next post"), icon: <ArrowDown className="h-4 w-4 text-blue-500" />, shortcut: "j", category: t("actionSearch.blog.category", "Blog"), action: () => { dispatchKey("j"); close() }, showOn: ["/blog"] },
      { id: "blog-up", label: t("actionSearch.blog.prev", "Previous post"), icon: <ArrowUp className="h-4 w-4 text-blue-500" />, shortcut: "k", category: t("actionSearch.blog.category", "Blog"), action: () => { dispatchKey("k"); close() }, showOn: ["/blog"] },
      { id: "blog-search", label: t("actionSearch.blog.search", "Search"), icon: <Search className="h-4 w-4 text-blue-500" />, shortcut: "s", category: t("actionSearch.blog.category", "Blog"), action: () => { document.querySelector('input[placeholder="Search posts..."]')?.focus(); close() }, showOn: ["/blog"] },
      { id: "blog-filter", label: t("actionSearch.blog.filterTag", "Filter"), icon: <Tag className="h-4 w-4 text-green-500" />, category: t("actionSearch.blog.category", "Blog"), action: () => { document.querySelector("button:has(.lucide-filter)")?.click(); close() }, showOn: ["/blog"] },
      ...[1,2,3,4,5,6,7,8,9].map(i => ({ id: `jump-${i}`, label: t("actionSearch.blog.jumpToPost", { i }), icon: <BookOpen className="h-4 w-4 text-green-500" />, shortcut: `${i}`, category: t("actionSearch.blog.category", "Blog"), action: () => { dispatchKey(`${i}`); close() }, showOn: ["/blog"] })),
    ]

    // About page - chapters 1-5
    const aboutActions = !isPage("/about") ? [] : [1,2,3,4,5].map(i => ({
      id: `chapter-${i}`, label: t("actionSearch.about.jumpToChapter", { i }), icon: <BookOpen className="h-4 w-4 text-green-500" />,
      shortcut: `${i}`, category: t("actionSearch.about.category", "About"), action: () => { scrollTo(`chapter-${i}`, "center"); close() }, showOn: ["/about"],
    }))

    // Now page - categories
    const nowActions = !isPage("/now") ? [] : [...new Set(nowItems.map(i => i.category))].map((cat, idx) => {
      const Icon = CATEGORY_ICONS[cat] || Clock
      const label = t(`now.categories.${cat}`)
      return {
        id: `now-${cat}`, label: t("actionSearch.now.jumpToCategory", { category: label }), icon: <Icon className="h-4 w-4 text-green-500" />,
        shortcut: `${idx + 1}`, category: t("actionSearch.about.category", "Now"), action: () => { scrollTo(`category-${cat}`); close() }, showOn: ["/now"],
      }
    })

    // Uses page - categories
    const usesCategories = ["hardware", "mobile", "audio", "os", "development", "email", "privacy", "mobile_tools", "mapping", "gaming", "multimedia"]
    const usesActions = !isPage("/uses") ? [] : usesCategories.map((cat, idx) => {
      const Icon = USES_ICONS[idx] || Clock
      const label = t(`uses.categories.${cat}`)
      return {
        id: `uses-${idx}`, label: t("actionSearch.uses.jumpToCategory", { category: label }), icon: <Icon className="h-4 w-4 text-blue-500" />,
        shortcut: idx < 9 ? `${idx + 1}` : idx === 9 ? "0" : "-", category: t("actionSearch.uses.category", "Uses"),
        action: () => { scrollTo(`[id^="category-"]:nth-of-type(${idx + 1})`); close() }, showOn: ["/uses"],
      }
    })

    // Colophon page - sections
    const colophonSections = ["siteHistory", "technologyStack", "hosting", "inspiration"]
    const colophonActions = !isPage("/colophon") ? [] : colophonSections.map((sec, idx) => {
      const Icon = COLOPHON_ICONS[idx] || FileText
      const label = t(`colophon.${sec}.title`)
      return {
        id: `colophon-${idx}`, label: t("actionSearch.colophon.jumpToSection", { section: label }), icon: <Icon className="h-4 w-4 text-purple-500" />,
        shortcut: `${idx + 1}`, category: t("actionSearch.colophon.category", "Colophon"),
        action: () => { scrollTo(`[id^="section-"]:nth-of-type(${idx + 1})`); close() }, showOn: ["/colophon"],
      }
    })

    return [...navItems, ...themeActions, ...generalActions, ...projectActions, ...blogActions, ...aboutActions, ...nowActions, ...usesActions, ...colophonActions]
      .filter(a => !a.showOn || a.showOn.some(p => pathname?.includes(p)))
  }, [t, theme, setTheme, router, i18n, lang, pathname])

  // Filter by query
  const filteredActions = useMemo(() => {
    if (!debouncedQuery) return allActions
    const q = debouncedQuery.toLowerCase()
    return allActions.filter(a => `${a.label} ${a.description || ""}`.toLowerCase().includes(q))
  }, [allActions, debouncedQuery])

  // Group by category
  const groupedActions = useMemo(() => filteredActions.reduce((acc, a) => {
    (acc[a.category] ||= []).push(a)
    return acc
  }, {}), [filteredActions])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "." && !open) { e.preventDefault(); setOpen(true); return }
      if (!open) return
      if (e.key === "Escape") setOpen(false)
      else if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex(i => (i + 1) % filteredActions.length) }
      else if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex(i => (i - 1 + filteredActions.length) % filteredActions.length) }
      else if (e.key === "Enter" && filteredActions.length) { e.preventDefault(); filteredActions[selectedIndex].action() }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, filteredActions, selectedIndex])

  // Focus input on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
    else { setQuery(""); setSelectedIndex(0) }
  }, [open])

  if (!mounted) return null

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden" aria-describedby="search-description">
        <DialogTitle className="sr-only">{t("actionSearch.title", "Quick Actions")}</DialogTitle>
        <DialogDescription id="search-description" className="sr-only">
          {t("actionSearch.description", "Search and navigate to actions, pages, and settings")}
        </DialogDescription>
        <div className="p-4 pb-2">
          <div className="relative">
            <Input ref={inputRef} type="text" placeholder={t("actionSearch.placeholder", "Search actions...")} value={query} onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0) }} className="pl-10 pr-4 h-10" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {filteredActions.length > 0 ? (
            <div className="pb-2 animate-in fade-in duration-200">
              {Object.entries(groupedActions).map(([category, actions]) => (
                <div key={category} className="px-2">
                  <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">{category}</div>
                  {actions.map((a, i) => {
                    const idx = filteredActions.findIndex(x => x.id === a.id)
                    return (
                      <div key={a.id}
                        className={`px-2 py-1.5 flex items-center justify-between rounded-md cursor-pointer transition-colors ${idx === selectedIndex ? "bg-muted" : "hover:bg-muted/50"}`}
                        style={{ animation: `fadeInUp 0.2s ease-out ${i * 0.02}s both` }}
                        onClick={() => a.action()} onMouseEnter={() => setSelectedIndex(idx)}>
                        <div className="flex items-center gap-2">
                          <span className="flex-shrink-0">{a.icon}</span>
                          <span className="text-sm font-medium">{a.label}</span>
                          {a.description && <span className="text-xs text-muted-foreground">{a.description}</span>}
                        </div>
                        {a.shortcut && <KeyboardShortcut>{a.shortcut}</KeyboardShortcut>}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center animate-in fade-in duration-200">
              <p className="text-muted-foreground">No actions found</p>
            </div>
          )}
        </div>
        <div className="p-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-2">
            <span>{t("actionSearch.pressToOpen")}</span>
            <span>{t("actionSearch.escToClose")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
})
