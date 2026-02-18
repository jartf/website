// Lightweight client-side i18n helpers (for CommandBar, keyboard shortcuts, etc.)
// Unlike the server module, this reads locale from the DOM / URL.
import { supportedLanguages } from "@/lib/constants";
import { translations } from "@/i18n";
import { locales, stripLocale } from "@/i18n/routing";

function getNestedValue(obj: any, path: string): string | undefined {
  let cur = obj;
  for (const k of path.split(".")) {
    if (cur && typeof cur === "object" && k in cur) cur = cur[k];
    else return undefined;
  }
  return typeof cur === "string" ? cur : undefined;
}

/** Current page locale code (reads from URL, not HTML lang). */
export function getPageLocale(): string {
  const [, segment] = location.pathname.split("/");
  return (locales as string[]).includes(segment) ? segment : "en";
}

/** Client-side translation lookup for the current page locale. */
export function t(key: string, params?: Record<string, string | number>): string {
  const lang = getPageLocale();
  const trans = translations[lang] || translations.en;
  let value = getNestedValue(trans, key);
  if (!value && lang !== "en") value = getNestedValue(translations.en, key);
  if (!value) return key;
  if (!params) return value;
  let result = value;
  for (const [k, v] of Object.entries(params)) result = result.replaceAll(`{{${k}}}`, String(v));
  return result;
}

/** Navigate to the next locale version of the current page. */
export function cycleLanguage(): void {
  const codes = supportedLanguages.map((l) => l.code);
  const current = getPageLocale();
  const idx = codes.indexOf(current as typeof codes[number]);
  const next = codes[(idx + 1) % codes.length];
  const basePath = stripLocale(location.pathname);
  location.href = next === "en" ? basePath : `/${next}${basePath}`;
}

/** Navigate to a specific locale version of the current page. */
export function switchLocale(locale: string): void {
  const basePath = stripLocale(location.pathname);
  location.href = locale === "en" ? basePath : `/${locale}${basePath}`;
}
