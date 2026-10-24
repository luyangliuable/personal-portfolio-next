import { NextResponse } from "next/server";
import { errorResponse, readOptionalJson } from "@/server/route";
import { streamUpstream } from "@/server/proxy";

export async function POST(request: Request) {
    try {
        const url = new URL(request.url).searchParams.get("url");
        if (!url) return new NextResponse(null, { status: 400 });
        // Any valid JSON value is forwarded; invalid or empty bodies are not.
        const data = await readOptionalJson(request);
        return await streamUpstream(url, {
            method: "POST",
            headers: data ? { "Content-Type": "application/json" } : {},
            body: data ? JSON.stringify(data.value) : undefined,
        });
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
