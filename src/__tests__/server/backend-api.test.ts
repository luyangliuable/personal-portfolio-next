import { describe, expect, it, beforeEach } from "vitest";
import { ObjectId } from "mongodb";
import {
    formatDate,
    parseDate,
    serializeValue,
    toObjectId,
} from "@/server/serialization";
import { buildCorsHeaders } from "@/server/cors";
import { normalizeDocument, withoutId } from "@/server/documents";
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
    it("formats and parses dates like the Rust service.", () => {
        const date = new Date("2024-01-02T03:04:05.123Z");
        expect(formatDate(date)).toBe("2024-01-02T03:04:05.123Z");
        expect(parseDate("2024-01-02T03:04:05.123Z")?.toISOString()).toBe(
            date.toISOString(),
        );
        expect(parseDate(date)).toBe(date);
        expect(parseDate("")).toBeNull();
        expect(parseDate("nope")).toBeNull();
        expect(parseDate(null)).toBeNull();
    });

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
        expect(toObjectId(42)).toBeNull();

        const serialized = serializeValue({
            _id: id,
            image: id,
            date_created: new Date("2024-01-02T03:04:05.000Z"),
            tags: ["a"],
            empty: undefined,
        }) as Record<string, unknown>;
        expect(serialized._id).toEqual({ $oid: id.toHexString() });
        expect(serialized.image).toEqual({ $oid: id.toHexString() });
        expect(serialized.date_created).toBe("2024-01-02T03:04:05.000Z");
        expect(serialized.tags).toEqual(["a"]);
        expect(serialized.empty).toBeNull();
    });
});

describe("backend documents", () => {
    it("normalizes dates, ObjectIds and drops empty ids.", () => {
        const id = new ObjectId();
        const document = normalizeDocument(
            {
                _id: { $oid: id.toHexString() },
                date_created: "2024-01-02T03:04:05.000Z",
            },
            { dateFields: ["date_created"], oidFields: ["_id"] },
        );
        expect(document.date_created).toBeInstanceOf(Date);
        expect((document._id as ObjectId).toHexString()).toBe(id.toHexString());
        expect(withoutId({ _id: null, a: 1 })).toEqual({ a: 1 });
        expect(withoutId({ _id: undefined })).toEqual({});
        expect(withoutId({ _id: id })).toHaveProperty("_id", id);
    });
});

describe("backend cors", () => {
    it("echoes allowed dev origins and falls back to wildcard.", () => {
        expect(
            buildCorsHeaders("http://localhost:3000", "development")[
                "Access-Control-Allow-Origin"
            ],
        ).toBe("http://localhost:3000");
        expect(
            buildCorsHeaders("http://evil.test", "development")[
                "Access-Control-Allow-Origin"
            ],
        ).toBe("*");
        expect(
            buildCorsHeaders(null, "development")[
                "Access-Control-Allow-Origin"
            ],
        ).toBe("*");
    });

    it("only allows production origins in production.", () => {
        expect(
            buildCorsHeaders("https://llcode.tech", "production")[
                "Access-Control-Allow-Origin"
            ],
        ).toBe("https://llcode.tech");
        expect(
            buildCorsHeaders("http://evil.test", "production")[
                "Access-Control-Allow-Origin"
            ],
        ).toBeUndefined();
        expect(
            buildCorsHeaders(null, "production")["Access-Control-Allow-Origin"],
        ).toBeUndefined();
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
            inserted_id: { $oid: id.toHexString() },
        });
        expect(
            updateResult({
                matchedCount: 1,
                modifiedCount: 1,
                upsertedId: id,
            } as never),
        ).toEqual({
            matched_count: 1,
            modified_count: 1,
            upserted_id: { $oid: id.toHexString() },
        });
    });

    it("validates object ids with mapped errors.", () => {
        const id = new ObjectId();
        expect(requireObjectId(id.toHexString()).toHexString()).toBe(
            id.toHexString(),
        );
        expect(() => requireObjectId("bad", 500)).toThrowError(HttpError);
        try {
            requireObjectId("bad", 500);
        } catch (error) {
            expect((error as HttpError).status).toBe(500);
        }
    });
});
