import { NextResponse } from "next/server";
import { getPosts, insertPost } from "@/server/posts";
import { errorResponse, readJson } from "@/server/route";

export async function GET() {
    try {
        return NextResponse.json(await getPosts());
    } catch (error) {
        return errorResponse(error);
    }
}

export async function POST(request: Request) {
    try {
        const body = await readJson(request);
        return NextResponse.json(await insertPost(body));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
