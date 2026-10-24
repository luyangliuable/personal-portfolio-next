import { beforeEach, describe, expect, it, vi } from "vitest";
import { ObjectId } from "mongodb";
import { getPosts, insertPost, updatePost } from "@/server/posts";
import { parseCompression } from "@/server/image";
import { isBcryptHash } from "@/server/user";
import { readJsonBody, readOptionalJson } from "@/server/route";
import { fakeStore } from "./fakeMongo";

vi.mock("@/server/db", async () => (await import("./fakeMongo")).fakeDb);

const post = {
    heading: "h",
    author: "a",
    post_type: "blog",
    year: 2024,
    month: 1,
    file_name: "f",
    body: "",
};

beforeEach(() => fakeStore.clear());

describe("post service", () => {
    it("stores string dates and returns camelCase envelopes.", async () => {
        const result = (await insertPost({ ...post, tags: ["t"] })) as Record<
            string,
            unknown
        >;
        const stored = fakeStore.get("Post")![0];
        expect(result).toEqual({
            insertedId: { $oid: (stored._id as ObjectId).toHexString() },
        });
        expect(stored.date_created).toMatch(/^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/);
        expect(stored.description).toBeNull();
    });

    it("lists only active, decodable posts.", async () => {
        fakeStore.set("Post", [
            { _id: new ObjectId(), ...post, heading: "kept" },
            { _id: new ObjectId(), ...post, active: false },
            { _id: new ObjectId(), ...post, year: "2024" },
        ]);
        const posts = (await getPosts()) as Record<string, unknown>[];
        expect(posts.map((entry) => entry.heading)).toEqual(["kept"]);
        expect(posts[0].tags).toBeNull();
    });

    it("sets the whole struct on update.", async () => {
        const _id = new ObjectId();
        fakeStore.set("Post", [{ _id, ...post, description: "old" }]);
        const result = await updatePost(_id.toHexString(), post);
        expect(result).toEqual({
            matchedCount: 1,
            modifiedCount: 1,
            upsertedId: null,
        });
        expect(fakeStore.get("Post")![0].description).toBeNull();
    });
});

function jsonRequest(body: string): Request {
    return new Request("http://localhost/api/x", { method: "POST", body });
}

async function statusOf(promise: Promise<unknown>): Promise<number> {
    return promise.then(
        () => 200,
        (error) => error.status,
    );
}

describe("request helpers", () => {
    it("mirrors Rocket's Json guard errors.", async () => {
        expect(await readJsonBody(jsonRequest('{"a":1}'))).toEqual({ a: 1 });
        expect(await statusOf(readJsonBody(jsonRequest("{")))).toBe(400);
        expect(await statusOf(readJsonBody(jsonRequest("")))).toBe(400);
        const large = `"${"x".repeat(1024 * 1024)}"`;
        expect(await statusOf(readJsonBody(jsonRequest(large)))).toBe(413);
        expect(await readOptionalJson(jsonRequest("nope"))).toBeNull();
        expect(await readOptionalJson(jsonRequest("[]"))).toEqual({
            value: [],
        });
    });

    it("parses compression like an Option<u8> query field.", () => {
        expect(parseCompression(null)).toBe(100);
        expect(parseCompression("50")).toBe(50);
        expect(parseCompression("+7")).toBe(7);
        expect(parseCompression("255")).toBe(255);
        expect(parseCompression("256")).toBe(100);
        expect(parseCompression("-1")).toBe(100);
        expect(parseCompression("abc")).toBe(100);
    });

    it("recognises bcrypt hashes the Rust crate accepts.", () => {
        expect(isBcryptHash(`$2b$12$${"a".repeat(53)}`)).toBe(true);
        expect(isBcryptHash("plain")).toBe(false);
        expect(isBcryptHash(null)).toBe(false);
    });
});
