import type React from "react"
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
} from "lucide-react"

export type UsesCategory = {
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

export const USES_CATEGORIES: UsesCategory[] = [
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
            description: "Click 5 times to reveal",
          },
          {
            name: "Unspeakable Platform 2",
            description: "Click 5 times to reveal",
          },
        ],
      },
    ],
  },
]
