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
 * Search for music on YouTube using yt-dlp
 * Returns results in SpotdlSearchResult format with YouTube URLs
 */
export async function searchYoutubeMusic(
    query: string,
): Promise<SpotdlSearchResult[]> {
    try {
        const searchScript = `
import json
import sys
import os
import hashlib
import yt_dlp

def search_youtube(query):
    try:
        ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': True,
            'default_search': 'ytsearch',
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Search for 10 results
            search_query = f'ytsearch10:{query}'
            results = ydl.extract_info(search_query, download=False)

            if not results or 'entries' not in results:
                return []

            formatted_results = []
            for entry in results['entries']:
                if not entry:
                    continue

                # Try to extract title components for better parsing
                title = entry.get('title', 'Unknown')
                duration = entry.get('duration', 0) or 0
                thumbnail = entry.get('thumbnail', '')

                # Try to parse artist and song from title
                # Common format: "Artist - Song" or "Artist: Song"
                parts = title.split(' - ')
                if len(parts) > 1:
                    artist = parts[0].strip()
                    song_name = parts[1].strip()
                else:
                    parts = title.split(':')
                    if len(parts) > 1:
                        artist = parts[0].strip()
                        song_name = parts[1].strip()
                    else:
                        # Fallback: use title as song name, unknown artist
                        artist = 'Unknown'
                        song_name = title

                # Generate a unique ID from YouTube URL
                url = entry.get('url', entry.get('webpage_url', ''))

                # Extract YouTube video ID from URL for caching
                # Format: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
                if 'youtu.be/' in url:
                    song_id = url.split('youtu.be/')[-1].split('?')[0]
                elif 'watch?v=' in url:
                    song_id = url.split('watch?v=')[-1].split('&')[0]
                else:
                    # Fallback to MD5 hash if we can't extract the video ID
                    song_id = hashlib.md5(url.encode('utf-8')).hexdigest()[:16]

                formatted_results.append({
                    "id": song_id,
                    "name": song_name,
                    "artists": [artist],
                    "album": "YouTube Music",
                    "duration": int(duration),
                    "coverUrl": thumbnail,
                    "spotifyUrl": "",
                    "youtubeUrl": url
                })

            return formatted_results
    except Exception as e:
        import traceback
        print(json.dumps({"error": str(e), "traceback": traceback.format_exc()}), file=sys.stderr)
        return []

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else ""
    results = search_youtube(query)
    print(json.dumps(results))
`;

        // Create environment without proxy settings
        const cleanEnv = { ...process.env };
        delete cleanEnv.HTTP_PROXY;
        delete cleanEnv.HTTPS_PROXY;
        delete cleanEnv.http_proxy;
        delete cleanEnv.https_proxy;
        delete cleanEnv.ALL_PROXY;
        delete cleanEnv.all_proxy;
        delete cleanEnv.NO_PROXY;
        delete cleanEnv.no_proxy;

        const { stdout, stderr } = await execAsync(
            `${PYTHON_ENV_PATH} -c '${searchScript.replace(/'/g, "'\\''")}' '${query.replace(/'/g, "'\\''")}'`,
            {
                maxBuffer: 1024 * 1024 * 10, // 10MB buffer
                env: cleanEnv,
            },
        );

        if (stderr && !stderr.includes("WARNING")) {
            console.error("yt-dlp search error:", stderr);
        }

        const results: SpotdlSearchResult[] = JSON.parse(stdout);
        return results;
    } catch (error: any) {
        console.error("Error searching music:", error);
        throw new Error(`Failed to search music: ${error.message}`);
    }
}

/**
 * Search for music using YouTube (via yt-dlp)
 * Returns results in SpotdlSearchResult format with YouTube URLs
 */
export async function searchMusic(
    query: string,
): Promise<SpotdlSearchResult[]> {
    return searchYoutubeMusic(query);
}

/**
 * Extract YouTube video ID from URL
 */
function extractYoutubeId(url: string): string | null {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

/**
 * Download a song using youtube-dl CLI from a YouTube URL
 * Returns the path to the downloaded file
 */
export async function downloadSong(
    youtubeUrl: string,
    songId: string,
): Promise<string> {
    try {
        const songsDir = path.join(CACHE_DIR, "songs");

        // Extract video ID from YouTube URL for caching
        const videoId = extractYoutubeId(youtubeUrl) || songId;
        const outputPath = path.join(songsDir, `${videoId}.mp3`);

        // Check if file already exists
        const fs = await import("fs/promises");
        try {
            await fs.access(outputPath);
            return outputPath; // File already cached
        } catch {
            // File doesn't exist, proceed with download
        }

        // Create environment without proxy settings
        const cleanEnv = { ...process.env };
        delete cleanEnv.HTTP_PROXY;
        delete cleanEnv.HTTPS_PROXY;
        delete cleanEnv.http_proxy;
        delete cleanEnv.https_proxy;
        delete cleanEnv.ALL_PROXY;
        delete cleanEnv.all_proxy;
        delete cleanEnv.NO_PROXY;
        delete cleanEnv.no_proxy;

        // Use yt-dlp CLI to download audio
        const command = [
            "yt-dlp",
            "-x",  // Extract audio
            "--audio-format", "mp3",
            "--audio-quality", "192K",
            "--output", outputPath,
            "--no-playlist",
            "--quiet",
            "--no-warnings",
            youtubeUrl,
        ].join(" ");

        const { stdout, stderr } = await execAsync(command, {
            maxBuffer: 1024 * 1024 * 10,
            timeout: 120000, // 2 min timeout
            env: cleanEnv,
        });

        // Verify the file was created
        await fs.access(outputPath);

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
