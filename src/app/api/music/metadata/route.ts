import { NextRequest, NextResponse } from "next/server";
import { extractMetadata } from "../../../../lib/spotdl";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const songId = searchParams.get("songId");

        if (!songId) {
            return NextResponse.json(
                { error: "Song ID is required" },
                { status: 400 },
            );
        }

        // Get metadata
        const metadata = await extractMetadata(songId);

        if (!metadata) {
            return NextResponse.json(
                { error: "Metadata not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(metadata, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching metadata:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch metadata",
                details: error.message,
            },
            { status: 500 },
        );
    }
}
