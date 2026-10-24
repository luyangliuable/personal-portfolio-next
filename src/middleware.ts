import { NextRequest, NextResponse } from "next/server";
import { buildCorsHeaders } from "./server/cors";

export function middleware(request: NextRequest) {
    const headers = buildCorsHeaders(request.headers.get("origin"));

    if (request.method === "OPTIONS") {
        return new NextResponse(null, { status: 204, headers });
    }

    const response = NextResponse.next();
    for (const [key, value] of Object.entries(headers)) {
        response.headers.set(key, value);
    }
    return response;
}

export const config = {
    matcher: "/api/:path*",
};
