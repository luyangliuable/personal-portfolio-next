import { NextResponse } from "next/server";
import { getPosts, insertPost } from "@/server/posts";
import { errorResponse, readJsonBody } from "@/server/route";

export async function GET() {
    try {
        return NextResponse.json(await getPosts());
    } catch (error) {
        return errorResponse(error);
    }
}

export async function POST(request: Request) {
    try {
        const body = await readJsonBody(request);
        return NextResponse.json(await insertPost(body));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
