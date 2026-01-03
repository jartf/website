/**
 * Shared icon maps for server-side rendering
 * Consolidates duplicate icon imports across pages
 */

import type React from "react"
import {
  // Now page icons
  BookOpen,
  Code,
  Coffee,
  Headphones,
  Brain,
  GraduationCap,
  Lightbulb,
  Activity,
  // Uses page icons
  Laptop,
  Smartphone,
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
  // Contact page icons
  Mail,
  MessageSquare,
  Send,
  Phone,
  Calendar,
  AtSign,
  Twitter,
  FileCode,
  User,
  Github,
  MessageCircle,
  Cloud,
  ExternalLink,
  Info,
  // Slashes page icons
  Home,
  Clock,
  Wrench,
  MessagesSquare,
  FileText,
  Slash,
} from "lucide-react"

export type IconComponent = React.ComponentType<{ className?: string }>

// ============================================================================
// Now Page Icons
// ============================================================================
export const NOW_ICONS: Record<string, IconComponent> = {
  BookOpen,
  Code,
  Coffee,
  Headphones,
  Brain,
  GraduationCap,
  Lightbulb,
  Activity,
}

// Static category name mappings for no-JS fallback on Now page
export const NOW_STATIC_CATEGORIES: Record<string, string> = {
  reading: "Reading",
  learning: "Learning",
  thinking: "Thinking",
  planning: "Planning",
  coding: "Coding",
  drinking: "Drinking",
  studying: "Studying",
  working: "Working",
  listening: "Listening",
  premid: "Activity",
  other: "Other",
}

// ============================================================================
// Uses Page Icons
// ============================================================================
export const USES_ICONS: Record<string, IconComponent> = {
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
}

// Static category titles for no-JS users on Uses page
export const USES_STATIC_CATEGORIES: Record<string, string> = {
  hardware: "Hardware",
  mobile: "Mobile",
  audio: "Audio",
  os: "Operating system",
  development: "Development",
  email: "Email",
  privacy: "Privacy",
  mobile_tools: "Mobile tools",
  mapping: "Mapping",
  gaming: "Gaming",
  multimedia: "Multimedia",
  photography: "Photography",
  video: "Video",
  design: "Design",
  media: "Media",
  photo: "Photo",
  music: "Music",
}

// ============================================================================
// Contact Page Icons (pre-rendered as JSX elements)
// ============================================================================
export const CONTACT_ICONS: Record<string, IconComponent> = {
  Mail,
  MessageSquare,
  Phone,
  Send,
  MessageCircle,
  Calendar,
  Cloud,
  Twitter,
  FileCode,
  AtSign,
  ImageIcon,
  Facebook: MessageSquare, // Alias
  User,
  Github,
  Code,
  Globe,
  Map,
  ExternalLink,
  Info,
}

// Contact link name mappings
export const CONTACT_LINK_NAMES: Record<string, string> = {
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

// ============================================================================
// Slashes Page Icons
// ============================================================================
export const SLASHES_ICONS: Record<string, IconComponent> = {
  Home,
  User,
  Code,
  BookOpen,
  Clock,
  Mail,
  FileText,
  Wrench,
  Calendar,
  MessagesSquare,
  Slash,
}

// ============================================================================
// Projects Page Static Labels
// ============================================================================
export const PROJECT_CATEGORY_LABELS: Record<string, string> = {
  personal: "Personal",
  academic: "Academic",
  activism: "Activism",
}

export const PROJECT_STATUS_LABELS: Record<string, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  planned: "Planned",
}
