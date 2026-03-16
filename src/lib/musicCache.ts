import fs from "fs/promises";
import path from "path";
import { stat } from "fs/promises";

const CACHE_DIR = path.join(process.cwd(), ".music-cache");
const SONGS_DIR = path.join(CACHE_DIR, "songs");
const METADATA_DIR = path.join(CACHE_DIR, "metadata");
const COVERS_DIR = path.join(CACHE_DIR, "covers");

/**
 * Check if a song is cached
 */
export function isSongCached(songId: string): Promise<boolean> {
    const songPath = path.join(SONGS_DIR, `${songId}.mp3`);
    return fs
        .access(songPath)
        .then(() => true)
        .catch(() => false);
}

/**
 * Get the file path for a cached song
 */
export function getCachedSongPath(songId: string): string | null {
    const songPath = path.join(SONGS_DIR, `${songId}.mp3`);
    return songPath;
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
    totalSongs: number;
    totalSize: number;
}> {
    try {
        const files = await fs.readdir(SONGS_DIR);
        const mp3Files = files.filter((f) => f.endsWith(".mp3"));

        let totalSize = 0;
        for (const file of mp3Files) {
            const filePath = path.join(SONGS_DIR, file);
            const stats = await stat(filePath);
            totalSize += stats.size;
        }

        return {
            totalSongs: mp3Files.length,
            totalSize,
        };
    } catch (error) {
        return {
            totalSongs: 0,
            totalSize: 0,
        };
    }
}

/**
 * Clean up old cached files
 * @param maxAge Maximum age in milliseconds (default: 30 days)
 */
export async function cleanupCache(
    maxAge: number = 30 * 24 * 60 * 60 * 1000,
): Promise<void> {
    try {
        const now = Date.now();
        const files = await fs.readdir(SONGS_DIR);

        for (const file of files) {
            const filePath = path.join(SONGS_DIR, file);
            const stats = await stat(filePath);
            const age = now - stats.mtimeMs;

            if (age > maxAge) {
                await fs.unlink(filePath);
                console.log(`Deleted old cached file: ${file}`);
            }
        }
    } catch (error) {
        console.error("Error cleaning up cache:", error);
    }
}

/**
 * Ensure cache directories exist
 */
export async function initializeCache(): Promise<void> {
    await fs.mkdir(SONGS_DIR, { recursive: true });
    await fs.mkdir(METADATA_DIR, { recursive: true });
    await fs.mkdir(COVERS_DIR, { recursive: true });
}

/**
 * Delete a specific cached song
 */
export async function deleteCachedSong(songId: string): Promise<boolean> {
    try {
        const songPath = path.join(SONGS_DIR, `${songId}.mp3`);
        const metadataPath = path.join(METADATA_DIR, `${songId}.json`);

        await fs.unlink(songPath).catch(() => {});
        await fs.unlink(metadataPath).catch(() => {});

        return true;
    } catch (error) {
        console.error(`Error deleting cached song ${songId}:`, error);
        return false;
    }
}
