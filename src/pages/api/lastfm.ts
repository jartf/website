import type { APIRoute } from "astro";
import { lastFmApiUrl } from "@/lib/constants";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const response = await fetch(lastFmApiUrl);
    if (!response.ok) {
      return Response.json({ error: "Unable to fetch Last.fm data" }, { status: 200 });
    }

    return new Response(await response.text(), {
      status: 200,
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=60, s-maxage=60",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.log("lastfm:", error);
    return Response.json({ error: "Unable to fetch Last.fm" }, { status: 200 });
  }
};
