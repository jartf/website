// Timezone anchor utility + shared date formatting
import { authorTimezone } from "../constants";

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

/** Update all `[data-date]` elements under a root with `formatDate`. */
export function updateDateElements(
  root: Element | Document,
  lang: string,
  fmt: Intl.DateTimeFormatOptions = dateLong,
) {
  root.querySelectorAll<HTMLElement>("[data-date]").forEach((el) => {
    const d = el.getAttribute("data-date");
    if (d) el.textContent = formatDate(d, lang, fmt);
  });
}
