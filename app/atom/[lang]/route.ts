import { getAtomResponse } from "@/lib/feed"
import { NextRequest } from "next/server"

export async function GET(_: NextRequest, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  return getAtomResponse(lang)
}
