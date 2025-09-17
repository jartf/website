"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useTheme } from "next-themes"
import Image from "next/image"
import {
  Mail,
  GraduationCap,
  MessageSquare,
  Send,
  Phone,
  Facebook,
  Calendar,
  AtSign,
  ImageIcon,
  Cloud,
  Twitter,
  FileCode,
  User,
  Github,
  Code,
  Globe,
  Map,
  ExternalLink,
  Info,
  Coffee,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
// Update the import to use i18next directly
import i18n from "i18next"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Firefly } from "@/components/firefly"

interface SocialLink {
  name: string
  icon: React.ReactNode
  url?: string
  color: string
  group: "contact" | "social" | "other"
  note?: string
  fullWidth?: boolean
  isAgeRestricted?: boolean
  showOnlyIn?: string[]
  action?: () => void
  isQRCode?: boolean
  qrImage?: string
  qrAlt?: string
}

export default function ContactPageClient() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [secretRevealed, setSecretRevealed] = useState(false)

  const handleSecretButtonClick = () => {
    if (!secretRevealed) {
      setSecretRevealed(true)
    } else {
      window.open("https://ko-fi.com/jarema", "_blank")
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Helper function to get the appropriate pronouns.page URL based on language
  const getPronounsPageUrl = () => {
    switch (i18n.language) {
      case "ru":
        return "https://ru.pronouns.page/@jerryv"
      case "vi":
        return "https://vi.pronouns.page/@jerryv"
      case "tr":
        return "https://tr.pronouns.page/@jerryv"
      case "zh":
        return "https://zh.pronouns.page/@jerryv"
      default:
        return "https://en.pronouns.page/@jerryv"
    }
  }

  const socialLinks: SocialLink[] = [
    {
      name: "Matrix",
      icon: <Mail className="h-6 w-6" />,
      url: "https://matrix.to/#/@jar:jarema.me",
      color: "hover:bg-blue-600 hover:text-white",
      group: "contact",
    },
    {
      name: "Discord",
      icon: <MessageSquare className="h-6 w-6" />,
      url: "https://discord.com/users/444078929314185217",
      color: "hover:bg-indigo-600 hover:text-white",
      group: "contact",
    },
    {
      name: "Email",
      icon: <Mail className="h-6 w-6" />,
      url: "mailto:hi@jar.tf",
      color: "hover:bg-blue-600 hover:text-white",
      group: "contact",
    },
    {
      name: t("contact.links.universityEmail"),
      icon: <GraduationCap className="h-6 w-6" />,
      url: "mailto:VuVietAnh-KTQT50C10404@dav.edu.vn",
      color: "hover:bg-blue-600 hover:text-white",
      group: "contact",
    },
    {
      name: "Signal",
      icon: <Phone className="h-6 w-6" />,
      url: "https://signal.me/#eu/wHpqXqMSQ6LSg0zijVcCCWm5PK5gwshaDFOAg0aj-aq5BSs94E9CLJ5ThNuy4t6A",
      color: "hover:bg-blue-400 hover:text-white",
      group: "contact",
    },
    {
      name: "Telegram",
      icon: <Send className="h-6 w-6" />,
      url: "https://t.me/jaremame",
      color: "hover:bg-sky-500 hover:text-white",
      group: "contact",
    },
    {
      name: "Zalo",
      icon: <MessageCircle className="h-6 w-6" />,
      url: "https://zaloapp.com/qr/p/ryw96g1vmzmw",
      color: "hover:bg-blue-500 hover:text-white",
      group: "contact",
      showOnlyIn: ["vi"],
      isQRCode: true,
      qrImage: "/zalo-qr.jpeg",
      qrAlt: "Zalo QR Code",
    },
    {
      name: "微信",
      icon: <MessageCircle className="h-6 w-6" />,
      url: "https://u.wechat.com/kOt1MXULWMfPeyQkEmrh8uQ?s=0",
      color: "hover:bg-green-600 hover:text-white",
      group: "contact",
      showOnlyIn: ["zh"],
      isQRCode: true,
      qrImage: "/wechat-qr.png",
      qrAlt: "WeChat QR Code",
    },
    {
      name: t("contact.links.bookMeeting"),
      icon: <Calendar className="h-6 w-6" />,
      url: "https://cal.com/jaremaa/secret",
      color: "hover:bg-white hover:text-black",
      group: "contact",
      fullWidth: !["vi", "zh"].includes(i18n.language),
    },
    {
      name: "Akkoma",
      icon: <MessageSquare className="h-6 w-6" />,
      url: "https://blob.cat/jar",
      color: "hover:bg-purple-600 hover:text-white",
      group: "social",
    },
    {
      name: "Mastodon",
      icon: <MessageSquare className="h-6 w-6" />,
      url: "https://toot.io/@jar",
      color: "hover:bg-purple-600 hover:text-white",
      group: "social",
    },
    {
      name: "Bluesky",
      icon: <Cloud className="h-6 w-6" />,
      url: "https://bsky.app/profile/jarema.me",
      color: "hover:bg-sky-500 hover:text-white",
      group: "social",
    },
    {
      name: "Twitter / X",
      icon: <Twitter className="h-6 w-6" />,
      url: "https://twitter.com/jarema_me",
      color: "hover:bg-gray-800 hover:text-white",
      group: "social",
    },
    {
      name: "Dev.to",
      icon: <FileCode className="h-6 w-6" />,
      url: "https://dev.to/jartf",
      color: "hover:bg-gray-800 hover:text-white",
      group: "social",
    },
    {
      name: "Threads",
      icon: <AtSign className="h-6 w-6" />,
      url: "https://threads.net/@jarema.me",
      color: "hover:bg-gray-800 hover:text-white",
      group: "social",
    },
    {
      name: "Instagram",
      icon: <ImageIcon className="h-6 w-6" />,
      url: "https://instagram.com/jarema.me",
      color: "hover:bg-pink-600 hover:text-white",
      group: "social",
    },
    {
      name: "Messenger",
      icon: <Facebook className="h-6 w-6" />,
      url: "https://m.me/jaremajarosz",
      color: "hover:bg-blue-500 hover:text-white",
      group: "social",
      note: t("contact.links.messengerNote"),
    },
    {
      name: i18n.language === "ru" ? "Pronouns.page (18+)" : "Pronouns.page",
      icon: <User className="h-6 w-6" />,
      url: getPronounsPageUrl(),
      color: "hover:bg-violet-600 hover:text-white",
      group: "other",
      note:
        i18n.language === "ru"
          ? "Этот сайт имеет возрастное ограничение 18+. Оставаясь на сайте, вы подтверждаете, что достигли совершеннолетия, и самостоятельно несёте ответственность за свои действия."
          : undefined,
      isAgeRestricted: i18n.language === "ru",
    },
    {
      name: "GitHub",
      icon: <Github className="h-6 w-6" />,
      url: "https://github.com/jartf",
      color: "hover:bg-gray-800 hover:text-white",
      group: "other",
    },
    {
      name: "GitLab",
      icon: <Code className="h-6 w-6" />,
      url: "https://gitlab.com/jartf",
      color: "hover:bg-orange-600 hover:text-white",
      group: "other",
    },
    {
      name: "Google Developer",
      icon: <Code className="h-6 w-6" />,
      url: "https://g.dev/jarema",
      color: "hover:bg-blue-600 hover:text-white",
      group: "other",
    },
    {
      name: "IndieWeb",
      icon: <Globe className="h-6 w-6" />,
      url: "https://indieweb.org/User:Jarema.me",
      color: "hover:bg-indigo-600 hover:text-white",
      group: "other",
    },
    {
      name: "OpenStreetMap",
      icon: <Map className="h-6 w-6" />,
      url: "https://openstreetmap.org/user/Equate",
      color: "hover:bg-green-600 hover:text-white",
      group: "other",
    },
    {
      name: "Waze Map Editor",
      icon: <Map className="h-6 w-6" />,
      url: "https://www.waze.com/en/user/editor/vanhv",
      color: "hover:bg-blue-500 hover:text-white",
      group: "other",
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
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("contact.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("contact.description")}</p>
          </div>

          <motion.div className="grid gap-8" variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="text-center">
              <p className="text-xl mb-2 lowercase">{t("contact.message")}</p>
              <p className="text-muted-foreground italic mb-8 lowercase">{t("contact.disclaimer")}</p>
            </motion.div>

            <motion.div variants={item}>
              <h2 className="text-2xl font-bold mb-4">{t("contact.sectionTitles.contactMe")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {socialLinks
                  .filter((link) => link.group === "contact")
                  .filter((link) => !link.showOnlyIn || link.showOnlyIn.includes(i18n.language))
                  .map((link) => {
                    // Special handling for QR code links
                    if (link.isQRCode && link.qrImage) {
                      return (
                        <Dialog key={link.name}>
                          <DialogTrigger asChild>
                            <button
                              className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors ${link.color}`}
                            >
                              {link.icon}
                              <span>{link.name}</span>
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <div className="flex flex-col items-center justify-center p-4">
                              <div className="relative w-full max-w-sm aspect-square mb-4">
                                <Image
                                  src={link.qrImage || "/placeholder.svg"}
                                  alt={link.qrAlt || "QR Code"}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              {link.url && (
                                <Button variant="outline" asChild className="mt-2">
                                  <Link href={link.url} target="_blank" rel="noopener noreferrer">
                                    {i18n.language === "vi"
                                      ? "Mở Zalo"
                                      : i18n.language === "zh"
                                        ? "打开微信"
                                        : "Open App"}
                                    <ExternalLink className="h-4 w-4 ml-2" />
                                  </Link>
                                </Button>
                              )}
                              <p className="text-center text-muted-foreground mt-2">
                                {i18n.language === "zh" && link.name === "微信"
                                  ? "扫一扫上面的二维码图案，加我为朋友。"
                                  : i18n.language === "vi" && link.name === "Zalo"
                                    ? "Quét mã QR để kết nối với tôi trên Zalo"
                                    : "Scan the QR code to connect with me"}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )
                    }

                    // Special handling for links with notes
                    if (link.note) {
                      return (
                        <div key={link.name} className={`${link.fullWidth ? "md:col-span-2" : ""}`}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={link.url || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 p-4 rounded-lg border transition-colors ${link.color} w-full`}
                                >
                                  <div className="flex items-center gap-3">
                                    {link.icon}
                                    <span>{link.name}</span>
                                    <ExternalLink className="h-4 w-4 opacity-70" />
                                    <Info className="h-4 w-4 hidden md:block" />
                                  </div>
                                  <p className="text-xs mt-1 md:hidden max-w-[200px] text-center">{link.note}</p>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <p>{link.note}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )
                    }

                    // Regular links without notes
                    return (
                      <Link
                        key={link.name}
                        href={link.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors ${
                          link.color
                        } ${link.fullWidth ? "md:col-span-2" : ""}`}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                        <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                      </Link>
                    )
                  })}
              </div>

              <h2 className="text-2xl font-bold mb-4">{t("contact.sectionTitles.socialMedia")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {socialLinks
                  .filter((link) => link.group === "social")
                  .map((link) => (
                    <Link
                      key={link.name}
                      href={link.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors ${link.color}`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                      <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                    </Link>
                  ))}
              </div>

              <h2 className="text-2xl font-bold mb-4">{t("contact.sectionTitles.otherPlatforms")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialLinks
                  .filter((link) => link.group === "other")
                  // Sort to move age restricted links to the end
                  .sort((a, b) => {
                    if (a.isAgeRestricted && !b.isAgeRestricted) return 1
                    if (!a.isAgeRestricted && b.isAgeRestricted) return -1
                    return 0
                  })
                  .map((link) => {
                    // For links with notes (like age restriction warnings)
                    if (link.note) {
                      return (
                        <div key={link.name}>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Link
                                  href={link.url || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`flex flex-col p-4 rounded-lg border transition-colors ${link.color} w-full`}
                                >
                                  <div className="flex items-center justify-center gap-3">
                                    {link.icon}
                                    <span>{link.name}</span>
                                    <ExternalLink className="h-4 w-4 opacity-70" />
                                    <Info className="h-4 w-4 hidden md:inline" />
                                  </div>
                                  {i18n.language === "ru" && (
                                    <p className="text-xs mt-2 text-center md:hidden">{link.note}</p>
                                  )}
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <p>{link.note}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      )
                    }

                    // Regular links without notes
                    return (
                      <Link
                        key={link.name}
                        href={link.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors ${link.color}`}
                      >
                        {link.icon}
                        <span>{link.name}</span>
                        <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
                      </Link>
                    )
                  })}

                {/* Secret Ko-fi Button */}
                <button
                  onClick={handleSecretButtonClick}
                  className="flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors bg-background hover:bg-[#FF5E5B] hover:text-white"
                >
                  <Coffee className="h-6 w-6" />
                  <span>{secretRevealed ? "Ko-fi" : t("contact.secretButton")}</span>
                  {secretRevealed && <ExternalLink className="h-4 w-4 ml-1 opacity-70" />}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
