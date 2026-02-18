// Uses page data - Astro version (no React icons, using string icon names)

export type UsesCategory = {
  title: string
  icon: string  // Icon name for Lucide
  items: {
    name: string
    descriptionKey: string
    link?: string
  }[]
  subsections?: {
    title: string
    icon?: string
    items: {
      name: string
      descriptionKey?: string
      description?: string
      link?: string
    }[]
  }[]
}

export const usesCategories: UsesCategory[] = [
  {
    title: "hardware",
    icon: "laptop",
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
    icon: "smartphone",
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
    icon: "headphones",
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
    icon: "globe",
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
    icon: "code",
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
    icon: "mail",
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
    icon: "shield",
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
    icon: "settings",
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
    icon: "map",
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
    icon: "gamepad-2",
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
    icon: "image",
    items: [],
    subsections: [
      {
        title: "design",
        icon: "palette",
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
        icon: "camera",
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
        icon: "video",
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
        icon: "music",
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

// i18n descriptions for uses items
export const usesDescriptions: Record<string, Record<string, string>> = {
  en: {
    // Hardware
    ryzen: "AMD Ryzen 5 4500U, 8GB RAM, 512GB SSD",
    externalHDD: "Portable external hard drive for backups",
    mechanicalKeyboard: "Hot-swappable mechanical keyboard with RGB",
    wirelessMouse: "Wireless gaming mouse with LIGHTSPEED technology",
    // Mobile
    mainPhone: "Main daily driver smartphone",
    secondaryPhone: "Secondary phone for testing and development",
    smartwatch: "Fitness tracking and notifications",
    // Audio
    primaryEarbuds: "Primary wireless earbuds with ANC",
    backupEarbuds: "Backup wireless earbuds",
    // OS
    dualBoot: "Dual boot setup for development and daily use",
    primaryBrowser: "Privacy-focused primary browser",
    secondaryBrowser: "Chromium-based secondary browser",
    // Development
    primaryCodeEditor: "Primary code editor with extensions",
    terminalEmulators: "Modern terminal emulators",
    versionControl: "Version control system",
    apiTesting: "API development and testing",
    databaseManagement: "Relational database management",
    codeHosting: "Code hosting and collaboration",
    webHosting: "Web hosting and deployment",
    ddosProtection: "CDN and DDoS protection",
    // Email/Productivity
    desktopEmail: "Desktop email client (Thunderbird fork)",
    emailClient: "Cross-platform email client",
    domainEmail: "Custom domain email hosting",
    taskManagement: "Note-taking and task management",
    calendar: "Calendar and scheduling",
    timeTracking: "Time tracking for projects",
    automationTool: "Workflow automation",
    phoneLinking: "Phone-computer integration",
    noteTaking: "End-to-end encrypted notes",
    officeSuite: "Office productivity suite",
    cloudStorage: "Self-hosted cloud storage",
    // Privacy
    vpn: "VPN service for privacy",
    passwordManager: "Open-source password manager",
    twoFactorAuth: "Two-factor authentication app",
    dnsProvider: "Privacy-focused DNS provider",
    privacySearch: "Privacy-focused search engine",
    networkVpn: "Mesh VPN for secure networking",
    // Mobile Tools
    lgFirmware: "LG firmware flashing tool",
    qualcommFlash: "Qualcomm firmware flash tool",
    samsungFirmware: "Samsung firmware flashing tool",
    samsungDownload: "Samsung firmware download tool",
    iosManagement: "iOS device management tool",
    // Mapping
    geographicSystem: "Open source geographic information system",
    webOpenstreetmap: "Web-based OpenStreetMap editor",
    desktopOpenstreetmap: "Desktop OpenStreetMap editor",
    mobileOpenstreetmap: "Mobile OpenStreetMap editor",
    mobileContributor: "Mobile map contribution app",
    communityNavigation: "Community-driven navigation",
    // Gaming
    minecraftClient: "Minecraft performance client",
    gameDistribution: "PC game distribution platform",
    gameLauncher: "Game launcher and store",
    indieMarketplace: "Indie game marketplace",
    // Multimedia - Design
    vectorGraphics: "Vector graphics editor",
    uiUxDesign: "UI/UX design tool",
    graphicDesign: "Easy graphic design tool",
    digitalPaintingDesktop: "Digital painting (desktop)",
    digitalPaintingMobile: "Digital painting (mobile)",
    // Multimedia - Photo
    photoEditing: "Professional photo editing",
    openSourceEditor: "Open source image editor",
    // Multimedia - Video
    professionalEditor: "Professional video editing",
    professionalEditorDavinci: "Professional editing & color grading",
    openSourceVideoEditor: "Open source video editor",
    videoEditorCapcut: "Quick video editing",
    subtitleEditor: "Advanced subtitle editor",
    videoPlayer: "Universal media player",
    audioEditor: "Open source audio editor",
    // Multimedia - Media
    musicStreamingYoutube: "Music streaming service",
    musicStreamingSpotify: "Music streaming service",
    videoStreaming: "Video streaming platform",
  },
  vi: {
    // Hardware
    ryzen: "AMD Ryzen 5 4500U, 8GB RAM, 512GB SSD",
    externalHDD: "Ổ cứng di động để sao lưu",
    mechanicalKeyboard: "Bàn phím cơ hot-swap với đèn RGB",
    wirelessMouse: "Chuột không dây với công nghệ LIGHTSPEED",
    // Mobile
    mainPhone: "Điện thoại chính hàng ngày",
    secondaryPhone: "Điện thoại phụ để thử nghiệm và phát triển",
    smartwatch: "Theo dõi sức khỏe và thông báo",
    // Audio
    primaryEarbuds: "Tai nghe không dây chính có ANC",
    backupEarbuds: "Tai nghe không dây dự phòng",
    // OS
    dualBoot: "Cài đặt dual boot cho phát triển và sử dụng hàng ngày",
    primaryBrowser: "Trình duyệt chính tập trung vào quyền riêng tư",
    secondaryBrowser: "Trình duyệt phụ dựa trên Chromium",
    // Development
    primaryCodeEditor: "Trình chỉnh sửa mã chính với tiện ích mở rộng",
    terminalEmulators: "Giả lập terminal hiện đại",
    versionControl: "Hệ thống quản lý phiên bản",
    apiTesting: "Phát triển và kiểm thử API",
    databaseManagement: "Quản lý cơ sở dữ liệu quan hệ",
    codeHosting: "Lưu trữ mã và cộng tác",
    webHosting: "Lưu trữ web và triển khai",
    ddosProtection: "CDN và bảo vệ DDoS",
    // Email/Productivity
    desktopEmail: "Ứng dụng email desktop (nhánh Thunderbird)",
    emailClient: "Ứng dụng email đa nền tảng",
    domainEmail: "Lưu trữ email tên miền tùy chỉnh",
    taskManagement: "Ghi chú và quản lý công việc",
    calendar: "Lịch và lập kế hoạch",
    timeTracking: "Theo dõi thời gian cho dự án",
    automationTool: "Tự động hóa quy trình làm việc",
    phoneLinking: "Tích hợp điện thoại-máy tính",
    noteTaking: "Ghi chú mã hóa đầu cuối",
    officeSuite: "Bộ công cụ văn phòng",
    cloudStorage: "Lưu trữ đám mây tự host",
    // Privacy
    vpn: "Dịch vụ VPN cho quyền riêng tư",
    passwordManager: "Trình quản lý mật khẩu mã nguồn mở",
    twoFactorAuth: "Ứng dụng xác thực hai yếu tố",
    dnsProvider: "Nhà cung cấp DNS tập trung vào quyền riêng tư",
    privacySearch: "Công cụ tìm kiếm tập trung vào quyền riêng tư",
    networkVpn: "VPN mesh cho mạng bảo mật",
    // Mobile Tools
    lgFirmware: "Công cụ flash firmware LG",
    qualcommFlash: "Công cụ flash firmware Qualcomm",
    samsungFirmware: "Công cụ flash firmware Samsung",
    samsungDownload: "Công cụ tải firmware Samsung",
    iosManagement: "Công cụ quản lý thiết bị iOS",
    // Mapping
    geographicSystem: "Hệ thống thông tin địa lý mã nguồn mở",
    webOpenstreetmap: "Trình chỉnh sửa OpenStreetMap web",
    desktopOpenstreetmap: "Trình chỉnh sửa OpenStreetMap desktop",
    mobileOpenstreetmap: "Trình chỉnh sửa OpenStreetMap di động",
    mobileContributor: "Ứng dụng đóng góp bản đồ di động",
    communityNavigation: "Điều hướng cộng đồng",
    // Gaming
    minecraftClient: "Client Minecraft hiệu suất cao",
    gameDistribution: "Nền tảng phân phối game PC",
    gameLauncher: "Trình khởi chạy game và cửa hàng",
    indieMarketplace: "Chợ game indie",
    // Multimedia - Design
    vectorGraphics: "Trình chỉnh sửa đồ họa vector",
    uiUxDesign: "Công cụ thiết kế UI/UX",
    graphicDesign: "Công cụ thiết kế đồ họa dễ dùng",
    digitalPaintingDesktop: "Vẽ kỹ thuật số (desktop)",
    digitalPaintingMobile: "Vẽ kỹ thuật số (di động)",
    // Multimedia - Photo
    photoEditing: "Chỉnh sửa ảnh chuyên nghiệp",
    openSourceEditor: "Trình chỉnh sửa ảnh mã nguồn mở",
    // Multimedia - Video
    professionalEditor: "Chỉnh sửa video chuyên nghiệp",
    professionalEditorDavinci: "Chỉnh sửa & chỉnh màu chuyên nghiệp",
    openSourceVideoEditor: "Trình chỉnh sửa video mã nguồn mở",
    videoEditorCapcut: "Chỉnh sửa video nhanh",
    subtitleEditor: "Trình chỉnh sửa phụ đề nâng cao",
    videoPlayer: "Trình phát đa phương tiện đa năng",
    audioEditor: "Trình chỉnh sửa âm thanh mã nguồn mở",
    // Multimedia - Media
    musicStreamingYoutube: "Dịch vụ phát nhạc trực tuyến",
    musicStreamingSpotify: "Dịch vụ phát nhạc trực tuyến",
    videoStreaming: "Nền tảng phát video trực tuyến",
  },
}
