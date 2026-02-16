import type { APIRoute } from "astro";
import { lastFmApiUrl } from "@/lib/constants";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(lastFmApiUrl);
    if (!response.ok) {
      return Response.json({ error: "Unable to fetch Last.fm data" }, { status: 502 });
    }

    return new Response(await response.text(), {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=60, s-maxage=60",
      },
    });
  } catch (error) {
    console.error("lastfm:", error);
    return Response.json({ error: "Unable to fetch Last.fm" }, { status: 502 });
  }
};
