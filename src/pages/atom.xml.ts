import type { APIRoute } from "astro";
import { getAtomResponse } from "@/lib/feed";

export const GET: APIRoute = async () => {
  return getAtomResponse();
};
