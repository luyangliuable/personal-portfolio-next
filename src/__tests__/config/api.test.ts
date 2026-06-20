import { describe, expect, it } from "vitest";
import { API_BASE_URL, apiImageUrl, apiUrl } from "@/config/api";

describe("api config", () => {
    it("normalises endpoint and image URLs", () => {
        expect(apiUrl("posts")).toBe(`${API_BASE_URL}/posts`);
        expect(apiUrl("/posts")).toBe(`${API_BASE_URL}/posts`);
        expect(apiImageUrl("abc", 30)).toBe(
            `${API_BASE_URL}/image/abc?compression=30`,
        );
        expect(apiImageUrl("abc")).toBe(
            `${API_BASE_URL}/image/abc?compression=100`,
        );
    });
});
