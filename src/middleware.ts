import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get the session token from cookies
    const sessionToken = request.cookies.get("authjs.session-token")?.value ||
        request.cookies.get("__Secure-authjs.session-token")?.value;

    const isAuthenticated = !!sessionToken;


    // Protected routes that require authentication
    const protectedRoutes = ["/feed", "/profile", "/chat", "/explore", "/analytics"];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    // Redirect unauthenticated users trying to access protected routes
    if (isProtectedRoute && !isAuthenticated) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from login page
    if (pathname === "/auth/login" && isAuthenticated) {
        return NextResponse.redirect(new URL("/feed", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|uploads).*)"],
};
