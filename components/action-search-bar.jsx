"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import useDebounce from "@/hooks/use-debounce"
import {
  Search,
  Home,
  User,
  Code,
  BookOpen,
  Clock,
  Wrench,
  Mail,
  FileText,
  Calendar,
  Moon,
  Sun,
  Languages,
  RefreshCw,
  Gamepad2,
  Slash,
  KeyRound,
  FlipHorizontal,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  X,
  Coffee,
  Headphones,
  Brain,
  GraduationCap,
  Lightbulb,
  Laptop,
  Smartphone,
  Globe,
  Shield,
  Settings,
  Map,
  ImageIcon,
  Palette,
  Server,
  Tag,
} from "lucide-react"
import { useMounted } from "@/hooks/use-mounted"
import { projects } from "@/content/project-items"
import { nowItems } from "@/content/now-items"
import { KeyboardShortcut } from "@/components/keyboard-shortcut"
import { SUPPORTED_LANGUAGES } from "@/lib/constants"

/**
 * @typedef {Object} Action
 * @property {string} id - Unique identifier for the action
 * @property {string} label - Display label for the action
 * @property {React.ReactNode} icon - Icon component to display
 * @property {string} [description] - Optional description of the action
 * @property {string} [shortcut] - Keyboard shortcut for the action
 * @property {string} category - Category the action belongs to
 * @property {Function} action - Function to execute when the action is selected
 * @property {string[]} [showOn] - Optional array of paths where this action should be shown
 */

export function ActionSearchBar() {
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

  // Page type checks
  const isProjectsPage = pathname?.includes("/projects")
  const isAboutPage = pathname?.includes("/about")
  const isNowPage = pathname?.includes("/now")
  const isUsesPage = pathname?.includes("/uses")
  const isColophonPage = pathname?.includes("/colophon")
  const isBlogPage = pathname?.includes("/blog")
  const isBlogPostPage = pathname?.includes("/blog/") && pathname !== "/blog"

  // Function to flip a project card
  const flipProjectCard = useCallback((projectId) => {
    // Find the project card element
    const projectCard = document.getElementById(`project-card-${projectId}`)
    if (projectCard) {
      // Simulate a click on the card
      projectCard.click()
    }
  }, [])

  // Function to close a flipped card
  const closeFlippedCard = useCallback(() => {
    // Find any flipped cards (they have rotate-y-180 class)
    const flippedCardContainer = document.querySelector(".rotate-y-180")
    if (flippedCardContainer) {
      // Find the back of the card and click it to close
      const cardBack = flippedCardContainer.querySelector('[id^="project-card-back-"]')
      if (cardBack) {
        cardBack.click()
      }
    }
  }, [])

  // Function to navigate between cards
  const navigateCards = useCallback((direction) => {
    // Simulate pressing the arrow key
    const event = new KeyboardEvent("keydown", {
      key:
        direction === "left"
          ? "ArrowLeft"
          : direction === "right"
            ? "ArrowRight"
            : direction === "up"
              ? "ArrowUp"
              : "ArrowDown",
      bubbles: true,
    })
    document.dispatchEvent(event)
  }, [])

  // Function to jump to a chapter in the about page
  const jumpToChapter = useCallback((chapterNumber) => {
    // Find the chapter element
    const chapterElement = document.getElementById(`chapter-${chapterNumber}`)
    if (chapterElement) {
      // Scroll to the chapter
      chapterElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [])

  // Function to jump to a category in the now page
  const jumpToCategory = useCallback((categoryName) => {
    // Find the category element
    const categoryElement = document.getElementById(`category-${categoryName}`)
    if (categoryElement) {
      // Scroll to the category
      categoryElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      // Add a brief highlight effect
      categoryElement.classList.add("ring-2", "ring-primary", "ring-offset-2")
      setTimeout(() => {
        categoryElement.classList.remove("ring-2", "ring-primary", "ring-offset-2")
      }, 1000)
    }
  }, [])

  // Function to jump to a category in the uses page
  const jumpToUsesCategory = useCallback((index) => {
    // Find the category element
    const categoryElement = document.querySelector(`[id^="category-"]:nth-of-type(${index})`)
    if (categoryElement) {
      // Scroll to the category
      categoryElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      // Add a brief highlight effect
      categoryElement.classList.add("ring-2", "ring-primary", "ring-offset-2")
      setTimeout(() => {
        categoryElement.classList.remove("ring-2", "ring-primary", "ring-offset-2")
      }, 1000)
    }
  }, [])

  // Function to jump to a section in the colophon page
  const jumpToColophonSection = useCallback((index) => {
    // Find the section element
    const sectionElement = document.querySelector(`[id^="section-"]:nth-of-type(${index})`)
    if (sectionElement) {
      // Scroll to the section
      sectionElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      // Add a brief highlight effect
      sectionElement.classList.add("ring-2", "ring-primary", "ring-offset-2")
      setTimeout(() => {
        sectionElement.classList.remove("ring-2", "ring-primary", "ring-offset-2")
      }, 1000)
    }
  }, [])

  // Function to navigate blog posts
  const navigateBlogPosts = useCallback((direction) => {
    // Simulate pressing the key
    const event = new KeyboardEvent("keydown", {
      key: direction === "next" ? "j" : "k",
      bubbles: true,
    })
    document.dispatchEvent(event)
  }, [])

  // Function to navigate between blog posts
  const navigateBlogPost = useCallback((direction) => {
    // Simulate pressing the key
    const event = new KeyboardEvent("keydown", {
      key: direction === "prev" ? "h" : "l",
      bubbles: true,
    })
    document.dispatchEvent(event)
  }, [])

  // Define navigation actions
  const createNavigationActions = useCallback(() => {
    return [
      {
        id: "home",
        label: t("nav.home", "Home"),
        icon: <Home className="h-4 w-4 text-primary" />,
        description: t("actionSearch.goTo", "Go to page"),
        shortcut: "h",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: () => {
          router.push("/")
          setOpen(false)
        },
      },
      {
        id: "about",
        label: t("nav.about", "About"),
        icon: <User className="h-4 w-4 text-primary" />,
        description: t("actionSearch.goTo", "Go to page"),
        shortcut: "a",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: () => {
          router.push("/about")
          setOpen(false)
        },
      },
      {
        id: "projects",
        label: t("nav.projects", "Projects"),
        icon: <Code className="h-4 w-4 text-primary" />,
        description: t("actionSearch.goTo", "Go to page"),
        shortcut: "p",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: () => {
          router.push("/projects")
          setOpen(false)
        },
      },
      {
        id: "blog",
        label: t("nav.blog", "Blog"),
        icon: <BookOpen className="h-4 w-4 text-primary" />,
        description: t("actionSearch.goTo", "Go to page"),
        shortcut: "b",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: () => {
          router.push("/blog")
          setOpen(false)
        },
      },
      {
        id: "now",
        label: t("nav.now", "Now"),
        icon: <Clock className="h-4 w-4 text-primary" />,
        description: t("actionSearch.goTo", "Go to page"),
        shortcut: "n",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: () => {
          router.push("/now")
          setOpen(false)
        },
      },
      {
        id: "uses",
        label: t("nav.uses", "Uses"),
        icon: <Wrench className="h-4 w-4 text-primary" />,
        description: t("actionSearch.goTo", "Go to page"),
        shortcut: "u",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: () => {
          router.push("/uses")
          setOpen(false)
        },
      },
      {
        id: "contact",
        label: t("nav.contact", "Contact"),
        icon: <Mail className="h-4 w-4 text-primary" />,
        description: t("actionSearch.goTo", "Go to page"),
        shortcut: "c",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: () => {
          router.push("/contact")
          setOpen(false)
        },
      },
      {
        id: "colophon",
        label: t("nav.colophon", "Colophon"),
        icon: <FileText className="h-4 w-4 text-primary" />,
        description: t("actionSearch.goTo", "Go to page"),
        shortcut: "l",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: () => {
          router.push("/colophon")
          setOpen(false)
        },
      },
      {
        id: "scrapbook",
        label: t("nav.scrapbook", "Scrapbook"),
        icon: <Calendar className="h-4 w-4 text-primary" />,
        description: t("actionSearch.goTo", "Go to page"),
        shortcut: "d",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: () => {
          router.push("/scrapbook")
          setOpen(false)
        },
      },
      {
        id: "slashes",
        label: "Slashes",
        icon: <Slash className="h-4 w-4 text-primary" />,
        description: t("actionSearch.goTo", "Go to page"),
        shortcut: "/",
        category: t("keyboardShortcuts.navigation", "Navigation"),
        action: () => {
          router.push("/slashes")
          setOpen(false)
        },
      },
    ]
  }, [t, router])

  // Define theme and language actions
  const createThemeAndLanguageActions = useCallback(() => {
    return [
      {
        id: "theme-toggle",
        label:
          theme === "dark"
            ? t("actionSearch.switchLightMode", "Switch to light mode")
            : t("actionSearch.switchDarkMode", "Switch to dark mode"),
        icon:
          theme === "dark" ? <Sun className="h-4 w-4 text-yellow-500" /> : <Moon className="h-4 w-4 text-blue-500" />,
        description: t("actionSearch.toggleTheme", "Toggle theme"),
        shortcut: "m",
        category: t("actionSearch.appearance", "Appearance"),
        action: () => {
          setTheme(theme === "dark" ? "light" : "dark")
          setOpen(false)
        },
      },
      {
        id: "language-toggle",
        label: t("actionSearch.cycleLanguage", "Change language"),
        icon: <Languages className="h-4 w-4 text-green-500" />,
        description: t("actionSearch.cycleLanguage", "Cycle through languages"),
        shortcut: "g",
        category: t("blog.language", "Language"),
        action: () => {
          const currentLang = i18n.language || "en"
          let langIndex = SUPPORTED_LANGUAGES.findIndex((lang) => currentLang.startsWith(lang))
          if (langIndex === -1) langIndex = 0
          const nextLangIndex = (langIndex + 1) % SUPPORTED_LANGUAGES.length
          i18n.changeLanguage(SUPPORTED_LANGUAGES[nextLangIndex])
          setOpen(false)
        },
      },
    ]
  }, [theme, setTheme, t, i18n])

  // Define other general actions
  const createGeneralActions = useCallback(() => {
    return [
      {
        id: "refresh-cat",
        label: t("keyboardShortcuts.refreshCat", "Refresh mood cat"),
        icon: <RefreshCw className="h-4 w-4 text-purple-500" />,
        description: t("actionSearch.refreshCat", "Get a new mood cat"),
        shortcut: "r",
        category: t("actionSearch.fun", "Fun"),
        action: () => {
          const refreshButton = document.querySelector('button[aria-label="Refresh mood cat"]')
          if (refreshButton) {
            refreshButton.click()
          }
          setOpen(false)
        },
      },
      // Games
      {
        id: "tetris",
        label: t("actionSearch.tetris", "Play Tetris"),
        icon: <Gamepad2 className="h-4 w-4 text-red-500" />,
        description: t("actionSearch.playGame", "Play game"),
        shortcut: "t",
        category: t("actionSearch.games", "Games"),
        action: () => {
          router.push("/tetris")
          setOpen(false)
        },
      },
      {
        id: "2048",
        label: t("actionSearch.2048", "Play 2048"),
        icon: <Gamepad2 className="h-4 w-4 text-orange-500" />,
        description: t("actionSearch.playGame", "Play game"),
        shortcut: "z",
        category: t("actionSearch.games", "Games"),
        action: () => {
          router.push("/2048")
          setOpen(false)
        },
      },
      // Keyboard shortcuts
      {
        id: "keyboard-shortcuts",
        label: t("keyboardShortcuts.openShortcuts", "Keyboard shortcuts"),
        icon: <KeyRound className="h-4 w-4 text-gray-500" />,
        description: t("actionSearch.viewShortcuts", "View all shortcuts"),
        shortcut: ",",
        category: t("actionSearch.help", "Help"),
        action: () => {
          const shortcutsButton = document.querySelector('button[aria-label="Keyboard Shortcuts"]')
          if (shortcutsButton) {
            shortcutsButton.click()
          }
          setOpen(false)
        },
      },
    ]
  }, [t, router])

  // Define project-specific actions
  const createProjectActions = useCallback(() => {
    if (!isProjectsPage) return []

    const actions = [
      {
        id: "close-flipped-card",
        label: t("actionSearch.projects.closeCard", "Close flipped card"),
        icon: <X className="h-4 w-4 text-red-500" />,
        description: t("actionSearch.projects.closeCardDescription", "Close the currently flipped project card"),
        shortcut: "Esc",
        category: t("actionSearch.projects.category", "Navigate through project cards"),
        action: () => {
          closeFlippedCard()
          setOpen(false)
        },
        showOn: ["/projects"],
      },
      {
        id: "navigate-left",
        label: t("actionSearch.projects.left", "Navigate left"),
        icon: <ArrowLeft className="h-4 w-4 text-blue-500" />,
        description: t("actionSearch.projects.leftDescription", "Navigate to the previous project card"),
        shortcut: "←",
        category: t("actionSearch.projects.category", "Navigate through project cards"),
        action: () => {
          navigateCards("left")
          setOpen(false)
        },
        showOn: ["/projects"],
      },
      {
        id: "navigate-right",
        label: t("actionSearch.projects.right", "Navigate right"),
        icon: <ArrowRight className="h-4 w-4 text-blue-500" />,
        description: t("actionSearch.projects.rightDescription", "Navigate to the next project card"),
        shortcut: "→",
        category: t("actionSearch.projects.category", "Navigate through project cards"),
        action: () => {
          navigateCards("right")
          setOpen(false)
        },
        showOn: ["/projects"],
      },
      {
        id: "navigate-up",
        label: t("actionSearch.projects.up", "Navigate up"),
        icon: <ArrowUp className="h-4 w-4 text-blue-500" />,
        description: t("actionSearch.projects.upDescription", "Navigate up or scroll content"),
        shortcut: "↑",
        category: t("actionSearch.projects.category", "Navigate through project cards"),
        action: () => {
          navigateCards("up")
          setOpen(false)
        },
        showOn: ["/projects"],
      },
      {
        id: "navigate-down",
        label: t("actionSearch.projects.down", "Navigate down"),
        icon: <ArrowDown className="h-4 w-4 text-blue-500" />,
        description: t("actionSearch.projects.downDescription", "Navigate down or scroll content"),
        shortcut: "↓",
        category: t("actionSearch.projects.category", "Navigate through project cards"),
        action: () => {
          navigateCards("down")
          setOpen(false)
        },
        showOn: ["/projects"],
      },
    ]

    const currentLanguage = i18n.language || "en" // Get the current language (default to "en")

    // Add project card flip actions
    const visibleProjects = projects.filter((p) => !p.hidden).slice(0, 9)
    visibleProjects.forEach((project) => {
      let projectContent
      if (currentLanguage === "vih") {
        projectContent =
          project.content.vih ||
          project.content.vi ||
          project.content.en
      } else {
        projectContent =
          project.content[currentLanguage] || project.content.en
      }
      const projectTitle = projectContent?.title || "Untitled"
      const flipCardLabel = t("actionSearch.projects.flipCard", { title: projectTitle })
      if (project.id <= 9) {
        actions.push({
          id: `flip-card-${project.id}`,
          label: flipCardLabel,
          icon: <FlipHorizontal className="h-4 w-4 text-indigo-500" />,
          description: "",
          shortcut: `${project.id}`,
          category: t("actionSearch.projects.category", "Navigate through project cards"),
          action: () => {
            flipProjectCard(project.id)
            setOpen(false)
          },
          showOn: ["/projects"],
        })
      }
    })

    return actions
  }, [isProjectsPage, closeFlippedCard, navigateCards, flipProjectCard, t, i18n.language])

  // Define blog-specific actions
  const createBlogActions = useCallback(() => {
    const actions = []

    if (isBlogPage && !isBlogPostPage) {
      // Blog list actions
      actions.push(
        {
          id: "blog-next-post",
          label: t("actionSearch.blog.next", "Next post"),
          icon: <ArrowDown className="h-4 w-4 text-blue-500" />,
          description: t("actionSearch.blog.nextDescription", "Navigate to the next post in the list"),
          shortcut: "j",
          category: t("actionSearch.blog.category", "Navigate through blog posts"),
          action: () => {
            navigateBlogPosts("next")
            setOpen(false)
          },
          showOn: ["/blog"],
        },
        {
          id: "blog-prev-post",
          label: t("actionSearch.blog.prev", "Previous post"),
          icon: <ArrowUp className="h-4 w-4 text-blue-500" />,
          description: t("actionSearch.blog.prevDescription", "Navigate to the previous post in the list"),
          shortcut: "k",
          category: t("actionSearch.blog.category", "Navigate through blog posts"),
          action: () => {
            navigateBlogPosts("prev")
            setOpen(false)
          },
          showOn: ["/blog"],
        },
        {
          id: "blog-search",
          label: t("actionSearch.blog.search", "Search blog posts"),
          icon: <Search className="h-4 w-4 text-blue-500" />,
          description: t("actionSearch.blog.searchDescription", "Focus the blog search input"),
          shortcut: "s",
          category: t("actionSearch.blog.category", "Navigate through blog posts"),
          action: () => {
            const searchInput = document.querySelector('input[placeholder="Search posts..."]')
            if (searchInput) {
              searchInput.focus()
            }
            setOpen(false)
          },
          showOn: ["/blog"],
        },
        {
          id: "blog-filter-tags",
          label: t("actionSearch.blog.filterTag", "Filter blog posts"),
          icon: <Tag className="h-4 w-4 text-green-500" />,
          description: t("actionSearch.blog.filterTag", "Open filter menu"),
          category: t("actionSearch.blog.category", "Navigate through blog posts"),
          action: () => {
            const filterButton = document.querySelector("button:has(.lucide-filter)")
            if (filterButton) {
              filterButton.click()
            }
            setOpen(false)
          },
          showOn: ["/blog"],
        },
      )

      // Add actions for jumping to posts 1-9
      for (let i = 1; i <= 9; i++) {
        actions.push({
          id: `jump-to-post-${i}`,
          label: t("actionSearch.blog.jumpToPost", { i: i }),
          icon: <BookOpen className="h-4 w-4 text-green-500" />,
          description: "", // t("actionSearch.blog.jumpToPostDescription", { i: i })
          shortcut: `${i}`,
          category: t("actionSearch.blog.category", "Navigate through blog posts"),
          action: () => {
            // Simulate pressing the number key
            const event = new KeyboardEvent("keydown", {
              key: `${i}`,
              bubbles: true,
            })
            document.dispatchEvent(event)
            setOpen(false)
          },
          showOn: ["/blog"],
        })
      }
    } else if (isBlogPostPage) {
      // Blog post navigation actions
      actions.push(
        {
          id: "blog-post-prev",
          label: t("actionSearch.blog.prev", "Previous post"),
          icon: <ArrowLeft className="h-4 w-4 text-blue-500" />,
          description: t("actionSearch.blog.prevDescription", "Navigate to the previous post"),
          shortcut: "h",
          category: t("actionSearch.blog.category", "Navigate through blog posts"),
          action: () => {
            navigateBlogPost("prev")
            setOpen(false)
          },
          showOn: ["/blog/"],
        },
        {
          id: "blog-post-next",
          label: t("actionSearch.blog.next", "Next post"),
          icon: <ArrowRight className="h-4 w-4 text-blue-500" />,
          description: t("actionSearch.blog.nextDescription", "Navigate to the next post in the list"),
          shortcut: "l",
          category: t("actionSearch.blog.category", "Navigate through blog posts"),
          action: () => {
            navigateBlogPost("next")
            setOpen(false)
          },
          showOn: ["/blog/"],
        },
        {
          id: "blog-post-back",
          label: t("actionSearch.blog.back", "Back to blog list"),
          icon: <ArrowLeft className="h-4 w-4 text-blue-500" />,
          description: t("actionSearch.blog.backDescription", "Return to the blog list page"),
          shortcut: "b",
          category: t("actionSearch.blog.category", "Navigate through blog posts"),
          action: () => {
            router.push("/blog")
            setOpen(false)
          },
          showOn: ["/blog/"],
        },
      )
    }

    return actions
  }, [isBlogPage, isBlogPostPage, navigateBlogPosts, navigateBlogPost, router, t])

  // Define about page actions
  const createAboutPageActions = useCallback(() => {
    if (!isAboutPage) return []

    const actions = []

    // Add actions for chapters 1-5
    for (let i = 1; i <= 5; i++) {
      actions.push({
        id: `jump-to-chapter-${i}`,
        label: t("actionSearch.about.jumpToChapter", { i: i }),
        icon: <BookOpen className="h-4 w-4 text-green-500" />,
        description: "", // t("actionSearch.about.jumpToChapterDescription", { i: i })
        shortcut: `${i}`,
        category: t("actionSearch.about.category", "Navigate through about sections"),
        action: () => {
          jumpToChapter(i)
          setOpen(false)
        },
        showOn: ["/about"],
      })
    }

    return actions
  }, [isAboutPage, jumpToChapter, t])

  // Define now page actions
  const createNowPageActions = useCallback(() => {
    if (!isNowPage) return []

    const actions = []

    // Get unique categories
    const categories = [...new Set(nowItems.map((item) => item.category))]

    // Create icon mapping
    const iconMapping = {
      reading: <BookOpen className="h-4 w-4 text-green-500" />,
      coding: <Code className="h-4 w-4 text-blue-500" />,
      drinking: <Coffee className="h-4 w-4 text-brown-500" />,
      listening: <Headphones className="h-4 w-4 text-purple-500" />,
      thinking: <Brain className="h-4 w-4 text-pink-500" />,
      studying: <GraduationCap className="h-4 w-4 text-yellow-500" />,
      planning: <Lightbulb className="h-4 w-4 text-orange-500" />,
    }

    // Add actions for each category
    categories.forEach((category, index) => {
      const categoryLabel = t(`now.categories.${category}`) // Resolve category name
      const jumpToLabel = t("actionSearch.now.jumpToCategory", { category: categoryLabel }) // Resolve "Jump to <category>"
      const jumpToLabelDescription = t("actionSearch.now.jumpToCategoryDescription", { category: categoryLabel }) // Resolve "Jump to <category>"
      actions.push({
        id: `jump-to-category-${category}`,
        label: jumpToLabel,
        icon: iconMapping[category] || <Clock className="h-4 w-4 text-gray-500" />,
        description: "", // jumpToLabelDescription
        shortcut: `${index + 1}`,
        category: t("actionSearch.about.category", "Navigate through now sections"),
        action: () => {
          jumpToCategory(category)
          setOpen(false)
        },
        showOn: ["/now"],
      })
    })

    return actions
  }, [isNowPage, t, jumpToCategory])

  // Define uses page actions
  const createUsesPageActions = useCallback(() => {
    if (!isUsesPage) return []

    const actions = []

    // Create icon mapping for uses categories
    const iconMapping = [
      <Laptop className="h-4 w-4 text-blue-500" key="laptop" />,
      <Smartphone className="h-4 w-4 text-green-500" key="smartphone" />,
      <Headphones className="h-4 w-4 text-purple-500" key="headphones" />,
      <Globe className="h-4 w-4 text-cyan-500" key="globe" />,
      <Code className="h-4 w-4 text-indigo-500" key="code" />,
      <Coffee className="h-4 w-4 text-brown-500" key="coffee" />,
      <Shield className="h-4 w-4 text-red-500" key="shield" />,
      <Settings className="h-4 w-4 text-gray-500" key="settings" />,
      <Map className="h-4 w-4 text-green-500" key="map" />,
      <Gamepad2 className="h-4 w-4 text-pink-500" key="gamepad" />,
      <ImageIcon className="h-4 w-4 text-orange-500" key="image" />,
    ]

    // Add actions for each category (1-9, 0, -)
    const usesCategories = [
      "hardware",
      "mobile",
      "audio",
      "os",
      "development",
      "email",
      "privacy",
      "mobile_tools",
      "mapping",
      "gaming",
      "multimedia",
    ]

    usesCategories.forEach((category, index) => {
      let shortcut
      if (index < 9) {
        shortcut = `${index + 1}`
      } else if (index === 9) {
        shortcut = "0"
      } else {
        shortcut = "-"
      }
      const usesLabel = t(`uses.categories.${category}`) // Resolve category name
      const jumpToUses = t("actionSearch.uses.jumpToCategory", { category: usesLabel }) // Resolve "Jump to <category>"
      const jumpToUsesDescription = t("actionSearch.uses.jumpToCategoryDescription", { category: usesLabel }) // Resolve "Jump to <category>"
      actions.push({
        id: `jump-to-uses-category-${index + 1}`,
        label: jumpToUses,
        icon: iconMapping[index] || <Clock className="h-4 w-4 text-gray-500" />,
        description: "", // jumpToUsesDescription
        shortcut: shortcut,
        category: t("actionSearch.uses.category", "Navigate through uses sections"),
        action: () => {
          jumpToUsesCategory(index + 1)
          setOpen(false)
        },
        showOn: ["/uses"],
      })
    })

    return actions
  }, [isUsesPage, t, jumpToUsesCategory])

  // Define colophon page actions
  const createColophonPageActions = useCallback(() => {
    if (!isColophonPage) return []

    const actions = []

    // Create icon mapping for colophon sections
    const iconMapping = [
      <Palette className="h-4 w-4 text-purple-500" key="palette" />,
      <Code className="h-4 w-4 text-blue-500" key="code" />,
      <Server className="h-4 w-4 text-green-500" key="server" />,
      <BookOpen className="h-4 w-4 text-orange-500" key="book" />,
    ]

    // Add actions for each section (1-4)
    const colophonSections = ["siteHistory", "technologyStack", "hosting", "inspiration"]

    colophonSections.forEach((section, index) => {
      const colophonLabel = t(`colophon.${section}.title`) // Resolve category name
      const jumpToColophon = t("actionSearch.colophon.jumpToSection", { section: colophonLabel }) // Resolve "Jump to <category>"
      const jumpToColophonDescription = t("actionSearch.colophon.jumpToSectionDescription", { section: colophonLabel }) // Resolve "Jump to <category>"
      actions.push({
        id: `jump-to-colophon-section-${index + 1}`,
        label: jumpToColophon,
        icon: iconMapping[index] || <FileText className="h-4 w-4 text-gray-500" />,
        description: "", // jumpToColophonDescription
        shortcut: `${index + 1}`,
        category: t("actionSearch.colophon.category", "Navigate through colophon sections"),
        action: () => {
          jumpToColophonSection(index + 1)
          setOpen(false)
        },
        showOn: ["/colophon"],
      })
    })

    return actions
  }, [isColophonPage, t, jumpToColophonSection])

  // Combine all actions
  const allActions = useCallback(() => {
    return [
      ...createNavigationActions(),
      ...createThemeAndLanguageActions(),
      ...createGeneralActions(),
      ...createProjectActions(),
      ...createBlogActions(),
      ...createAboutPageActions(),
      ...createNowPageActions(),
      ...createUsesPageActions(),
      ...createColophonPageActions(),
    ]
  }, [
    createNavigationActions,
    createThemeAndLanguageActions,
    createGeneralActions,
    createProjectActions,
    createBlogActions,
    createAboutPageActions,
    createNowPageActions,
    createUsesPageActions,
    createColophonPageActions,
  ])

  // Filter actions based on current path
  const filteredActionsByPath = useCallback(
    (actions) => {
      return actions.filter((action) => {
        // If the action has showOn property, check if current path includes any of the paths
        if (action.showOn) {
          return action.showOn.some((path) => pathname?.includes(path))
        }
        // If no showOn property, always show the action
        return true
      })
    },
    [pathname],
  )

  // Filter actions based on search query
  const filteredActions = debouncedQuery
    ? filteredActionsByPath(allActions()).filter((action) => {
        const searchableText = `${action.label} ${action.description || ""}`.toLowerCase()
        return searchableText.includes(debouncedQuery.toLowerCase())
      })
    : filteredActionsByPath(allActions())

  // Group actions by category
  const groupedActions = filteredActions.reduce((acc, action) => {
    if (!acc[action.category]) {
      acc[action.category] = []
    }
    acc[action.category].push(action)
    return acc
  }, {})

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open search bar with period key
      if (e.key === "." && !open) {
        e.preventDefault()
        setOpen(true)
        return
      }

      if (!open) return

      // Close with Escape
      if (e.key === "Escape") {
        setOpen(false)
        return
      }

      // Navigate with arrow keys
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length)
      } else if (e.key === "Enter" && filteredActions.length > 0) {
        e.preventDefault()
        filteredActions[selectedIndex].action()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, filteredActions, selectedIndex])

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
      setQuery("")
      setSelectedIndex(0)
    }
  }, [open])

  if (!mounted) return null

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <div className="p-4 pb-2">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder={t("actionSearch.placeholder", "Search actions...")}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              className="pl-10 pr-4 h-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <AnimatePresence mode="wait">
            {filteredActions.length > 0 ? (
              <motion.div variants={container} initial="hidden" animate="show" className="pb-2">
                {Object.entries(groupedActions).map(([category, actions]) => (
                  <div key={category} className="px-2">
                    <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">{category}</div>
                    {actions.map((action) => {
                      const actionIndex = filteredActions.findIndex((a) => a.id === action.id)
                      const isSelected = actionIndex === selectedIndex

                      return (
                        <motion.div
                          key={action.id}
                          variants={item}
                          className={`px-2 py-1.5 flex items-center justify-between rounded-md cursor-pointer ${
                            isSelected ? "bg-muted" : "hover:bg-muted/50"
                          }`}
                          onClick={() => action.action()}
                          onMouseEnter={() => setSelectedIndex(actionIndex)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="flex-shrink-0">{action.icon}</span>
                            <span className="text-sm font-medium">{action.label}</span>
                            {action.description && (
                              <span className="text-xs text-muted-foreground">{action.description}</span>
                            )}
                          </div>
                          {action.shortcut && <KeyboardShortcut>{action.shortcut}</KeyboardShortcut>}
                        </motion.div>
                      )
                    })}
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4 py-8 text-center"
              >
                <p className="text-muted-foreground">No actions found</p>
              </motion.div>
            )}
          </AnimatePresence>
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
}
