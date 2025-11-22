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
  return format(new Date(date), "PP", { locale })
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

/**
 * Helper function to escape XML entities
 * @param {string} unsafe - The string to escape
 * @returns {string} - The escaped string
 */
export function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

/**
 * Smoothly scroll an element into view
 * @param {Element} element - The element to scroll to
 * @param {ScrollLogicalPosition} [block="start"] - The vertical alignment
 */
export function smoothScrollTo(element: Element, block: ScrollLogicalPosition = "start"): void {
  element.scrollIntoView({ behavior: "smooth", block })
}

/**
 * Add a temporary highlight effect to an element
 * @param {Element} element - The element to highlight
 * @param {number} [duration=1000] - How long to show the highlight in ms
 */
export function highlightElement(element: Element, duration: number = 1000): void {
  element.classList.add("ring-2", "ring-primary", "ring-offset-2")
  setTimeout(() => {
    element.classList.remove("ring-2", "ring-primary", "ring-offset-2")
  }, duration)
}

/**
 * Scroll to an element and add a highlight effect
 * @param {Element} element - The element to scroll to and highlight
 * @param {ScrollLogicalPosition} [block="start"] - The vertical alignment
 * @param {number} [duration=1000] - How long to show the highlight in ms
 */
export function scrollAndHighlight(element: Element, block: ScrollLogicalPosition = "start", duration: number = 1000): void {
  smoothScrollTo(element, block)
  highlightElement(element, duration)
}
