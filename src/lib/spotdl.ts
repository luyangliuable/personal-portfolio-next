import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import crypto from "crypto";

const execAsync = promisify(exec);

export interface SpotdlSearchResult {
    id: string;
    name: string;
    artists: string[];
    album: string;
    duration: number;
    coverUrl: string;
    spotifyUrl?: string;
    youtubeUrl?: string;
}

const PYTHON_ENV_PATH = path.join(process.cwd(), "python-env", "bin", "python");
const CACHE_DIR = path.join(process.cwd(), ".music-cache");

/**
 * Search for music using spotdl via Python API
 * Uses yt-dlp's ytsearch to find songs
 */
export async function searchMusic(
    query: string,
): Promise<SpotdlSearchResult[]> {
    try {
        const searchScript = `
import asyncio
import json
import sys
from spotdl.types.song import Song

async def search_songs(query):
    try:
        songs = await Song.create_basic_list(query)
        results = []
        for song in songs[:10]:  # Limit to 10 results
            results.append({
                "id": song.song_id or str(hash(song.name + song.artist)),
                "name": song.name,
                "artists": [song.artist],
                "album": song.album_name or "",
                "duration": song.duration or 0,
                "coverUrl": song.cover_url or "",
                "spotifyUrl": song.url,
                "youtubeUrl": song.download_url
            })
        return results
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        return []

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else ""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    results = loop.run_until_complete(search_songs(query))
    print(json.dumps(results))
    loop.close()
`;

        const { stdout, stderr } = await execAsync(
            `${PYTHON_ENV_PATH} -c '${searchScript.replace(/'/g, "'\\''")}'  '${query.replace(/'/g, "'\\''")}'`,
            { maxBuffer: 1024 * 1024 * 10 }, // 10MB buffer
        );

        if (stderr && !stderr.includes("WARNING")) {
            console.error("spotdl search error:", stderr);
        }

        const results: SpotdlSearchResult[] = JSON.parse(stdout);
        return results;
    } catch (error: any) {
        console.error("Error searching music:", error);
        throw new Error(`Failed to search music: ${error.message}`);
    }
}

/**
 * Download a song using spotdl
 * Returns the path to the downloaded file
 */
export async function downloadSong(
    spotifyUrl: string,
    songId: string,
): Promise<string> {
    try {
        const songsDir = path.join(CACHE_DIR, "songs");
        const outputPath = path.join(songsDir, `${songId}.mp3`);

        const downloadScript = `
import asyncio
import sys
from spotdl.download.downloader import DownloadManager

async def download_song(url, output):
    try:
        args = {
            "query": [url],
            "output": output,
            "output_format": "mp3",
            "threads": 1
        }
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        downloader = DownloadManager(args)
        await downloader.download_songs([url])
        downloader.close()
        print("SUCCESS")
    except Exception as e:
        print(f"ERROR: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    url = sys.argv[1]
    output = sys.argv[2]
    asyncio.run(download_song(url, output))
`;

        const { stdout, stderr } = await execAsync(
            `${PYTHON_ENV_PATH} -c '${downloadScript.replace(/'/g, "'\\''")}' '${spotifyUrl}' '${outputPath}'`,
            { maxBuffer: 1024 * 1024 * 10, timeout: 120000 }, // 2 min timeout
        );

        if (stderr || !stdout.includes("SUCCESS")) {
            throw new Error(stderr || "Download failed");
        }

        return outputPath;
    } catch (error: any) {
        console.error("Error downloading song:", error);
        throw new Error(`Failed to download song: ${error.message}`);
    }
}

/**
 * Get the file path for a cached song
 */
export async function getSongPath(songId: string): Promise<string | null> {
    const fs = await import("fs/promises");
    const songPath = path.join(CACHE_DIR, "songs", `${songId}.mp3`);

    try {
        await fs.access(songPath);
        return songPath;
    } catch {
        return null;
    }
}

/**
 * Generate a unique song ID from metadata
 */
export function generateSongId(name: string, artist: string): string {
    return crypto
        .createHash("md5")
        .update(`${name}-${artist}`)
        .digest("hex")
        .substring(0, 16);
}

/**
 * Extract metadata from a song file
 */
export async function extractMetadata(
    songId: string,
): Promise<SpotdlSearchResult | null> {
    const fs = await import("fs/promises");
    const metadataPath = path.join(CACHE_DIR, "metadata", `${songId}.json`);

    try {
        const data = await fs.readFile(metadataPath, "utf-8");
        return JSON.parse(data);
    } catch {
        return null;
    }
}

/**
 * Save metadata for a song
 */
export async function saveMetadata(
    songId: string,
    metadata: SpotdlSearchResult,
): Promise<void> {
    const fs = await import("fs/promises");
    const metadataPath = path.join(CACHE_DIR, "metadata", `${songId}.json`);

    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
}
