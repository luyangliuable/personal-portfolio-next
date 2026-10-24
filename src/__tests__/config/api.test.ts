import { describe, expect, it, vi } from "vitest";
import { API_BASE_URL, apiImageUrl, apiOrigin, apiUrl } from "@/config/api";

describe("api config", () => {
    it("normalises endpoint and image URLs from the default API host.", () => {
        expect(apiUrl("posts")).toBe(`${API_BASE_URL}/posts`);
        expect(apiUrl("/posts")).toBe(`${API_BASE_URL}/posts`);
        expect(apiImageUrl("abc", 30)).toBe(
            `${API_BASE_URL}/image/abc?compression=30`,
        );
        expect(apiImageUrl("abc")).toBe(
            `${API_BASE_URL}/image/abc?compression=100`,
        );
    });

    it("derives the API origin, or null for a relative base URL.", () => {
        expect(apiOrigin("https://site.test/api")).toBe("https://site.test");
        expect(apiOrigin("http://localhost:3000/api")).toBe(
            "http://localhost:3000",
        );
        expect(apiOrigin("/api")).toBeNull();
    });

    it("falls back to a relative /api when the environment is unset.", async () => {
        const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        try {
            vi.resetModules();
            delete process.env.NEXT_PUBLIC_API_BASE_URL;
            const api = await import("@/config/api");

            expect(api.API_BASE_URL).toBe("/api");
            expect(api.apiOrigin()).toBeNull();
        } finally {
            if (originalApiBaseUrl !== undefined)
                process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
            vi.resetModules();
        }
    });

    it("normalises a trailing slash from the environment API host.", async () => {
        const originalApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        try {
            vi.resetModules();
            process.env.NEXT_PUBLIC_API_BASE_URL = "https://api.test/root/";
            const api = await import("@/config/api");

            expect(api.API_BASE_URL).toBe("https://api.test/root");
            expect(api.apiUrl("posts")).toBe("https://api.test/root/posts");
            expect(api.apiImageUrl("asset")).toBe(
                "https://api.test/root/image/asset?compression=100",
            );
        } finally {
            if (originalApiBaseUrl === undefined) {
                delete process.env.NEXT_PUBLIC_API_BASE_URL;
            } else {
                process.env.NEXT_PUBLIC_API_BASE_URL = originalApiBaseUrl;
            }
            vi.resetModules();
        }
    });
});
