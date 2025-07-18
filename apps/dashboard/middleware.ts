import { NextResponse, type NextRequest } from 'next/server';

// This middleware is used to pass organization slug to the headers.
// In Next.js you can get the header value anywhere in the code (both server and client side).
// However server-side params can only be accessed by the page.

const MAX_SLUG_LENGTH = 255;

export function middleware(request: NextRequest): NextResponse<unknown> {

  const response = NextResponse.next();
  

  return response;
}

export const config = {
  matcher: ['/:path*']
};
