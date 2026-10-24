import { NextResponse } from "next/server";
import { getNotes, insertNote } from "@/server/notes";
import { errorResponse, readJsonBody } from "@/server/route";

export async function GET() {
    try {
        return NextResponse.json(await getNotes());
    } catch (error) {
        return errorResponse(error);
    }
}

export async function POST(request: Request) {
    try {
        const body = await readJsonBody(request);
        return NextResponse.json(await insertNote(body));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
