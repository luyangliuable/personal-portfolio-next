import { describe, expect, it } from "vitest";
import { ObjectId } from "mongodb";
import { formatRustDate, normalizeRustDate } from "@/server/rustDate";
import { fromJson, fromStorage, toResponse } from "@/server/schema";
import { CONFIG, MESSAGE, POST, USER } from "@/server/models";
import { HttpError } from "@/server/http";

describe("rust date format", () => {
    it("prints 0, 3, 6 or 9 fractional digits like chrono %.f.", () => {
        expect(formatRustDate(new Date("2024-01-02T03:04:05Z"))).toBe(
            "2024-01-02T03:04:05Z",
        );
        expect(formatRustDate(new Date("2024-01-02T03:04:05.120Z"))).toBe(
            "2024-01-02T03:04:05.120Z",
        );
        expect(normalizeRustDate("2024-01-02T03:04:05.123456Z")).toBe(
            "2024-01-02T03:04:05.123456Z",
        );
        expect(normalizeRustDate("2024-01-02T03:04:05.1234567891Z")).toBe(
            "2024-01-02T03:04:05.123456789Z",
        );
        expect(normalizeRustDate("2024-01-02T03:04:05.000Z")).toBe(
            "2024-01-02T03:04:05Z",
        );
    });

    it("converts offsets to UTC and rejects non-RFC3339 input.", () => {
        expect(normalizeRustDate("2024-01-01t10:00:00+10:00")).toBe(
            "2024-01-01T00:00:00Z",
        );
        expect(normalizeRustDate("2024-01-01T00:30:00-01:30")).toBe(
            "2024-01-01T02:00:00Z",
        );
        expect(normalizeRustDate("2024-02-30T00:00:00Z")).toBeNull();
        expect(normalizeRustDate("2024-01-01 00:00:00Z")).toBeNull();
        expect(normalizeRustDate("2024-01-01T24:00:00Z")).toBeNull();
        expect(normalizeRustDate("2024-01-01T00:00:00")).toBeNull();
    });
});

const validPost = {
    heading: "h",
    author: "a",
    post_type: "blog",
    year: 2024,
    month: 1,
    file_name: "f",
    body: "",
};

function statusOf(run: () => unknown): number | undefined {
    try {
        run();
    } catch (error) {
        return (error as HttpError).status;
    }
    return undefined;
}

describe("serde-style request decoding", () => {
    it("drops unknown fields, nulls missing options and skips empty _id.", () => {
        const post = fromJson({ ...validPost, extra: 1, _id: null }, POST);
        expect(post).not.toHaveProperty("extra");
        expect(post).not.toHaveProperty("_id");
        expect(post.description).toBeNull();
        expect(post.date_created).toBeNull();
        expect(Object.keys(post)[0]).toBe("heading");
    });

    it("answers 422 for missing or mistyped fields.", () => {
        expect(
            statusOf(() => fromJson({ ...validPost, body: undefined }, POST)),
        ).toBe(422);
        expect(
            statusOf(() => fromJson({ ...validPost, year: 1.5 }, POST)),
        ).toBe(422);
        expect(
            statusOf(() => fromJson({ ...validPost, year: 2 ** 31 }, POST)),
        ).toBe(422);
        expect(
            statusOf(() => fromJson({ ...validPost, tags: [1] }, POST)),
        ).toBe(422);
        expect(
            statusOf(() => fromJson({ ...validPost, image: "bad" }, POST)),
        ).toBe(422);
        expect(
            statusOf(() =>
                fromJson({ ...validPost, date_created: "nope" }, POST),
            ),
        ).toBe(422);
        expect(statusOf(() => fromJson([], POST))).toBe(422);
        expect(
            statusOf(() => fromJson({ name: "n", message_type: "X" }, MESSAGE)),
        ).toBe(422);
        expect(statusOf(() => fromJson({ key: "k" }, CONFIG))).toBe(422);
    });

    it("decodes ObjectIds, dates and enums.", () => {
        const id = new ObjectId();
        const post = fromJson(
            {
                ...validPost,
                image: { $oid: id.toHexString() },
                date_created: "",
            },
            POST,
        );
        expect((post.image as ObjectId).equals(id)).toBe(true);
        expect(post.date_created).toBeNull();
        const message = fromJson(
            { name: "n", message_type: "CONSULTINGMESSAGE" },
            MESSAGE,
        );
        expect(message.message_type).toBe("CONSULTINGMESSAGE");
        const user = fromJson(
            {
                username: "u",
                password: "p",
                email: "e",
                first_name: "f",
                last_name: "l",
                _id: { $oid: id.toHexString() },
            },
            USER,
        );
        expect((user._id as ObjectId).equals(id)).toBe(true);
    });
});

describe("serde-style storage decoding", () => {
    it("returns every struct field and drops unknown ones.", () => {
        const id = new ObjectId();
        const post = fromStorage(
            { ...validPost, _id: id, is_locked: true },
            POST,
        );
        const response = toResponse(post!) as Record<string, unknown>;
        expect(response._id).toEqual({ $oid: id.toHexString() });
        expect(response).not.toHaveProperty("is_locked");
        expect(response.tags).toBeNull();
        expect(response.image).toBeNull();
    });

    it("rejects documents the Rust driver cannot read.", () => {
        expect(fromStorage(null, POST)).toBeNull();
        expect(fromStorage({ ...validPost, body: undefined }, POST)).toBeNull();
        expect(fromStorage({ ...validPost, active: "yes" }, POST)).toBeNull();
        expect(
            fromStorage({ ...validPost, date_created: "bad" }, POST),
        ).toBeNull();
    });

    it("reformats stored date strings and tolerates BSON dates.", () => {
        const stored = fromStorage(
            { ...validPost, date_created: "2024-01-01T10:00:00.500+10:00" },
            POST,
        );
        expect(stored!.date_created).toBe("2024-01-01T00:00:00.500Z");
        const legacy = fromStorage(
            { ...validPost, date_created: new Date("2024-01-01T00:00:00Z") },
            POST,
        );
        expect(legacy!.date_created).toBe("2024-01-01T00:00:00Z");
    });
});
