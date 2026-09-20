import { NextResponse } from "next/server";
import { textResponse } from "@/server/route";

export async function GET() {
    if (process.env.ENVIRONMENT === "production") {
        return new NextResponse(null, { status: 401 });
    }

    const uri = process.env.MONGOURI ?? "mongodb://localhost:27017";
    return textResponse(uri);
}
export const dynamic = "force-dynamic";
