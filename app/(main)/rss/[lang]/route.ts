import { getRSSResponse } from "@/lib/feed"
import { SUPPORTED_LANGUAGES } from "@/lib/constants"
import { NextRequest } from "next/server"

export async function GET(_: NextRequest, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = lang.replace(".xml", "")
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return new Response("Language not supported", { status: 404 })
  }
  return getRSSResponse(language)
}
