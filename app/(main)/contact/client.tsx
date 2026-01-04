"use client"

import { useTranslation } from "react-i18next"
import { DarkModeFirefly } from "@/components/firefly"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { TranslatedPageHeader } from "@/components/translated-text"
import { CONTACT_ICONS, CONTACT_LINK_NAMES } from "@/lib/icons"
import i18n from "i18next"

// Generate icon elements from shared CONTACT_ICONS
const iconMap: Record<string, React.ReactNode> = Object.fromEntries(
  Object.entries(CONTACT_ICONS).map(([name, Icon]) => [
    name,
    <Icon key={name} className="h-6 w-6" aria-hidden="true" />,
  ])
)

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

// Social links data
const links = {
  contact: [
    { id: "matrix", icon: "Mail", url: "https://matrix.to/#/@jar:envs.net", color: "hover:bg-blue-600 hover:text-white" },
    { id: "discord", icon: "MessageSquare", url: "https://discord.com/users/444078929314185217", color: "hover:bg-indigo-600 hover:text-white" },
    { id: "email", icon: "Mail", url: "mailto:hello@jarema.me", color: "hover:bg-blue-600 hover:text-white" },
    { id: "signal", icon: "Phone", url: "https://signal.me/#eu/wHpqXqMSQ6LSg0zijVcCCWm5PK5gwshaDFOAg0aj-aq5BSs94E9CLJ5ThNuy4t6A", color: "hover:bg-blue-400 hover:text-white" },
    { id: "telegram", icon: "Send", url: "https://t.me/jaremame", color: "hover:bg-sky-500 hover:text-white" },
    { id: "zalo", icon: "MessageCircle", url: "https://zaloapp.com/qr/p/ryw96g1vmzmw", color: "hover:bg-blue-500 hover:text-white", qrImage: "/zalo-qr.jpeg", langFilter: ["vi", "vih"] },
    { id: "wechat", icon: "MessageCircle", url: "https://u.wechat.com/kOt1MXULWMfPeyQkEmrh8uQ?s=0", color: "hover:bg-green-600 hover:text-white", qrImage: "/wechat-qr.png", langFilter: ["zh"] },
    { id: "calendar", icon: "Calendar", url: "https://cal.com/jaremaa/secret", color: "hover:bg-white hover:text-black" },
  ] as LinkData[],
  social: [
    { id: "akkoma", icon: "MessageSquare", url: "https://blob.cat/jar", color: "hover:bg-purple-600 hover:text-white" },
    { id: "mastodon", icon: "MessageSquare", url: "https://toot.io/@jar", color: "hover:bg-purple-600 hover:text-white" },
    { id: "bluesky", icon: "Cloud", url: "https://bsky.app/profile/jarema.me", color: "hover:bg-sky-500 hover:text-white" },
    { id: "twitter", icon: "Twitter", url: "https://twitter.com/jarema_me", color: "hover:bg-gray-800 hover:text-white" },
    { id: "devto", icon: "FileCode", url: "https://dev.to/jartf", color: "hover:bg-gray-800 hover:text-white" },
    { id: "threads", icon: "AtSign", url: "https://threads.net/@jarema.me", color: "hover:bg-gray-800 hover:text-white" },
    { id: "instagram", icon: "ImageIcon", url: "https://instagram.com/jarema.me", color: "hover:bg-pink-600 hover:text-white" },
    { id: "messenger", icon: "Facebook", url: "/contact", color: "hover:bg-blue-500 hover:text-white", hasNote: true },
  ] as LinkData[],
  other: [
    { id: "pronouns", icon: "User", urls: { ru: "https://ru.pronouns.page/@jerryv", vi: "https://vi.pronouns.page/@jerryv", tr: "https://tr.pronouns.page/@jerryv", zh: "https://zh.pronouns.page/@jerryv", default: "https://en.pronouns.page/@jerryv" }, color: "hover:bg-violet-600 hover:text-white" },
    { id: "github", icon: "Github", url: "https://github.com/jartf", color: "hover:bg-gray-800 hover:text-white" },
    { id: "gitlab", icon: "Code", url: "https://gitlab.com/jartf", color: "hover:bg-orange-600 hover:text-white" },
    { id: "googledev", icon: "Code", url: "https://g.dev/jarema", color: "hover:bg-blue-600 hover:text-white" },
    { id: "indieweb", icon: "Globe", url: "https://indieweb.org/User:Jarema.me", color: "hover:bg-indigo-600 hover:text-white" },
    { id: "osm", icon: "Map", url: "https://openstreetmap.org/user/Equate", color: "hover:bg-green-600 hover:text-white" },
    { id: "waze", icon: "Map", url: "https://www.waze.com/en/user/editor/vanhv", color: "hover:bg-blue-500 hover:text-white" },
  ] as LinkData[],
}

// Use shared link names
const linkNames = CONTACT_LINK_NAMES

export default function ContactClient() {
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
          <TranslatedPageHeader
            titleKey="contact.title"
            descriptionKey="contact.description"
            staticTitle="Contact"
            staticDescription="Get in touch with me"
          />

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
