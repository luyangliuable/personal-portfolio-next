import { describe, expect, it, beforeEach, vi } from "vitest";
import { ObjectId } from "mongodb";
import { serializeValue, toObjectId } from "@/server/serialization";
import { buildCorsHeaders } from "@/server/cors";
import { memoryCache } from "@/server/cache";
import { contentTypeFor } from "@/server/image";
import { hashPassword, newSessionToken, verifyPassword } from "@/server/user";
import {
    HttpError,
    insertOneResult,
    requireObjectId,
    updateResult,
} from "@/server/http";

describe("backend serialization", () => {
    it("converts ObjectIds and nested BSON values.", () => {
        const id = new ObjectId();
        expect(toObjectId(id)).toBe(id);
        expect(toObjectId(id.toHexString())?.toHexString()).toBe(
            id.toHexString(),
        );
        expect(toObjectId({ $oid: id.toHexString() })?.toHexString()).toBe(
            id.toHexString(),
        );
        expect(toObjectId("bad")).toBeNull();
        expect(toObjectId("abcdefghijkl")).toBeNull();
        expect(toObjectId(42)).toBeNull();

        const serialized = serializeValue({
            _id: id,
            date_created: new Date("2024-01-02T03:04:05.000Z"),
            tags: ["a"],
            empty: undefined,
        }) as Record<string, unknown>;
        expect(serialized._id).toEqual({ $oid: id.toHexString() });
        expect(serialized.date_created).toBe("2024-01-02T03:04:05Z");
        expect(serialized.tags).toEqual(["a"]);
        expect(serialized.empty).toBeNull();
    });
});

describe("backend cors", () => {
    it("echoes allowed dev origins and only wildcards origin-less requests.", () => {
        expect(
            buildCorsHeaders("http://localhost:3000", "development")[
                "Access-Control-Allow-Origin"
            ],
        ).toBe("http://localhost:3000");
        expect(
            buildCorsHeaders("http://evil.test", "development")[
                "Access-Control-Allow-Origin"
            ],
        ).toBeUndefined();
        expect(
            buildCorsHeaders(null, "development")[
                "Access-Control-Allow-Origin"
            ],
        ).toBe("*");
    });

    it("only allows production origins in production.", () => {
        vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "https://site.test/api");
        expect(
            buildCorsHeaders("https://site.test", "production")[
                "Access-Control-Allow-Origin"
            ],
        ).toBe("https://site.test");
        expect(
            buildCorsHeaders("https://170.64.250.107", "production")[
                "Access-Control-Allow-Origin"
            ],
        ).toBe("https://170.64.250.107");
        expect(
            buildCorsHeaders("http://evil.test", "production")[
                "Access-Control-Allow-Origin"
            ],
        ).toBeUndefined();
        expect(
            buildCorsHeaders(null, "production")["Access-Control-Allow-Origin"],
        ).toBeUndefined();
        vi.unstubAllEnvs();
    });

    it("allows no site origin when the API base URL is relative.", () => {
        vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "/api");
        expect(
            buildCorsHeaders("https://site.test", "production")[
                "Access-Control-Allow-Origin"
            ],
        ).toBeUndefined();
        vi.unstubAllEnvs();
    });
});

describe("backend helpers", () => {
    beforeEach(() => memoryCache.clear());

    it("stores and clears cached values.", () => {
        memoryCache.set("key", 1);
        expect(memoryCache.get("key")).toBe(1);
        expect(memoryCache.has("key")).toBe(true);
        expect(memoryCache.size()).toBe(1);
        memoryCache.clear();
        expect(memoryCache.size()).toBe(0);
    });

    it("maps image types to content types.", () => {
        expect(contentTypeFor("png")).toBe("image/png");
        expect(contentTypeFor("jpeg")).toBe("image/jpeg");
        expect(contentTypeFor("gif")).toBe("image/gif");
        expect(contentTypeFor("pdf")).toBe("application/pdf");
        expect(contentTypeFor("bmp")).toBeNull();
    });

    it("hashes and verifies passwords.", () => {
        const hash = hashPassword("secret");
        expect(hash).not.toBe("secret");
        expect(verifyPassword("secret", hash)).toBe(true);
        expect(verifyPassword("nope", hash)).toBe(false);
        expect(newSessionToken()).toMatch(/^[0-9a-f-]{36}$/);
    });

    it("builds mongo result envelopes.", () => {
        const id = new ObjectId();
        expect(insertOneResult({ insertedId: id } as never)).toEqual({
            insertedId: { $oid: id.toHexString() },
        });
        expect(
            updateResult({
                matchedCount: 1,
                modifiedCount: 1,
                upsertedId: id,
            } as never),
        ).toEqual({
            matchedCount: 1,
            modifiedCount: 1,
            upsertedId: { $oid: id.toHexString() },
        });
        expect(
            updateResult({ matchedCount: 1, modifiedCount: 0 } as never),
        ).toEqual({ matchedCount: 1, modifiedCount: 0, upsertedId: null });
    });

    it("validates object ids with mapped errors.", () => {
        const id = new ObjectId();
        expect(requireObjectId(id.toHexString()).toHexString()).toBe(
            id.toHexString(),
        );
        expect(() => requireObjectId("bad", 500)).toThrow(HttpError);
        try {
            requireObjectId("bad", 500);
        } catch (error) {
            expect((error as HttpError).status).toBe(500);
        }
    });
});
