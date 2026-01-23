import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    // Only run on admin routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
        const authToken = request.cookies.get("auth-token") || request.cookies.get("admin_session")
        const isLoginPage = request.nextUrl.pathname === "/admin/login"

        // If trying to access admin pages without token, redirect to login
        if (!authToken && !isLoginPage) {
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }

        // If trying to access login page WITH token, redirect to dashboard
        if (authToken && isLoginPage) {
            return NextResponse.redirect(new URL("/admin", request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin", "/admin/:path*"],
}
