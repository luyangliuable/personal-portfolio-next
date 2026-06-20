const DEFAULT_API_BASE_URL = "http://localhost:8080/api";

export const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL
).replace(/\/$/, "");

export function apiUrl(path: string): string {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
}

export function apiImageUrl(id: string, compression?: number): string {
    const query = `compression=${compression ?? 100}`;
    return `${apiUrl(`/image/${id}`)}?${query}`;
}
