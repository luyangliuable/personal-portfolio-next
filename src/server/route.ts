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

/** Rocket's default `json` data limit. */
const JSON_LIMIT_BYTES = 1024 * 1024;

/** Mirrors Rocket's Json guard: 413 over the limit, 400 on bad syntax. */
export async function readJsonBody(request: Request): Promise<unknown> {
    const bytes = new Uint8Array(await request.arrayBuffer());
    if (bytes.byteLength > JSON_LIMIT_BYTES) throw new HttpError(413);
    try {
        const decoder = new TextDecoder("utf-8", {
            fatal: true,
            ignoreBOM: true,
        });
        return JSON.parse(decoder.decode(bytes));
    } catch {
        throw new HttpError(400);
    }
}

/** `Option<Json<Value>>`: any failure becomes "no data". */
export async function readOptionalJson(
    request: Request,
): Promise<{ value: unknown } | null> {
    try {
        return { value: await readJsonBody(request) };
    } catch {
        return null;
    }
}

/** Rocket's CookieJar::add defaults SameSite to Strict. */
export function sessionCookieOptions() {
    return { path: "/api", sameSite: "strict" as const };
}
