import { NextResponse } from "next/server";
import { login } from "@/server/users";
import {
    errorResponse,
    readJsonBody,
    sessionCookieOptions,
} from "@/server/route";

export async function POST(request: Request) {
    try {
        const body = await readJsonBody(request);
        const session = await login(body);
        const response = NextResponse.json(session);
        response.cookies.set(
            "session_token",
            session.session_token,
            sessionCookieOptions(),
        );
        response.cookies.set("user_id", session.userid, sessionCookieOptions());
        return response;
    } catch (error) {
        return errorResponse(error);
    }
}
export const dynamic = "force-dynamic";
