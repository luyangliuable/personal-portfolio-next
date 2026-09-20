import { NextResponse } from "next/server";
import { verifySession } from "@/server/users";
import { errorResponse, readJson } from "@/server/route";

export async function POST(request: Request) {
    try {
        const body = await readJson(request);
        return NextResponse.json(await verifySession(body));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
