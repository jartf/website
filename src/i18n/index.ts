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

export const translations: Record<string, Record<string, any>> = {
  en, vi, ru, et, da, tr, zh, pl, sv, fi, tok, "vi-Hani": viHani,
};

function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  let cur: any = obj;
  for (const k of path.split(".")) {
    if (cur && typeof cur === "object" && k in cur) cur = cur[k];
    else return undefined;
  }
  return typeof cur === "string" ? cur : undefined;
}

export function t(lang: string, key: string, params?: Record<string, string | number>): string {
  let value = getNestedValue(translations[lang] || translations.en, key);
  if (!value && lang !== "en") value = getNestedValue(translations.en, key);
  if (!value) return key;
  if (!params) return value;
  return Object.entries(params).reduce((s, [k, v]) => s.replaceAll(`{{${k}}}`, String(v)), value);
}

export function htmlLang(locale: string): string {
  return locale;
}
