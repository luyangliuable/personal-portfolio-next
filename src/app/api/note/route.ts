import { NextResponse } from "next/server";
import { getNotes, insertNote } from "@/server/notes";
import { errorResponse, readJson } from "@/server/route";

export async function GET() {
    try {
        return NextResponse.json(await getNotes());
    } catch (error) {
        return errorResponse(error);
    }
}

export async function POST(request: Request) {
    try {
        const body = await readJson(request);
        return NextResponse.json(await insertNote(body));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
