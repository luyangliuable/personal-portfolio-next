import { NextResponse } from "next/server";
import { login } from "@/server/users";
import { errorResponse, readJson } from "@/server/route";

export async function POST(request: Request) {
    try {
        const body = await readJson(request);
        const session = await login(body);
        const response = NextResponse.json(session);
        response.cookies.set("session_token", session.session_token, {
            path: "/api",
        });
        response.cookies.set("user_id", session.userid, { path: "/api" });
        return response;
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
