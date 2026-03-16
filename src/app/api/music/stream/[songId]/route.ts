import { NextRequest, NextResponse } from "next/server";
import { stat, open } from "fs/promises";
import { getCachedSongPath } from "@/lib/musicCache";
import { createReadStream } from "fs";

export async function GET(
    req: NextRequest,
    { params }: { params: { songId: string } },
) {
    try {
        const { songId } = params;

        if (!songId) {
            return NextResponse.json(
                { error: "Song ID is required" },
                { status: 400 },
            );
        }

        // Get song path
        const songPath = getCachedSongPath(songId);

        if (!songPath) {
            return NextResponse.json(
                { error: "Song not found" },
                { status: 404 },
            );
        }

        // Check if file exists
        let fileStats;
        try {
            fileStats = await stat(songPath);
        } catch {
            return NextResponse.json(
                { error: "Song file not found" },
                { status: 404 },
            );
        }

        const fileSize = fileStats.size;

        // Parse range header
        const range = req.headers.get("range");

        if (range) {
            // Handle range request (for seeking)
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0] ?? "0", 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = end - start + 1;

            // Read file chunk
            const file = await open(songPath, "r");
            const buffer = Buffer.alloc(chunkSize);
            await file.read(buffer, 0, chunkSize, start);
            await file.close();

            return new NextResponse(buffer, {
                status: 206,
                headers: {
                    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": chunkSize.toString(),
                    "Content-Type": "audio/mpeg",
                },
            });
        } else {
            // Stream entire file
            const stream = createReadStream(songPath);
            const readableStream = new ReadableStream({
                start(controller) {
                    stream.on("data", (chunk: Buffer) => {
                        controller.enqueue(new Uint8Array(chunk));
                    });
                    stream.on("end", () => {
                        controller.close();
                    });
                    stream.on("error", (error) => {
                        controller.error(error);
                    });
                },
            });

            return new NextResponse(readableStream, {
                status: 200,
                headers: {
                    "Content-Type": "audio/mpeg",
                    "Content-Length": fileSize.toString(),
                    "Accept-Ranges": "bytes",
                },
            });
        }
    } catch (error: any) {
        console.error("Error streaming music:", error);
        return NextResponse.json(
            {
                error: "Failed to stream music",
                details: error.message,
            },
            { status: 500 },
        );
    }
}
