import { NextResponse } from 'next/server';
import { DOMAIN_HASHES } from '@/lib/constants';

const TEXT_HEADERS = { 'Content-Type': 'text/plain' };

export async function GET(request) {
  const host = request.headers.get('host') || '';

  const discordHash = Object.entries(DOMAIN_HASHES).find(([domain]) =>
    host.includes(domain)
  )?.[1];

  if (discordHash) {
    return new NextResponse(discordHash, {
      status: 200,
      headers: TEXT_HEADERS,
    });
  }

  return new NextResponse('File does not exist.', {
    status: 404,
    headers: TEXT_HEADERS,
  });
}
