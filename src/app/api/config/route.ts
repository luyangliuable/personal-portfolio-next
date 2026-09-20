import { NextResponse } from "next/server";
import { insertConfig } from "@/server/config";
import { errorResponse, readJson } from "@/server/route";

export async function POST(request: Request) {
    try {
        const body = await readJson(request);
        return NextResponse.json(await insertConfig(body));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
