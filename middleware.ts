import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const adminSession = request.cookies.get("admin_session")?.value
  const otpVerified = request.cookies.get("otp_verified")?.value

  const isAuthRoute = pathname.startsWith("/auth")
  const isAdminRoute = pathname.startsWith("/admin")

  // If accessing admin routes, check authentication
  if (isAdminRoute) {
    if (adminSession !== "authenticated" || otpVerified !== "true") {
      return NextResponse.redirect(new URL("/auth/login", request.url))
    }
  }

  // If already authenticated and accessing auth routes, redirect to admin
  if (isAuthRoute && adminSession === "authenticated" && otpVerified === "true") {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
