import { NextResponse } from "next/server";
import { errorResponse, readJson } from "@/server/route";
import { streamUpstream } from "@/server/proxy";

export async function POST(request: Request) {
    try {
        const url = new URL(request.url).searchParams.get("url");
        if (!url) return new NextResponse(null, { status: 400 });
        const body = await readJson(request);
        const hasBody = Object.keys(body).length > 0;
        return await streamUpstream(url, {
            method: "POST",
            headers: hasBody ? { "Content-Type": "application/json" } : {},
            body: hasBody ? JSON.stringify(body) : undefined,
        });
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
