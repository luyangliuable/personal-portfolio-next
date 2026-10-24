import { NextResponse } from "next/server";
import { errorResponse } from "@/server/route";
import { streamUpstream } from "@/server/proxy";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url).searchParams.get("url");
        if (!url) return new NextResponse(null, { status: 400 });
        return await streamUpstream(url);
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
