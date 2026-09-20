import { NextResponse } from "next/server";

export async function POST() {
    const response = new NextResponse(null, { status: 200 });
    response.cookies.set("session_token", "", { path: "/api", maxAge: 0 });
    response.cookies.set("user_id", "", { path: "/api", maxAge: 0 });
    return response;
}
export const dynamic = "force-dynamic";
