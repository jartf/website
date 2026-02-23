// Client-side i18n helper
import { supportedLanguages } from "@/lib/constants";
import { t as serverT } from "@/i18n";
import { locales, stripLocale } from "@/i18n/routing";

export function getPageLocale(): string {
  const [, segment] = location.pathname.split("/");
  return (locales as string[]).includes(segment) ? segment : "en";
}

export const t = (key: string, params?: Record<string, string | number>) =>
  serverT(getPageLocale(), key, params);

export function cycleLanguage(): void {
  const codes = supportedLanguages.map(l => l.code);
  const current = getPageLocale();
  const next = codes[(codes.indexOf(current as typeof codes[number]) + 1) % codes.length];
  const basePath = stripLocale(location.pathname);
  location.href = next === "en" ? basePath : `/${next}${basePath}`;
}

export function switchLocale(locale: string): void {
  const basePath = stripLocale(location.pathname);
  location.href = locale === "en" ? basePath : `/${locale}${basePath}`;
}
