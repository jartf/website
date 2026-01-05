import { NextResponse } from 'next/server';

export async function GET(request) {
  const host = request.headers.get('host') || '';

  // Check the host domain and return appropriate value
  if (host.includes('jarema.me')) {
    return new NextResponse('dh=2147463547test', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  if (host.includes('z.is-a.dev')) {
    return new NextResponse('dh=151caf0b951e4ef19ec7ca771079fbed44c28970', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  if (host.includes('localhost')) {
    return new NextResponse('dh=2147463847test', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  // Default response if host doesn't match
  return new NextResponse('File does not exist.', {
    status: 404,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
