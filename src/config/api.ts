// Relative fallback only works in the browser; server-side fetches need the
// absolute NEXT_PUBLIC_API_BASE_URL (see .env.local.example).
const DEFAULT_API_BASE_URL = "/api";

export const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, "");

/** Scheme and host of the API, or null when the base URL is relative. */
export function apiOrigin(baseUrl: string = API_BASE_URL): string | null {
    try {
        return new URL(baseUrl).origin;
    } catch {
        return null;
    }
}

export function apiUrl(path: string): string {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
}

export function apiImageUrl(id: string, compression?: number): string {
    const query = `compression=${compression ?? 100}`;
    return `${apiUrl(`/image/${id}`)}?${query}`;
}
