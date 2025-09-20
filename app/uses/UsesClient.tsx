"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Firefly } from "@/components/firefly"
import {
  ExternalLink,
  Laptop,
  Headphones,
  Smartphone,
  Code,
  Coffee,
  Globe,
  Shield,
  ImageIcon,
  Map,
  Gamepad2,
  Palette,
  Camera,
  Video,
  Music,
  Settings,
  Lock,
  EyeOff,
} from "lucide-react"

type UsesCategory = {
  title: string
  icon: React.ReactNode
  items: {
    name: string
    descriptionKey: string
    link?: string
  }[]
  subsections?: {
    title: string
    icon?: React.ReactNode
    items: {
      name: string
      descriptionKey?: string
      description?: string
      link?: string
    }[]
  }[]
}

export default function UsesClientPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [revancedClicks, setRevancedClicks] = useState(0)
  const [stremioClicks, setStremioClicks] = useState(0)
  const categoryRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Skip if user is typing in an input, textarea, or contentEditable element
        if (
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement ||
          (document.activeElement && document.activeElement.getAttribute("contenteditable") === "true")
        ) {
          return
        }

        // Check if the key pressed is a number between 1-9, 0 for 10th, or - for 11th
        let categoryIndex = -1
        if (e.key >= "1" && e.key <= "9") {
          categoryIndex = Number.parseInt(e.key) - 1
        } else if (e.key === "0") {
          categoryIndex = 9 // 10th category
        } else if (e.key === "-") {
          categoryIndex = 10 // 11th category
        }

        if (categoryIndex >= 0 && categoryIndex < categoryRefs.current.length) {
          e.preventDefault()

          // Scroll to the category
          if (categoryRefs.current[categoryIndex]) {
            categoryRefs.current[categoryIndex]?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })

            // Add a brief highlight effect
            const categoryElement = categoryRefs.current[categoryIndex]
            if (categoryElement) {
              categoryElement.classList.add("ring-2", "ring-primary", "ring-offset-2")
              setTimeout(() => {
                categoryElement.classList.remove("ring-2", "ring-primary", "ring-offset-2")
              }, 1000)

              // Announce to screen readers
              const categoryTitle = categoryElement.querySelector("h2")?.textContent
              const announcement = document.getElementById("keyboard-announcement")
              if (announcement && categoryTitle) {
                announcement.textContent = `Jumped to ${categoryTitle}`
              }
            }
          }
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }
  }, [mounted])

  if (!mounted) return null

  const handleRevancedClick = () => {
    setRevancedClicks((prev) => prev + 1)
  }

  const handleStremioClick = () => {
    setStremioClicks((prev) => prev + 1)
  }

  const categories: UsesCategory[] = [
    {
      title: "hardware",
      icon: <Laptop className="h-6 w-6" />,
      items: [
        {
          name: 'MSI Modern 15 (15.6")',
          descriptionKey: "ryzen",
        },
        {
          name: "WD My Passport 1TB",
          descriptionKey: "externalHDD",
        },
        {
          name: "Leaven K780 RGB",
          descriptionKey: "mechanicalKeyboard",
        },
        {
          name: "Logitech G304",
          descriptionKey: "wirelessMouse",
          link: "https://www.logitechg.com/en-us/products/gaming-mice/g304-lightspeed-wireless-gaming-mouse.html",
        },
      ],
    },
    {
      title: "mobile",
      icon: <Smartphone className="h-6 w-6" />,
      items: [
        {
          name: "Samsung Galaxy S20 Ultra",
          descriptionKey: "mainPhone",
          link: "https://www.samsung.com/us/mobile/galaxy-s20-5g/instore/",
        },
        {
          name: "LG V50 ThinQ 5G",
          descriptionKey: "secondaryPhone",
          link: "https://www.lg.com/us/mobile-phones/v50-thinq",
        },
        {
          name: "Samsung Galaxy Watch4 LTE",
          descriptionKey: "smartwatch",
          link: "https://www.samsung.com/global/galaxy/galaxy-watch4/",
        },
      ],
    },
    {
      title: "audio",
      icon: <Headphones className="h-6 w-6" />,
      items: [
        {
          name: "Samsung Galaxy Buds2",
          descriptionKey: "primaryEarbuds",
          link: "https://www.samsung.com/us/app/mobile-audio/galaxy-buds2/",
        },
        {
          name: "Soundcore R50i",
          descriptionKey: "backupEarbuds",
          link: "https://versus.com/en/anker-soundcore-r50i",
        },
      ],
    },
    {
      title: "os",
      icon: <Globe className="h-6 w-6" />,
      items: [
        {
          name: "Fedora Linux / Windows 11",
          descriptionKey: "dualBoot",
        },
        {
          name: "Firefox",
          descriptionKey: "primaryBrowser",
          link: "https://www.mozilla.org/firefox/",
        },
        {
          name: "Brave",
          descriptionKey: "secondaryBrowser",
          link: "https://brave.com/",
        },
      ],
    },
    {
      title: "development",
      icon: <Code className="h-6 w-6" />,
      items: [
        {
          name: "VS Code",
          descriptionKey: "primaryCodeEditor",
          link: "https://code.visualstudio.com/",
        },
        {
          name: "Warp / Black Box",
          descriptionKey: "terminalEmulators",
          link: "https://www.warp.dev/",
        },
        {
          name: "Git",
          descriptionKey: "versionControl",
        },
        {
          name: "Postman",
          descriptionKey: "apiTesting",
          link: "https://www.postman.com/",
        },
        {
          name: "MySQL",
          descriptionKey: "databaseManagement",
        },
        {
          name: "GitHub",
          descriptionKey: "codeHosting",
          link: "https://github.com/",
        },
        {
          name: "Vercel",
          descriptionKey: "webHosting",
          link: "https://vercel.com/",
        },
        {
          name: "Cloudflare",
          descriptionKey: "ddosProtection",
          link: "https://www.cloudflare.com/",
        },
      ],
    },
    {
      title: "email",
      icon: <Coffee className="h-6 w-6" />,
      items: [
        {
          name: "Betterbird",
          descriptionKey: "desktopEmail",
          link: "https://www.betterbird.eu/",
        },
        {
          name: "Spark",
          descriptionKey: "emailClient",
          link: "https://sparkmailapp.com/",
        },
        {
          name: "Zoho",
          descriptionKey: "domainEmail",
          link: "https://www.zoho.com/mail/",
        },
        {
          name: "Workflowy",
          descriptionKey: "taskManagement",
          link: "https://workflowy.com/",
        },
        {
          name: "Google Calendar",
          descriptionKey: "calendar",
        },
        {
          name: "Toggl",
          descriptionKey: "timeTracking",
          link: "https://toggl.com/",
        },
        {
          name: "Zapier",
          descriptionKey: "automationTool",
          link: "https://zapier.com/",
        },
        {
          name: "KDE Connect",
          descriptionKey: "phoneLinking",
          link: "https://kdeconnect.kde.org/",
        },
        {
          name: "Notesnook",
          descriptionKey: "noteTaking",
          link: "https://notesnook.com/",
        },
        {
          name: "Microsoft Office Online",
          descriptionKey: "officeSuite",
        },
        {
          name: "Self-hosted Nextcloud",
          descriptionKey: "cloudStorage",
          link: "https://nextcloud.com/",
        },
      ],
    },
    {
      title: "privacy",
      icon: <Shield className="h-6 w-6" />,
      items: [
        {
          name: "Windscribe",
          descriptionKey: "vpn",
          link: "https://windscribe.com/",
        },
        {
          name: "Bitwarden",
          descriptionKey: "passwordManager",
          link: "https://bitwarden.com/",
        },
        {
          name: "Ente Auth",
          descriptionKey: "twoFactorAuth",
          link: "https://ente.io/",
        },
        {
          name: "RethinkDNS",
          descriptionKey: "dnsProvider",
          link: "https://rethinkdns.com/",
        },
        {
          name: "Brave Search",
          descriptionKey: "privacySearch",
          link: "https://search.brave.com/",
        },
        {
          name: "Tailscale",
          descriptionKey: "networkVpn",
          link: "https://tailscale.com/",
        },
      ],
    },
    {
      title: "mobile_tools",
      icon: <Settings className="h-6 w-6" />,
      items: [
        {
          name: "LGUP",
          descriptionKey: "lgFirmware",
          link: "https://xdaforums.com/t/lgup-1-16-3-patched-setup-installer-w-lgmobile-drivers-and-common_dll.4304181/",
        },
        {
          name: "QFIL",
          descriptionKey: "qualcommFlash",
          link: "https://qfiltool.com/",
        },
        {
          name: "Odin",
          descriptionKey: "samsungFirmware",
          link: "https://xdaforums.com/t/patched-odin-3-13-1.3762572/",
        },
        {
          name: "SamFW",
          descriptionKey: "samsungDownload",
          link: "https://samfw.com/",
        },
        {
          name: "3uTools",
          descriptionKey: "iosManagement",
          link: "https://www.3u.com/",
        },
      ],
    },
    {
      title: "mapping",
      icon: <Map className="h-6 w-6" />,
      items: [
        {
          name: "QGIS",
          descriptionKey: "geographicSystem",
          link: "https://qgis.org/",
        },
        {
          name: "iD Editor",
          descriptionKey: "webOpenstreetmap",
          link: "https://wiki.openstreetmap.org/wiki/ID",
        },
        {
          name: "JOSM",
          descriptionKey: "desktopOpenstreetmap",
          link: "https://josm.openstreetmap.de/",
        },
        {
          name: "Vespucci",
          descriptionKey: "mobileOpenstreetmap",
          link: "https://vespucci.io/",
        },
        {
          name: "StreetComplete",
          descriptionKey: "mobileContributor",
          link: "https://streetcomplete.app/",
        },
        {
          name: "Waze Map Editor",
          descriptionKey: "communityNavigation",
          link: "https://www.waze.com/en/user/editor/vanhv",
        },
      ],
    },
    {
      title: "gaming",
      icon: <Gamepad2 className="h-6 w-6" />,
      items: [
        {
          name: "Lunar Client",
          descriptionKey: "minecraftClient",
          link: "https://www.lunarclient.com/",
        },
        {
          name: "Steam",
          descriptionKey: "gameDistribution",
          link: "https://store.steampowered.com/",
        },
        {
          name: "Epic Games",
          descriptionKey: "gameLauncher",
          link: "https://www.epicgames.com/",
        },
        {
          name: "itch.io",
          descriptionKey: "indieMarketplace",
          link: "https://itch.io/",
        },
      ],
    },
    {
      title: "multimedia",
      icon: <ImageIcon className="h-6 w-6" />,
      items: [],
      subsections: [
        {
          title: "design",
          icon: <Palette className="h-5 w-5" />,
          items: [
            {
              name: "Adobe Illustrator",
              descriptionKey: "vectorGraphics",
              link: "https://www.adobe.com/products/illustrator.html",
            },
            {
              name: "Figma",
              descriptionKey: "uiUxDesign",
              link: "https://www.figma.com/",
            },
            {
              name: "Canva",
              descriptionKey: "graphicDesign",
              link: "https://www.canva.com/",
            },
            {
              name: "Krita",
              descriptionKey: "digitalPaintingDesktop",
              link: "https://krita.org/",
            },
            {
              name: "ibisPaint X",
              descriptionKey: "digitalPaintingMobile",
              link: "https://ibispaint.com/",
            },
          ],
        },
        {
          title: "photo",
          icon: <Camera className="h-5 w-5" />,
          items: [
            {
              name: "Adobe Photoshop",
              descriptionKey: "photoEditing",
              link: "https://www.adobe.com/products/photoshop.html",
            },
            {
              name: "GIMP",
              descriptionKey: "openSourceEditor",
              link: "https://www.gimp.org/",
            },
          ],
        },
        {
          title: "video",
          icon: <Video className="h-5 w-5" />,
          items: [
            {
              name: "Adobe Premiere Pro",
              descriptionKey: "professionalEditor",
              link: "https://www.adobe.com/products/premiere.html",
            },
            {
              name: "DaVinci Resolve",
              descriptionKey: "professionalEditorDavinci",
              link: "https://www.blackmagicdesign.com/products/davinciresolve/",
            },
            {
              name: "Kdenlive",
              descriptionKey: "openSourceVideoEditor",
              link: "https://kdenlive.org/",
            },
            {
              name: "CapCut",
              descriptionKey: "videoEditorCapcut",
              link: "https://www.capcut.com/",
            },
            {
              name: "Aegisub",
              descriptionKey: "subtitleEditor",
              link: "http://www.aegisub.org/",
            },
            {
              name: "VLC",
              descriptionKey: "videoPlayer",
              link: "https://www.videolan.org/vlc/",
            },
            {
              name: "Audacity",
              descriptionKey: "audioEditor",
              link: "https://www.audacityteam.org/",
            },
          ],
        },
        {
          title: "media",
          icon: <Music className="h-5 w-5" />,
          items: [
            {
              name: "YouTube Music",
              descriptionKey: "musicStreamingYoutube",
              link: "https://music.youtube.com/",
            },
            {
              name: "Spotify",
              descriptionKey: "musicStreamingSpotify",
              link: "https://www.spotify.com/",
            },
            {
              name: "YouTube",
              descriptionKey: "videoStreaming",
              link: "https://www.youtube.com/",
            },
            {
              name: "Unspeakable Platform 1",
              description: t("uses.hiddenPlatforms.click5"),
            },
            {
              name: "Unspeakable Platform 2",
              description: t("uses.hiddenPlatforms.click5"),
            },
          ],
        },
      ],
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      {theme === "dark" && <Firefly count={15} />}

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">{t("uses.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("uses.description")}{" "}
              <Link
                href="https://uses.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center"
              >
                uses.tech
                <ExternalLink className="h-4 w-4 ml-1" />
              </Link>
              , {t("uses.websiteDescription")}
            </p>
          </div>

          {/* Screen reader announcement */}
          <div className="sr-only" aria-live="polite" id="keyboard-announcement"></div>

          <motion.div className="flex flex-col gap-12" variants={container} initial="hidden" animate="show">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <motion.div
                variants={item}
                ref={(el) => (categoryRefs.current[0] = el)}
                id="category-hardware"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[0].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[0].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[0].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={item}
                ref={(el) => (categoryRefs.current[1] = el)}
                id="category-mobile"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[1].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[1].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[1].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <motion.div
                variants={item}
                ref={(el) => (categoryRefs.current[2] = el)}
                id="category-audio"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[2].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[2].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[2].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={item}
                ref={(el) => (categoryRefs.current[3] = el)}
                id="category-os"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[3].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[3].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[3].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <motion.div
                variants={item}
                ref={(el) => (categoryRefs.current[4] = el)}
                id="category-development"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[4].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[4].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[4].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={item}
                ref={(el) => (categoryRefs.current[5] = el)}
                id="category-email"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[5].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[5].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[5].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <motion.div
                variants={item}
                ref={(el) => (categoryRefs.current[6] = el)}
                id="category-privacy"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[6].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[6].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[6].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={item}
                ref={(el) => (categoryRefs.current[7] = el)}
                id="category-mobile_tools"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[7].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[7].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[7].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              <motion.div
                variants={item}
                ref={(el) => (categoryRefs.current[8] = el)}
                id="category-mapping"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[8].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[8].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[8].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={item}
                ref={(el) => (categoryRefs.current[9] = el)}
                id="category-gaming"
                className="transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">{categories[9].icon}</div>
                  <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[9].title}`)}</h2>
                </div>
                <div className="grid gap-6 ml-4">
                  {categories[9].items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                      <div>
                        <h3 className="text-xl font-medium">
                          {item.link ? (
                            <Link
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary inline-flex items-center"
                            >
                              {item.name}
                              <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                            </Link>
                          ) : (
                            item.name
                          )}
                        </h3>
                        <p className="text-muted-foreground">{t(`uses.itemDescriptions.${item.descriptionKey}`)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              variants={item}
              className="lg:col-span-2 transition-all duration-300"
              ref={(el) => (categoryRefs.current[10] = el)}
              id="category-multimedia"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-2 rounded-full">{categories[10].icon}</div>
                <h2 className="text-2xl font-bold">{t(`uses.categories.${categories[10].title}`)}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-4">
                {categories[10].subsections?.map((subsection, subIndex) => (
                  <div key={subIndex} className="space-y-6">
                    <div className="flex items-center gap-2 mb-3">
                      {subsection.icon && <div className="bg-primary/5 p-1.5 rounded-full">{subsection.icon}</div>}
                      <h3 className="text-xl font-medium">{t(`uses.subsections.${subsection.title}`)}</h3>
                    </div>

                    <div className="grid gap-6 ml-4">
                      {subsection.items.map((item, itemIndex) => {
                        // Special handling for the "unspeakable platforms"
                        if (item.name === "Unspeakable Platform 1") {
                          return (
                            <div key={itemIndex} className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                              <div className="cursor-pointer group" onClick={handleRevancedClick}>
                                <h4 className="text-lg font-medium flex items-center">
                                  {revancedClicks >= 5 ? (
                                    <>
                                      ReVanced
                                      <EyeOff className="h-4 w-4 ml-2 text-muted-foreground" />
                                    </>
                                  ) : (
                                    <>
                                      <span className="flex items-center">
                                        <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        {t("uses.hiddenPlatforms.platform1")}
                                      </span>
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        ({5 - revancedClicks} {t("uses.itemDescriptions.clicksRemaining")})
                                      </span>
                                    </>
                                  )}
                                </h4>
                                <p className="text-muted-foreground">
                                  {revancedClicks >= 5
                                    ? t(`uses.itemDescriptions.revancedDescription`)
                                    : t("uses.hiddenPlatforms.click5")}
                                </p>
                              </div>
                            </div>
                          )
                        }

                        if (item.name === "Unspeakable Platform 2") {
                          return (
                            <div key={itemIndex} className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                              <div className="cursor-pointer group" onClick={handleStremioClick}>
                                <h4 className="text-lg font-medium flex items-center">
                                  {stremioClicks >= 5 ? (
                                    <>
                                      Stremio
                                      <EyeOff className="h-4 w-4 ml-2 text-muted-foreground" />
                                    </>
                                  ) : (
                                    <>
                                      <span className="flex items-center">
                                        <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                                        {t("uses.hiddenPlatforms.platform2")}
                                      </span>
                                      <span className="ml-2 text-xs text-muted-foreground">
                                        ({5 - stremioClicks} {t("uses.itemDescriptions.clicksRemaining")})
                                      </span>
                                    </>
                                  )}
                                </h4>
                                <p className="text-muted-foreground">
                                  {stremioClicks >= 5
                                    ? t(`uses.itemDescriptions.stremioDescription`)
                                    : t("uses.hiddenPlatforms.click5")}
                                </p>
                              </div>
                            </div>
                          )
                        }

                        return (
                          <div key={itemIndex} className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1.5 w-3 h-3 rounded-full bg-primary"></div>
                            <div>
                              <h4 className="text-lg font-medium">
                                {item.link ? (
                                  <Link
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary inline-flex items-center"
                                  >
                                    {item.name}
                                    <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                                  </Link>
                                ) : (
                                  item.name
                                )}
                              </h4>
                              {item.descriptionKey ? (
                                <p className="text-muted-foreground">
                                  {t(`uses.itemDescriptions.${item.descriptionKey}`)}
                                </p>
                              ) : (
                                <p className="text-muted-foreground">{item.description}</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
