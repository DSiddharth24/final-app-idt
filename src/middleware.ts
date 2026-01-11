import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ✅ PUBLIC ROUTES (must always be allowed)
  if (
    pathname === '/' ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/api/iot') // allow IoT
  ) {
    return NextResponse.next()
  }

  // 🔒 PROTECTED ROUTES
  if (pathname.startsWith('/dashboard')) {
    // later you’ll check session here
    return NextResponse.next()
  }

  return NextResponse.next()
}
