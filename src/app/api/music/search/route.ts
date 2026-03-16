import { NextRequest, NextResponse } from "next/server";
import { searchMusic } from "@/lib/spotdl";
import { initializeCache } from "@/lib/musicCache";

interface SearchRequestBody {
    query: string;
}

export async function POST(req: NextRequest) {
    try {
        // Initialize cache directories
        await initializeCache();

        // Parse request body
        const body: SearchRequestBody = await req.json();

        // Validate input
        if (!body.query || body.query.trim().length === 0) {
            return NextResponse.json(
                { error: "Search query is required" },
                { status: 400 },
            );
        }

        // Search for music
        const results = await searchMusic(body.query);

        return NextResponse.json(
            { results, count: results.length },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Error in music search API:", error);
        return NextResponse.json(
            {
                error: "Failed to search for music",
                details: error.message,
            },
            { status: 500 },
        );
    }
}
