import { NextResponse } from "next/server";
import { insertMessage } from "@/server/messages";
import { errorResponse, readJson } from "@/server/route";

export async function POST(request: Request) {
    try {
        const body = await readJson(request);
        return NextResponse.json(await insertMessage(body));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
