import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if pathname is root or locale root (e.g., /, /en, /zh)
  const isRoot = pathname === '/'
  const isLocaleRoot = pathname === '/en' || pathname === '/zh'

  if (isRoot || isLocaleRoot) {
    // Redirect to /aiToGame while preserving locale
    const locale = isLocaleRoot ? pathname.slice(1) : routing.defaultLocale
    const redirectUrl = new URL(`/${locale}/sceneTo3d`, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Continue with next-intl middleware for all other routes
  return intlMiddleware(request)
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|assets|.*\\..*).*)'],
}