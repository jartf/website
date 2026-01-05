import { getAtomResponse } from "@/lib/feed"
import { supportedLanguages } from "@/lib/constants"
import { NextRequest } from "next/server"

export async function GET(_: NextRequest, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const language = lang.replace(".xml", "")
  if (!supportedLanguages.includes(language)) {
    return new Response("Language not supported", { status: 404 })
  }
  return getAtomResponse(language)
}
