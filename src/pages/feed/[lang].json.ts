import type { APIRoute } from "astro";
import { supportedLanguages } from "@/lib/constants";
import { getJSONFeedResponse } from "@/lib/feed";

export async function getStaticPaths() {
  return supportedLanguages.map((lang) => ({ params: { lang } }));
}

export const GET: APIRoute = async ({ params }) => {
  const lang = params.lang;
  if (!lang || !supportedLanguages.includes(lang as any)) {
    return new Response("Not found", { status: 404 });
  }

  return getJSONFeedResponse(lang);
};
