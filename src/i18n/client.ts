// Client-side i18n helper (intentionally does NOT import from @/i18n to avoid bundling translations)
import { supportedLanguages } from "@/lib/constants";
import { getLocaleFromUrl, stripLocale } from "@/i18n/routing";

declare global {
  interface Window { _I18N_DICT?: Record<string, unknown>; }
}

export const getPageLocale = (): string => getLocaleFromUrl(new URL(location.href));

const getNestedValue = (obj: Record<string, unknown>, path: string): string | undefined => {
  let cur: unknown = obj;
  for (const k of path.split(".")) {
    if (cur && typeof cur === "object" && k in cur) cur = (cur as Record<string, unknown>)[k];
    else return undefined;
  }
  return typeof cur === "string" ? cur : undefined;
};

export const t = (key: string, params?: Record<string, string | number>): string => {
  const value = getNestedValue(window._I18N_DICT ?? {}, key);
  if (!value) return key;
  if (!params) return value;
  return Object.entries(params).reduce((s, [k, v]) => s.replaceAll(`{{${k}}}`, String(v)), value);
};

export const cycleLanguage = (): void => {
  const codes = supportedLanguages.map(l => l.code);
  const idx = codes.indexOf(getPageLocale() as typeof codes[number]);
  const next = codes[(idx + 1) % codes.length];
  location.href = next === "en" ? stripLocale(location.pathname) : `/${next}${stripLocale(location.pathname)}`;
};

export const switchLocale = (locale: string): void => {
  const basePath = stripLocale(location.pathname);
  location.href = locale === "en" ? basePath : `/${locale}${basePath}`;
};
