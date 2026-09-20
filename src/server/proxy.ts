import { NextResponse } from "next/server";
import { HttpError } from "./http";

/** Streams an upstream response through, mirroring api/proxy.rs. */
export async function streamUpstream(
    url: string,
    init?: RequestInit,
): Promise<NextResponse> {
    if (!url) throw new HttpError(400);

    let upstream: Response;
    try {
        upstream = await fetch(url, { method: "GET", ...init });
    } catch {
        throw new HttpError(500);
    }

    const contentType =
        upstream.headers.get("content-type") ?? "application/octet-stream";

    return new NextResponse(upstream.body, {
        status: upstream.status,
        headers: { "Content-Type": contentType },
    });
}
