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

export const slugify = (str: string) => str
  .toLowerCase()
  .replace(/[^\w\s-]/g, "")
  .replace(/[\s_-]+/g, "-")
  .replace(/^-+|-+$/g, "")

export const truncate = (str: string, length: number) =>
  str.length <= length ? str : str.slice(0, length) + "..."

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

const XML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;'
}

export const escapeXml = (unsafe: string) =>
  unsafe.replace(/[&<>"']/g, char => XML_ENTITIES[char])

const HIGHLIGHT_CLASSES = ["ring-2", "ring-primary", "ring-offset-2"]

export const smoothScrollTo = (element: Element, block: ScrollLogicalPosition = "start") =>
  element.scrollIntoView({ behavior: "smooth", block })

export function highlightElement(element: Element, duration = 1000): void {
  element.classList.add(...HIGHLIGHT_CLASSES)
  setTimeout(() => element.classList.remove(...HIGHLIGHT_CLASSES), duration)
}

export function scrollAndHighlight(element: Element, block: ScrollLogicalPosition = "start", duration = 1000): void {
  smoothScrollTo(element, block)
  highlightElement(element, duration)
}
