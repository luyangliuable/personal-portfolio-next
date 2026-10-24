import { NextResponse } from "next/server";
import { mongoUri } from "@/server/db";
import { textResponse } from "@/server/route";

export function GET() {
    if (process.env.ENVIRONMENT === "production") {
        return new NextResponse(null, { status: 401 });
    }

    return textResponse(mongoUri());
}
export const dynamic = "force-dynamic";
