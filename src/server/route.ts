import { NextResponse } from "next/server";
import { HttpError } from "./http";

export function textResponse(body: string, status = 200): NextResponse {
    return new NextResponse(body, {
        status,
        headers: { "Content-Type": "text/plain" },
    });
}

export function errorResponse(error: unknown): NextResponse {
    if (error instanceof HttpError) {
        return new NextResponse(null, { status: error.status });
    }
    console.error("API error:", error);
    return new NextResponse(null, { status: 500 });
}

export async function readJson(
    request: Request,
): Promise<Record<string, unknown>> {
    try {
        const body = await request.json();
        if (body && typeof body === "object") {
            return body as Record<string, unknown>;
        }
        return {};
    } catch {
        return {};
    }
}

export function sessionTokenCookieOptions() {
    return { path: "/api" };
}
