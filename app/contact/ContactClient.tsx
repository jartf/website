"use client"

import { useTranslation } from "react-i18next"
import { DarkModeFirefly } from "@/components/firefly"
import Image from "next/image"
import Link from "next/link"
import { Mail, MessageSquare, Send, Phone, Calendar, AtSign, ImageIcon, Cloud, Twitter, FileCode, User, Github, Code, Globe, Map, ExternalLink, Info, MessageCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import i18n from "i18next"

const iconMap: Record<string, React.ReactNode> = {
  Mail: <Mail className="h-6 w-6" aria-hidden="true" />,
  MessageSquare: <MessageSquare className="h-6 w-6" aria-hidden="true" />,
  Phone: <Phone className="h-6 w-6" aria-hidden="true" />,
  Send: <Send className="h-6 w-6" aria-hidden="true" />,
  MessageCircle: <MessageCircle className="h-6 w-6" aria-hidden="true" />,
  Calendar: <Calendar className="h-6 w-6" aria-hidden="true" />,
  Cloud: <Cloud className="h-6 w-6" aria-hidden="true" />,
  Twitter: <Twitter className="h-6 w-6" aria-hidden="true" />,
  FileCode: <FileCode className="h-6 w-6" aria-hidden="true" />,
  AtSign: <AtSign className="h-6 w-6" aria-hidden="true" />,
  ImageIcon: <ImageIcon className="h-6 w-6" aria-hidden="true" />,
  Facebook: <MessageSquare className="h-6 w-6" aria-hidden="true" />,
  User: <User className="h-6 w-6" aria-hidden="true" />,
  Github: <Github className="h-6 w-6" aria-hidden="true" />,
  Code: <Code className="h-6 w-6" aria-hidden="true" />,
  Globe: <Globe className="h-6 w-6" aria-hidden="true" />,
  Map: <Map className="h-6 w-6" aria-hidden="true" />,
}

type LinkData = {
  id: string
  icon: string
  url?: string
  urls?: Record<string, string>
  color: string
  qrImage?: string
  langFilter?: string[]
  hasNote?: boolean
}

type ContactClientProps = {
  links: {
    contact: LinkData[]
    social: LinkData[]
    other: LinkData[]
  }
}

const linkNames: Record<string, string> = {
  matrix: "Matrix",
  discord: "Discord",
  email: "Email",
  signal: "Signal",
  telegram: "Telegram",
  zalo: "Zalo",
  wechat: "微信",
  calendar: "contact.links.bookMeeting",
  akkoma: "Akkoma",
  mastodon: "Mastodon",
  bluesky: "Bluesky",
  twitter: "Twitter / X",
  devto: "Dev.to",
  threads: "Threads",
  instagram: "Instagram",
  messenger: "Messenger",
  pronouns: "Pronouns.page",
  github: "GitHub",
  gitlab: "GitLab",
  googledev: "Google Developer",
  indieweb: "IndieWeb",
  osm: "OpenStreetMap",
  waze: "Waze Map Editor",
}

export default function ContactClient({ links }: ContactClientProps) {
  const { t } = useTranslation()
  const currentLang = i18n.language

  const getName = (id: string) => {
    const name = linkNames[id]
    return name?.startsWith("contact.") ? t(name) : name
  }

  const renderLink = (link: LinkData) => {
    const icon = iconMap[link.icon]
    const name = getName(link.id)

    // Language filter (for QR codes)
    if (link.langFilter && !link.langFilter.includes(currentLang)) {
      return null
    }

    // QR Code Dialog
    if (link.qrImage) {
      const buttonText = currentLang === "vi" ? "Mở Zalo" : currentLang === "zh" ? "打开微信" : "Open App"
      const description = currentLang === "zh" && link.id === "wechat"
        ? "扫一扫上面的二维码图案，加我为朋友。"
        : currentLang === "vi" && link.id === "zalo"
          ? "Quét mã QR để kết nối với tôi trên Zalo"
          : "Scan the QR code to connect with me"

      return (
        <Dialog key={link.id}>
          <DialogTrigger asChild>
            <button
              className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors ${link.color}`}
              aria-label={`Open ${name} QR code`}
            >
              {icon}
              <span>{name}</span>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogTitle className="sr-only">{name} QR Code</DialogTitle>
            <DialogDescription className="sr-only">{description}</DialogDescription>
            <div className="flex flex-col items-center justify-center p-4">
              <div className="relative w-full max-w-sm aspect-square mb-4">
                <Image src={link.qrImage} alt={`${name} QR Code - ${description}`} fill className="object-contain" />
              </div>
              {link.url && (
                <Button variant="outline" asChild className="mt-2">
                  <Link href={link.url} target="_blank" rel="noopener noreferrer">
                    {buttonText}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              )}
              <p className="text-center text-muted-foreground mt-2">{description}</p>
            </div>
          </DialogContent>
        </Dialog>
      )
    }

    // Multi-language URLs (pronouns.page)
    if (link.urls) {
      const url = link.urls[currentLang] || link.urls.default
      const displayName = currentLang === "ru" ? "Pronouns.page (18+)" : name

      if (currentLang === "ru") {
        const note = "Этот сайт имеет возрастное ограничение 18+. Оставаясь на сайте, вы подтверждаете, что достигли совершеннолетия, и самостоятельно несёте ответственность за свои действия."
        return (
          <div key={link.id}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={url} target="_blank" rel="noopener noreferrer" className={`flex flex-col p-4 rounded-lg border transition-colors ${link.color} w-full`}>
                    <div className="flex items-center justify-center gap-3">
                      {icon}
                      <span>{displayName}</span>
                      <ExternalLink className="h-4 w-4 opacity-70" />
                      <Info className="h-4 w-4 hidden md:inline" />
                    </div>
                    <p className="text-xs mt-2 text-center md:hidden">{note}</p>
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
        <Link key={link.id} href={url} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors ${link.color}`}>
          {icon}
          <span>{displayName}</span>
          <ExternalLink className="h-4 w-4 ml-1 opacity-70" />
        </Link>
      )
    }

    // Link with tooltip note (messenger)
    if (link.hasNote) {
      const note = t("contact.links.messengerNote")
      return (
        <div key={link.id}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={link.url!} target="_blank" rel="noopener noreferrer" className={`flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 p-4 rounded-lg border transition-colors ${link.color} w-full`}>
                  <div className="flex items-center gap-3">
                    {icon}
                    <span>{name}</span>
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

    // Regular link
    return (
      <Link key={link.id} href={link.url!} target="_blank" rel="noopener noreferrer" className={`flex items-center justify-center gap-3 p-4 rounded-lg border transition-colors ${link.color}`}>
        {icon}
        <span>{name}</span>
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

          <div className="grid gap-8">
            <div className="text-center">
              <p className="text-xl mb-2 lowercase">{t("contact.message")}</p>
              <p className="text-muted-foreground italic mb-8 lowercase">{t("contact.disclaimer")}</p>
            </div>

            <section aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="text-2xl font-bold mb-4">{t("contact.sectionTitles.contactMe")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {links.contact.map(renderLink)}
              </div>
            </section>

            <section aria-labelledby="social-heading">
              <h2 id="social-heading" className="text-2xl font-bold mb-4">{t("contact.sectionTitles.socialMedia")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {links.social.map(renderLink)}
              </div>
            </section>

            <section aria-labelledby="other-heading">
              <h2 id="other-heading" className="text-2xl font-bold mb-4">{t("contact.sectionTitles.otherPlatforms")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.other.map(renderLink)}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
