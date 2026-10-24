import { NextRequest, NextResponse } from "next/server";
import { getUserFromCookie } from "@/server/users";
import { errorResponse } from "@/server/route";

export async function GET(request: NextRequest) {
    try {
        const userId = request.cookies.get("user_id")?.value;
        return NextResponse.json(await getUserFromCookie(userId));
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
