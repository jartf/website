import { generateMetadata as generateMeta } from "@/lib/metadata"
import ContactClient from "./client";

export const metadata = generateMeta({
  title: "Contact",
  description: "Get in touch with me.",
  path: "contact",
})

// Social links data structure
const socialLinks = {
  contact: [
    { id: "matrix", icon: "Mail", url: "https://matrix.to/#/@jar:envs.net", color: "hover:bg-blue-600 hover:text-white" },
    { id: "discord", icon: "MessageSquare", url: "https://discord.com/users/444078929314185217", color: "hover:bg-indigo-600 hover:text-white" },
    { id: "email", icon: "Mail", url: "mailto:hello@jarema.me", color: "hover:bg-blue-600 hover:text-white" },
    { id: "signal", icon: "Phone", url: "https://signal.me/#eu/wHpqXqMSQ6LSg0zijVcCCWm5PK5gwshaDFOAg0aj-aq5BSs94E9CLJ5ThNuy4t6A", color: "hover:bg-blue-400 hover:text-white" },
    { id: "telegram", icon: "Send", url: "https://t.me/jaremame", color: "hover:bg-sky-500 hover:text-white" },
    { id: "zalo", icon: "MessageCircle", url: "https://zaloapp.com/qr/p/ryw96g1vmzmw", color: "hover:bg-blue-500 hover:text-white", qrImage: "/zalo-qr.jpeg", langFilter: ["vi", "vih"] },
    { id: "wechat", icon: "MessageCircle", url: "https://u.wechat.com/kOt1MXULWMfPeyQkEmrh8uQ?s=0", color: "hover:bg-green-600 hover:text-white", qrImage: "/wechat-qr.png", langFilter: ["zh"] },
    { id: "calendar", icon: "Calendar", url: "https://cal.com/jaremaa/secret", color: "hover:bg-white hover:text-black" },
  ],
  social: [
    { id: "akkoma", icon: "MessageSquare", url: "https://blob.cat/jar", color: "hover:bg-purple-600 hover:text-white" },
    { id: "mastodon", icon: "MessageSquare", url: "https://toot.io/@jar", color: "hover:bg-purple-600 hover:text-white" },
    { id: "bluesky", icon: "Cloud", url: "https://bsky.app/profile/jarema.me", color: "hover:bg-sky-500 hover:text-white" },
    { id: "twitter", icon: "Twitter", url: "https://twitter.com/jarema_me", color: "hover:bg-gray-800 hover:text-white" },
    { id: "devto", icon: "FileCode", url: "https://dev.to/jartf", color: "hover:bg-gray-800 hover:text-white" },
    { id: "threads", icon: "AtSign", url: "https://threads.net/@jarema.me", color: "hover:bg-gray-800 hover:text-white" },
    { id: "instagram", icon: "ImageIcon", url: "https://instagram.com/jarema.me", color: "hover:bg-pink-600 hover:text-white" },
    { id: "messenger", icon: "Facebook", url: "/contact", color: "hover:bg-blue-500 hover:text-white", hasNote: true },
  ],
  other: [
    { id: "pronouns", icon: "User", urls: { ru: "https://ru.pronouns.page/@jerryv", vi: "https://vi.pronouns.page/@jerryv", tr: "https://tr.pronouns.page/@jerryv", zh: "https://zh.pronouns.page/@jerryv", default: "https://en.pronouns.page/@jerryv" }, color: "hover:bg-violet-600 hover:text-white" },
    { id: "github", icon: "Github", url: "https://github.com/jartf", color: "hover:bg-gray-800 hover:text-white" },
    { id: "gitlab", icon: "Code", url: "https://gitlab.com/jartf", color: "hover:bg-orange-600 hover:text-white" },
    { id: "googledev", icon: "Code", url: "https://g.dev/jarema", color: "hover:bg-blue-600 hover:text-white" },
    { id: "indieweb", icon: "Globe", url: "https://indieweb.org/User:Jarema.me", color: "hover:bg-indigo-600 hover:text-white" },
    { id: "osm", icon: "Map", url: "https://openstreetmap.org/user/Equate", color: "hover:bg-green-600 hover:text-white" },
    { id: "waze", icon: "Map", url: "https://www.waze.com/en/user/editor/vanhv", color: "hover:bg-blue-500 hover:text-white" },
  ],
}

export default function ContactPage() {
  return <ContactClient links={socialLinks} />
}
