import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
    "/",
    "/signin",
    "/signup",
];

export function proxy(request: NextRequest) {
    const token = request.cookies.get("rapidserve_token")?.value;
    const { pathname } = request.nextUrl;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // Unauthenticated users can only access public routes
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(
            new URL("/signin", request.url)
        );
    }

    // Authenticated users should not visit auth pages
    if (
        token &&
        (pathname === "/signin" || pathname === "/signup")
    ) {
        return NextResponse.redirect(
            new URL("/dashboard", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};