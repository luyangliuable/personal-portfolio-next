import { NextResponse } from "next/server";
import { getNote } from "@/server/notes";
import { errorResponse } from "@/server/route";

interface Context {
    params: { id: string };
}

export async function GET(_request: Request, { params }: Context) {
    try {
        return NextResponse.json(await getNote(params.id));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
