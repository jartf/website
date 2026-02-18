// i18n

import en from "./translations/en.json";
import vi from "./translations/vi.json";
import ru from "./translations/ru.json";
import et from "./translations/et.json";
import da from "./translations/da.json";
import tr from "./translations/tr.json";
import zh from "./translations/zh.json";
import pl from "./translations/pl.json";
import sv from "./translations/sv.json";
import fi from "./translations/fi.json";
import tok from "./translations/tok.json";
import viHani from "./translations/vi-Hani.json";

export { supportedLanguages, type SupportedLanguage } from "@/lib/constants";
import { getNestedValue } from "./utils";

export const translations: Record<string, Record<string, any>> = {
  en, vi, ru, et, da, tr, zh, pl, sv, fi, tok, vih: viHani,
};

/** Translate a key for a given locale, with optional {{param}} substitution. */
export function t(lang: string, key: string, params?: Record<string, string | number>): string {
  const trans = translations[lang] || translations.en;
  let value = getNestedValue(trans, key);
  if (!value && lang !== "en") value = getNestedValue(translations.en, key);
  if (!value) return key;
  if (!params) return value;
  let result = value;
  for (const [k, v] of Object.entries(params)) result = result.replaceAll(`{{${k}}}`, String(v));
  return result;
}

/** Map locale code to HTML lang attribute value. */
export function htmlLang(locale: string): string {
  return locale === "vih" ? "vi" : locale;
}
