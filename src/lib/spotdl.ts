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
 * Uses Spotify API to find songs
 */
export async function searchMusic(
    query: string,
): Promise<SpotdlSearchResult[]> {
    try {
        const searchScript = `
import asyncio
import json
import sys
import os
import ssl
from spotdl.search import from_search_term, SpotifyClient

# Disable SSL verification
ssl._create_default_https_context = ssl._create_unverified_context

async def search_songs(query, client_id, client_secret):
    try:
        # Initialize Spotify client
        SpotifyClient.init(
            client_id=client_id,
            client_secret=client_secret,
            user_auth=False
        )

        # Search for songs
        songs = await from_search_term(query)
        results = []

        for song in songs[:10]:  # Limit to 10 results
            # Generate a unique ID from name and artist
            song_id = f"{song.name}-{song.artist}".encode('utf-8')
            import hashlib
            song_id = hashlib.md5(song_id).hexdigest()[:16]

            results.append({
                "id": song_id,
                "name": song.name,
                "artists": [song.artist],
                "album": song.album_name if hasattr(song, 'album_name') else "",
                "duration": int(song.duration) if hasattr(song, 'duration') and song.duration else 0,
                "coverUrl": song.cover_url if hasattr(song, 'cover_url') else "",
                "spotifyUrl": song.url if hasattr(song, 'url') else "",
                "youtubeUrl": song.download_url if hasattr(song, 'download_url') else ""
            })

        return results
    except Exception as e:
        import traceback
        print(json.dumps({"error": str(e), "traceback": traceback.format_exc()}), file=sys.stderr)
        return []

if __name__ == "__main__":
    query = sys.argv[1] if len(sys.argv) > 1 else ""
    client_id = os.environ.get('SPOTIFY_CLIENT_ID', '')
    client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET', '')

    if not client_id or not client_secret:
        print(json.dumps({"error": "Spotify credentials not found"}), file=sys.stderr)
        sys.exit(1)

    results = asyncio.run(search_songs(query, client_id, client_secret))
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
            `${PYTHON_ENV_PATH} -c '${searchScript.replace(/'/g, "'\\''")}'  '${query.replace(/'/g, "'\\''")}'`,
            {
                maxBuffer: 1024 * 1024 * 10, // 10MB buffer
                env: {
                    ...cleanEnv,
                    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
                    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
                },
            },
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
import json
import sys
import os
import ssl
from spotdl import Spotdl
from spotdl.search import SpotifyClient

# Disable SSL verification
ssl._create_default_https_context = ssl._create_unverified_context

async def download_song(url, output_dir, client_id, client_secret):
    try:
        # Initialize Spotify client
        SpotifyClient.init(
            client_id=client_id,
            client_secret=client_secret,
            user_auth=False
        )

        # Create Spotdl instance with settings
        spotdl = Spotdl(
            client_id=client_id,
            client_secret=client_secret,
            user_auth=False,
            output=output_dir,
            format='mp3',
            threads=1
        )

        # Download the song
        songs = await spotdl.search([url])
        if songs:
            await spotdl.download_songs(songs)
            print("SUCCESS")
        else:
            raise Exception("No songs found for the given URL")

    except Exception as e:
        import traceback
        print(json.dumps({"error": str(e), "traceback": traceback.format_exc()}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    url = sys.argv[1]
    output_dir = sys.argv[2]
    client_id = os.environ.get('SPOTIFY_CLIENT_ID', '')
    client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET', '')

    if not client_id or not client_secret:
        print(json.dumps({"error": "Spotify credentials not found"}), file=sys.stderr)
        sys.exit(1)

    asyncio.run(download_song(url, output_dir, client_id, client_secret))
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
            `${PYTHON_ENV_PATH} -c '${downloadScript.replace(/'/g, "'\\''")}' '${spotifyUrl}' '${songsDir}'`,
            {
                maxBuffer: 1024 * 1024 * 10,
                timeout: 120000, // 2 min timeout
                env: {
                    ...cleanEnv,
                    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
                    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
                },
            },
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
