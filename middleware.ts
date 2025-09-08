import { auth } from "@/auth"
import { NextResponse } from "next/server"

type AuthRequest = {
  nextUrl: { pathname: string }
  url: string
  auth?: {
    user?: {
      isActive?: boolean
      role?: string
    }
  }
}

export default auth((req: AuthRequest) => {
  const { pathname } = req.nextUrl

  // Public routes that don't require authentication
  if (pathname.startsWith("/auth") || pathname === "/" || pathname.startsWith("/api/auth/register")) {
    return NextResponse.next()
  }

  // API routes protection
  if (pathname.startsWith("/api")) {
    // If no session for protected API routes
    if (!req.auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is active
    if (!req.auth.user?.isActive) {
      return NextResponse.json({ error: "Account inactive" }, { status: 403 })
    }

    const userRole = req.auth.user?.role as string

    // Super Admin API routes
    if (pathname.startsWith("/api/super-admin") || pathname.startsWith("/api/gram-panchayat")) {
      if (userRole !== "SUPER_ADMIN") {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }
    }

    // Admin API routes (only ADMIN)
    if (pathname.startsWith("/api/admin")) {
      if (userRole !== "ADMIN") {
        return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
      }
    }

    return NextResponse.next()
  }

  // If no session, redirect to sign in
  if (!req.auth) {
    return NextResponse.redirect(new URL("/auth/signin", req.url))
  }

  // Check if user is active
  if (!req.auth.user?.isActive) {
    return NextResponse.redirect(new URL("/auth/error?error=AccessDenied", req.url))
  }

  // Role-based route protection
  const userRole = req.auth.user?.role as string

  // Super Admin routes
  if (pathname.startsWith("/super-admin")) {
    if (userRole !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // Admin routes (only ADMIN)
  if (pathname.startsWith("/admin")) {
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url))
    }
  }

  // Staff routes (accessible by all authenticated users)
  if (pathname.startsWith("/staff") || pathname.startsWith("/dashboard")) {
    if (!["STAFF", "ADMIN", "SUPER_ADMIN"].includes(userRole)) {
      return NextResponse.redirect(new URL("/auth/signin", req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
