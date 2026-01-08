import type { APIRoute } from "astro";
import { domainHashes } from "@/lib/constants";

export const prerender = false;

const TEXT_HEADERS: HeadersInit = { "Content-Type": "text/plain" };

export const GET: APIRoute = async ({ request }) => {
  const host = request.headers.get("host") || "";

  const discordHash = Object.entries(domainHashes).find(([domain]) => host.includes(domain))?.[1];

  if (discordHash) {
    return new Response(discordHash, { status: 200, headers: TEXT_HEADERS });
  }

  return new Response("File does not exist.", { status: 404, headers: TEXT_HEADERS });
};
