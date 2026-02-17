// Timezone anchor utility + shared date formatting
import { authorTimezone } from "./constants";

// --- Date format presets ---

/** Blog posts, scrapbook, recent posts */
export const dateLong: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

/** Now page items (includes time + zone) */
export const dateFull: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short" };

// --- Timezone ---
export function getTimezoneOption(): { timeZone: string } | Record<string, never> {
  if (typeof localStorage === "undefined") return {};
  return localStorage.getItem("timezone-anchor") === "author"
    ? { timeZone: authorTimezone }
    : {};
}

// --- Unified formatter ---
export function formatDate(
  date: string | Date,
  lang = "en",
  fmt: Intl.DateTimeFormatOptions = dateLong,
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(lang, { ...fmt, ...getTimezoneOption() });
}
