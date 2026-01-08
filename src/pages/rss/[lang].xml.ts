import type { APIRoute } from "astro";
import { supportedLanguages } from "@/lib/constants";
import { getRSSResponse } from "@/lib/feed";

export async function getStaticPaths() {
  return supportedLanguages.map((lang) => ({ params: { lang: lang.code } }));
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang;
  const validLangCodes = supportedLanguages.map((l) => l.code);
  if (!lang || !validLangCodes.includes(lang)) {
    return new Response("Not found", { status: 404 });
  }

  return getRSSResponse(lang as any);
};
