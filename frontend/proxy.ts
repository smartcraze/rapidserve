import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("rapidserve_token")?.value;

    // Protect dashboard routes only
    if (
        !token &&
        request.nextUrl.pathname.startsWith("/dashboard")
    ) {
        return NextResponse.redirect(
            new URL("/signin", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};