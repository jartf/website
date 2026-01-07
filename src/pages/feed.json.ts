import type { APIRoute } from "astro";
import { getJSONFeedResponse } from "@/lib/feed";

export const GET: APIRoute = async () => {
  return getJSONFeedResponse();
};
