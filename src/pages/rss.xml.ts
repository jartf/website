import type { APIRoute } from "astro";
import { getRSSResponse } from "@/lib/feed";

export const GET: APIRoute = async () => {
  return getRSSResponse();
};
