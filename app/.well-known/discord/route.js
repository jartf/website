import { NextResponse } from 'next/server';

const DOMAIN_HASHES = {
  'jarema.me': 'dh=1d651c707c7a9a0d03b235429393417f9506161c',
  'z.is-a.dev': 'dh=151caf0b951e4ef19ec7ca771079fbed44c28970',
  'localhost': 'dh=2147463847test',
};

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
