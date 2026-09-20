import { NextResponse } from "next/server";
import { getPost, updatePost } from "@/server/posts";
import { errorResponse, readJson } from "@/server/route";

interface Context {
    params: { id: string };
}

export async function GET(_request: Request, { params }: Context) {
    try {
        return NextResponse.json(await getPost(params.id));
    } catch (error) {
        return errorResponse(error);
    }
}

export async function PATCH(request: Request, { params }: Context) {
    try {
        const body = await readJson(request);
        return NextResponse.json(await updatePost(params.id, body));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
