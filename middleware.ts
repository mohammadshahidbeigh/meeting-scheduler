import { auth } from './app/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Session } from 'next-auth'

// Extend NextRequest to include auth property
type AuthenticatedRequest = NextRequest & {
  auth: Session | null
}

export default auth((req: AuthenticatedRequest) => {
  const isLoggedIn = !!req.auth
  const isOnLoginPage = req.nextUrl.pathname.startsWith('/login')
  
  if (isOnLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }
  
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
})

// Protect all routes except these
export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
} 