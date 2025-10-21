import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { enUS, vi, et, ru, da, tr, zhCN, pl, sv, fi } from "date-fns/locale"
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
  pl,
  sv,
  fi,
  tok: enUS, // no dedicated locale; fall back to English
}

/**
 * A utility function to merge Tailwind CSS classes.
 * @param {...ClassValue} inputs - The class values to merge.
 * @returns {string} The merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date using the specified language.
 * @param {Date|string|number} date - The date to format.
 * @param {string} [lang="en"] - The language to use for formatting.
 * @returns {string} The formatted date string.
 */
export function formatDate(date: Date | string | number, lang: string = "en"): string {
  const locale = LOCALE_MAP[lang] || enUS
  // Use the locale's default date format if available
  let formatStr = "PP" // date-fns 'PP' token uses locale default
  try {
    // Some locales may not have formatLong.date, so fallback
    if (locale && locale.formatLong && typeof locale.formatLong.date === "function") {
      formatStr = locale.formatLong.date({ width: "medium" })
    }
  } catch (e) {
    console.error("Error getting locale's default date format:", e)
    // fallback to 'PP'
  }
  return format(new Date(date), formatStr, { locale })
}

/**
 * Converts a string to a slug.
 * @param {string} str - The string to slugify.
 * @returns {string} The slugified string.
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Truncates a string to a specified length.
 * @param {string} str - The string to truncate.
 * @param {number} length - The maximum length of the string.
 * @returns {string} The truncated string.
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

/**
 * Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked.
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {Function} The new debounced function.
 */
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
