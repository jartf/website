
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { enUS, vi, et, ru, da, tr, zhCN } from "date-fns/locale"
import type { Locale } from "date-fns"

// Map language code to date-fns locale
const LOCALE_MAP: Record<string, Locale> = {
  en: enUS,
  vi,
  et,
  ru,
  da,
  tr,
  zh: zhCN,
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Localized date formatting using date-fns
export function formatDate(date: Date | string | number, lang: string = "en"): string {
  const locale = LOCALE_MAP[lang] || enUS
  return format(new Date(date), "MMMM d, yyyy", { locale })
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
