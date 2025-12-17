"use client"

import type React from "react"
import { useState, memo } from "react"
import { useTranslation } from "react-i18next"
import { DarkModeFirefly } from "@/components/firefly"
import Image from "next/image"
import Link from "next/link"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Firefly } from "@/components/firefly"
import { useMounted, useReducedMotion } from "@/hooks"
import i18n from "i18next"

const iconMap: Record<string, React.ReactNode> = {
  Mail: <Mail className="h-6 w-6" />,
  MessageSquare: <MessageSquare className="h-6 w-6" />,
  GraduationCap: <GraduationCap className="h-6 w-6" />,
  Phone: <Phone className="h-6 w-6" />,
  Send: <Send className="h-6 w-6" />,
  MessageCircle: <MessageCircle className="h-6 w-6" />,
  Calendar: <Calendar className="h-6 w-6" />,
  Cloud: <Cloud className="h-6 w-6" />,
  Twitter: <Twitter className="h-6 w-6" />,
  FileCode: <FileCode className="h-6 w-6" />,
  AtSign: <AtSign className="h-6 w-6" />,
  ImageIcon: <ImageIcon className="h-6 w-6" />,
  Facebook: <Facebook className="h-6 w-6" />,
  User: <User className="h-6 w-6" />,
  Github: <Github className="h-6 w-6" />,
  Code: <Code className="h-6 w-6" />,
  Globe: <Globe className="h-6 w-6" />,
  Map: <Map className="h-6 w-6" />,
}

interface SocialLinkData {
  name: string
  nameKey?: string
  iconName: string
  url?: string
  color: string
  showOnlyIn?: string[]
  isQRCode?: boolean
  qrImage?: string
  qrAlt?: string
  fullWidthUnless?: string[]
  noteKey?: string
  pronounsPageUrls?: Record<string, string>
  ruAgeRestricted?: boolean
}

interface ContactClientWrapperProps {
  socialLinksData: {
    contact: SocialLinkData[]
    social: SocialLinkData[]
    other: SocialLinkData[]
  }
}

export default memo(function ContactClientWrapper({ socialLinksData }: ContactClientWrapperProps) {
  const { t } = useTranslation()
  const mounted = useMounted()
  const prefersReducedMotion = useReducedMotion()
  const [secretRevealed, setSecretRevealed] = useState(false)

  const handleSecretButtonClick = () => {
    if (!secretRevealed) {
      setSecretRevealed(true)
    } else {
      window.open("https://ko-fi.com/jarema", "_blank")
    }
  }

  // Static content for no-JS users
  const staticContent = {
    title: mounted ? t("contact.title") : "Contact",
    description: mounted ? t("contact.description") : "Want to get in touch? Here's how you can reach me.",
    message: mounted ? t("contact.message") : "don't be shy. say hi. or book a 1:1 if you're feeling professional :)",
    disclaimer: mounted ? t("contact.disclaimer") : "i do respond to emails. probably. unless i get distracted by a bird or something idk",
    contactMe: mounted ? t("contact.sectionTitles.contactMe") : "Contact me",
    socialMedia: mounted ? t("contact.sectionTitles.socialMedia") : "Me on social media",
    otherPlatforms: mounted ? t("contact.sectionTitles.otherPlatforms") : "Me on other platforms",
    secretButton: mounted ? t("contact.secretButton") : "Secret button",
  }

  // Static link renderer for no-JS users (simplified, no tooltips/QR codes)
  const renderStaticLink = (link: SocialLinkData) => {
    const icon = iconMap[link.iconName]
    const displayName = link.name

    // Skip QR code links in static mode
    if (link.isQRCode) {
      return (
        <div
          key={link.name}
          className={`flex items-center justify-center gap-3 p-4 rounded-lg border ${link.color}`}
        >
          {icon}
          <span>{displayName}</span>
        </div>
      )
    }

    // Handle pronouns.page
    if (link.pronounsPageUrls) {
      const url = link.pronounsPageUrls.default || Object.values(link.pronounsPageUrls)[0]
      return (
        <Link
          key={link.name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors ${link.color}`}
        >
          {icon}
          <span>Pronouns.page</span>
          <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
        </Link>
      )
    }

    // Regular links
    if (!link.url) {
      return (
        <div
          key={link.name}
          className={`flex items-center justify-center gap-3 p-4 rounded-lg border ${link.color}`}
        >
          {icon}
          <span>{displayName}</span>
        </div>
      )
    }

    return (
      <Link
        key={link.name}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors ${link.color}`}
      >
        {icon}
        <span>{displayName}</span>
        <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
      </Link>
    )
  }

  // Static content for no-JS users
  if (!mounted) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden">
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{staticContent.title}</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{staticContent.description}</p>
            </div>

            <div className="grid gap-8">
              <div className="text-center">
                <p className="text-xl mb-2 lowercase">{staticContent.message}</p>
                <p className="text-muted-foreground italic mb-8 lowercase">{staticContent.disclaimer}</p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">{staticContent.contactMe}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                  {socialLinksData.contact.map((link) => renderStaticLink(link))}
                </div>

                <h2 className="text-2xl font-bold mb-4">{staticContent.socialMedia}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                  {socialLinksData.social.map((link) => renderStaticLink(link))}
                </div>

                <h2 className="text-2xl font-bold mb-4">{staticContent.otherPlatforms}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialLinksData.other.map((link) => renderStaticLink(link))}

                  {/* Secret Ko-fi Button */}
                  <div
                    className="flex items-center justify-center gap-3 p-4 rounded-lg border bg-background"
                  >
                    <Coffee className="h-6 w-6" />
                    <span>{staticContent.secretButton}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const currentLang = i18n.language

  const renderLink = (link: SocialLinkData, isFullWidth?: boolean) => {
    const icon = iconMap[link.iconName]
    const displayName = link.nameKey ? t(link.nameKey) : link.name
    const fullWidth = isFullWidth || (link.fullWidthUnless && !link.fullWidthUnless.includes(currentLang))

    // Handle QR code links
    if (link.isQRCode && link.qrImage) {
      return (
        <Dialog key={link.name}>
          <DialogTrigger asChild>
            <button
              className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors ${link.color}`}
            >
              {icon}
              <span>{displayName}</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center justify-center p-4">
              <div className="relative w-full max-w-sm aspect-square mb-4">
                <Image src={link.qrImage} alt={link.qrAlt || "QR Code"} fill className="object-contain" />
              </div>
              {link.url && (
                <Button variant="outline" asChild className="mt-2">
                  <Link href={link.url} target="_blank" rel="noopener noreferrer">
                    {currentLang === "vi" ? "Mở Zalo" : currentLang === "zh" ? "打开微信" : "Open App"}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              )}
              <p className="text-center text-muted-foreground mt-2">
                {currentLang === "zh" && link.name === "微信"
                  ? "扫一扫上面的二维码图案，加我为朋友。"
                  : currentLang === "vi" && link.name === "Zalo"
                    ? "Quét mã QR để kết nối với tôi trên Zalo"
                    : "Scan the QR code to connect with me"}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )
    }

    // Handle pronouns.page with language-specific URL
    if (link.pronounsPageUrls) {
      const url = link.pronounsPageUrls[currentLang] || link.pronounsPageUrls.default
      const name = currentLang === "ru" ? "Pronouns.page (18+)" : "Pronouns.page"
      const note = currentLang === "ru"
        ? "Этот сайт имеет возрастное ограничение 18+. Оставаясь на сайте, вы подтверждаете, что достигли совершеннолетия, и самостоятельно несёте ответственность за свои действия."
        : undefined

      if (note) {
        return (
          <div key={link.name}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col p-4 rounded-lg border transition-colors ${link.color} w-full`}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {icon}
                      <span>{name}</span>
                      <ExternalLink className="h-4 w-4 opacity-70" />
                      <Info className="h-4 w-4 hidden md:inline" />
                    </div>
                    {currentLang === "ru" && (
                      <p className="text-xs mt-2 text-center md:hidden">{note}</p>
                    )}
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p>{note}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      }

      return (
        <Link
          key={link.name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors ${link.color}`}
        >
          {icon}
          <span>{name}</span>
          <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
        </Link>
      )
    }

    // Handle links with notes
    if (link.noteKey) {
      const note = t(link.noteKey)
      return (
        <div key={link.name} className={fullWidth ? "md:col-span-2" : ""}>
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
                    {icon}
                    <span>{displayName}</span>
                    <ExternalLink className="h-4 w-4 opacity-70" />
                    <Info className="h-4 w-4 hidden md:block" />
                  </div>
                  <p className="text-xs mt-1 md:hidden max-w-[200px] text-center">{note}</p>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p>{note}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )
    }

    // Regular links
    return (
      <Link
        key={link.name}
        href={link.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors ${link.color} ${fullWidth ? "md:col-span-2" : ""}`}
      >
        {icon}
        <span>{displayName}</span>
        <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
      </Link>
    )
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <DarkModeFirefly count={15} />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("contact.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("contact.description")}</p>
          </div>

          <div
            className="grid gap-8"
            style={{
              animation: prefersReducedMotion ? "none" : "fadeInUp 0.5s ease-out",
            }}
          >
            <div
              className="text-center"
              style={{
                animation: prefersReducedMotion ? "none" : "fadeInUp 0.5s ease-out 0.1s both",
              }}
            >
              <p className="text-xl mb-2 lowercase">{t("contact.message")}</p>
              <p className="text-muted-foreground italic mb-8 lowercase">{t("contact.disclaimer")}</p>
            </div>

            <div
              style={{
                animation: prefersReducedMotion ? "none" : "fadeInUp 0.5s ease-out 0.2s both",
              }}
            >
              <h2 className="text-2xl font-bold mb-4">{t("contact.sectionTitles.contactMe")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {socialLinksData.contact
                  .filter((link) => !link.showOnlyIn || link.showOnlyIn.includes(currentLang))
                  .map((link) => renderLink(link))}
              </div>

              <h2 className="text-2xl font-bold mb-4">{t("contact.sectionTitles.socialMedia")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {socialLinksData.social.map((link) => renderLink(link))}
              </div>

              <h2 className="text-2xl font-bold mb-4">{t("contact.sectionTitles.otherPlatforms")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialLinksData.other
                  .sort((a, b) => {
                    if (a.ruAgeRestricted && !b.ruAgeRestricted) return 1
                    if (!a.ruAgeRestricted && b.ruAgeRestricted) return -1
                    return 0
                  })
                  .map((link) => renderLink(link))}

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
            </div>
          </div>
        </div>
      </div>
    </main>
  )
})
