import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ObjectId } from "mongodb";
import { memoryCache } from "@/server/cache";
import { getPost } from "@/server/posts";
import { fakeStore } from "./fakeMongo";

vi.mock("@/server/db", async () => (await import("./fakeMongo")).fakeDb);

const post = {
    heading: "h",
    author: "a",
    post_type: "blog",
    year: 2024,
    month: 9,
    file_name: "f",
    body: "",
};

async function statusOf(promise: Promise<unknown>): Promise<number> {
    return promise.then(
        () => 200,
        (error) => error.status,
    );
}

function seedPost(overrides: Record<string, unknown> = {}): string {
    const _id = new ObjectId();
    fakeStore.set("Post", [{ _id, ...post, ...overrides }]);
    return _id.toHexString();
}

function markdownStore(): string {
    const root = mkdtempSync(join(tmpdir(), "posts-"));
    mkdirSync(join(root, "2024", "9"), { recursive: true });
    writeFileSync(join(root, "2024", "9", "f.md"), "# Post");
    vi.stubEnv("MARKDOWN_POSTS_STORE_LOCATION", root);
    return root;
}

beforeEach(() => {
    fakeStore.clear();
    memoryCache.clear();
});
afterEach(() => vi.unstubAllEnvs());

describe("post detail", () => {
    it("reads the body from {year}/{month}/{file_name}.md and caches it.", async () => {
        markdownStore();
        const id = seedPost();
        const first = (await getPost(id)) as { body: string };
        expect(first.body).toBe("# Post");

        fakeStore.clear();
        expect(await getPost(id)).toBe(first);
    });

    it("maps post lookup failures to the Rust status codes.", async () => {
        markdownStore();
        expect(await statusOf(getPost("bad"))).toBe(400);
        expect(await statusOf(getPost("0".repeat(24)))).toBe(500);
        expect(await statusOf(getPost(seedPost({ active: false })))).toBe(404);
        expect(await statusOf(getPost(seedPost({ file_name: "gone" })))).toBe(
            404,
        );
    });

    it("answers 404 when no markdown store is configured.", async () => {
        vi.stubEnv("MARKDOWN_POSTS_STORE_LOCATION", undefined);
        expect(await statusOf(getPost(seedPost()))).toBe(404);
    });
});
