import { NextResponse } from "next/server";
import { getImages, insertImage } from "@/server/images";
import { errorResponse, readJson } from "@/server/route";

export async function GET() {
    try {
        return NextResponse.json(await getImages());
    } catch (error) {
        return errorResponse(error);
    }
}

export async function POST(request: Request) {
    try {
        const body = await readJson(request);
        return NextResponse.json(await insertImage(body));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
