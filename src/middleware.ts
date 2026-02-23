import { defineMiddleware } from "astro:middleware";
import { getLocaleFromUrl } from "@/i18n/routing";
import type { SupportedLanguage } from "@/lib/constants";

export const onRequest = defineMiddleware(({ url, locals }, next) => {
  locals.lang = getLocaleFromUrl(url) as SupportedLanguage;
  return next();
});
