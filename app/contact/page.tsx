import { generateMetadata as generateMeta } from "@/lib/metadata"
import ContactClientWrapper from "./ContactClientWrapper"
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
  MessageCircle,
} from "lucide-react"

export const metadata = generateMeta({
  title: "Contact",
  description: "Get in touch with me.",
  path: "contact",
})

// Static social links data - defined on server
const socialLinksData = {
  contact: [
    {
      name: "Matrix",
      iconName: "Mail",
      url: "https://matrix.to/#/@jar:jarema.me",
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "Discord",
      iconName: "MessageSquare",
      url: "https://discord.com/users/444078929314185217",
      color: "hover:bg-indigo-600 hover:text-white",
    },
    {
      name: "Email",
      iconName: "Mail",
      url: "mailto:hi@jar.tf",
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "universityEmail",
      nameKey: "contact.links.universityEmail",
      iconName: "GraduationCap",
      url: "mailto:VuVietAnh-KTQT50C10404@dav.edu.vn",
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "Signal",
      iconName: "Phone",
      url: "https://signal.me/#eu/wHpqXqMSQ6LSg0zijVcCCWm5PK5gwshaDFOAg0aj-aq5BSs94E9CLJ5ThNuy4t6A",
      color: "hover:bg-blue-400 hover:text-white",
    },
    {
      name: "Telegram",
      iconName: "Send",
      url: "https://t.me/jaremame",
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "Zalo",
      iconName: "MessageCircle",
      url: "https://zaloapp.com/qr/p/ryw96g1vmzmw",
      color: "hover:bg-blue-500 hover:text-white",
      showOnlyIn: ["vi"],
      isQRCode: true,
      qrImage: "/zalo-qr.jpeg",
      qrAlt: "Zalo QR Code",
    },
    {
      name: "微信",
      iconName: "MessageCircle",
      url: "https://u.wechat.com/kOt1MXULWMfPeyQkEmrh8uQ?s=0",
      color: "hover:bg-green-600 hover:text-white",
      showOnlyIn: ["zh"],
      isQRCode: true,
      qrImage: "/wechat-qr.png",
      qrAlt: "WeChat QR Code",
    },
    {
      name: "bookMeeting",
      nameKey: "contact.links.bookMeeting",
      iconName: "Calendar",
      url: "https://cal.com/jaremaa/secret",
      color: "hover:bg-white hover:text-black",
      fullWidthUnless: ["vi", "zh"],
    },
  ],
  social: [
    {
      name: "Akkoma",
      iconName: "MessageSquare",
      url: "https://blob.cat/jar",
      color: "hover:bg-purple-600 hover:text-white",
    },
    {
      name: "Mastodon",
      iconName: "MessageSquare",
      url: "https://toot.io/@jar",
      color: "hover:bg-purple-600 hover:text-white",
    },
    {
      name: "Bluesky",
      iconName: "Cloud",
      url: "https://bsky.app/profile/jarema.me",
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "Twitter / X",
      iconName: "Twitter",
      url: "https://twitter.com/jarema_me",
      color: "hover:bg-gray-800 hover:text-white",
    },
    {
      name: "Dev.to",
      iconName: "FileCode",
      url: "https://dev.to/jartf",
      color: "hover:bg-gray-800 hover:text-white",
    },
    {
      name: "Threads",
      iconName: "AtSign",
      url: "https://threads.net/@jarema.me",
      color: "hover:bg-gray-800 hover:text-white",
    },
    {
      name: "Instagram",
      iconName: "ImageIcon",
      url: "https://instagram.com/jarema.me",
      color: "hover:bg-pink-600 hover:text-white",
    },
    {
      name: "Messenger",
      iconName: "Facebook",
      url: "https://m.me/jaremajarosz",
      color: "hover:bg-blue-500 hover:text-white",
      noteKey: "contact.links.messengerNote",
    },
  ],
  other: [
    {
      name: "Pronouns.page",
      iconName: "User",
      pronounsPageUrls: {
        ru: "https://ru.pronouns.page/@jerryv",
        vi: "https://vi.pronouns.page/@jerryv",
        tr: "https://tr.pronouns.page/@jerryv",
        zh: "https://zh.pronouns.page/@jerryv",
        default: "https://en.pronouns.page/@jerryv",
      },
      color: "hover:bg-violet-600 hover:text-white",
      ruAgeRestricted: true,
    },
    {
      name: "GitHub",
      iconName: "Github",
      url: "https://github.com/jartf",
      color: "hover:bg-gray-800 hover:text-white",
    },
    {
      name: "GitLab",
      iconName: "Code",
      url: "https://gitlab.com/jartf",
      color: "hover:bg-orange-600 hover:text-white",
    },
    {
      name: "Google Developer",
      iconName: "Code",
      url: "https://g.dev/jarema",
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "IndieWeb",
      iconName: "Globe",
      url: "https://indieweb.org/User:Jarema.me",
      color: "hover:bg-indigo-600 hover:text-white",
    },
    {
      name: "OpenStreetMap",
      iconName: "Map",
      url: "https://openstreetmap.org/user/Equate",
      color: "hover:bg-green-600 hover:text-white",
    },
    {
      name: "Waze Map Editor",
      iconName: "Map",
      url: "https://www.waze.com/en/user/editor/vanhv",
      color: "hover:bg-blue-500 hover:text-white",
    },
  ],
}

export default function ContactPage() {
  return <ContactClientWrapper socialLinksData={socialLinksData} />
}
