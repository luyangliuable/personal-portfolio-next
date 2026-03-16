import { NextRequest, NextResponse } from "next/server";
import {
    downloadSong,
    generateSongId,
    saveMetadata,
    type SpotdlSearchResult,
} from "../../../../lib/spotdl";
import { isSongCached, getCachedSongPath } from "../../../../lib/musicCache";

interface DownloadRequestBody {
    spotifyUrl: string;
    metadata: SpotdlSearchResult;
}

// Prevent duplicate downloads with a simple in-memory lock
const downloadLocks = new Set<string>();

export async function POST(req: NextRequest) {
    try {
        const body: DownloadRequestBody = await req.json();

        // Validate input
        if (!body.spotifyUrl || !body.metadata) {
            return NextResponse.json(
                { error: "Spotify URL and metadata are required" },
                { status: 400 },
            );
        }

        // Generate song ID
        const songId = generateSongId(
            body.metadata.name,
            body.metadata.artists[0] ?? "Unknown",
        );

        // Check if already cached
        const cached = await isSongCached(songId);
        if (cached) {
            const songPath = getCachedSongPath(songId);
            return NextResponse.json(
                {
                    songId,
                    cached: true,
                    path: songPath,
                    message: "Song already cached",
                },
                { status: 200 },
            );
        }

        // Check if download is in progress
        if (downloadLocks.has(songId)) {
            return NextResponse.json(
                {
                    songId,
                    downloading: true,
                    message: "Download in progress",
                },
                { status: 202 },
            );
        }

        // Lock to prevent duplicate downloads
        downloadLocks.add(songId);

        try {
            // Download the song
            const songPath = await downloadSong(body.spotifyUrl, songId);

            // Save metadata
            await saveMetadata(songId, body.metadata);

            return NextResponse.json(
                {
                    songId,
                    cached: false,
                    path: songPath,
                    message: "Song downloaded successfully",
                },
                { status: 200 },
            );
        } finally {
            // Release lock
            downloadLocks.delete(songId);
        }
    } catch (error: any) {
        console.error("Error in music download API:", error);
        return NextResponse.json(
            {
                error: "Failed to download song",
                details: error.message,
            },
            { status: 500 },
        );
    }
}
