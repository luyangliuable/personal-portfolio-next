import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const posts = [
    {
        _id: { $oid: "old" },
        date_created: "2023-01-01",
        is_featured: true,
        tags: ["a"],
    },
    {
        _id: { $oid: "new" },
        date_created: "2024-01-01",
        is_featured: false,
        tags: ["a", "b"],
    },
    {
        _id: { $oid: "mid" },
        date_created: "2023-06-01",
        is_featured: true,
        tags: ["b"],
    },
] as any[];

const load = async () => {
    vi.resetModules();
    const mod = await import("@/repositories/NoteRepository");
    return mod.default;
};

describe("NoteRepository coverage", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.stubGlobal("fetch", vi.fn());
    });

    afterEach(() => vi.unstubAllGlobals());

    it("sorts by date and aggregates featured and related posts.", async () => {
        const NoteRepository = await load();
        const repo = NoteRepository.getInstance();
        expect(NoteRepository.getInstance()).toBe(repo);

        expect(
            repo.sortPostsByDate(posts, "asc").map((post: any) => post._id.$oid),
        ).toEqual(["old", "mid", "new"]);
        expect(
            repo.sortPostsByDate(posts).map((post: any) => post._id.$oid),
        ).toEqual(["new", "mid", "old"]);

        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => posts,
        } as Response);
        await expect(repo.getFeaturedPostList()).resolves.toEqual([
            posts[2],
            posts[0],
        ]);
        await expect(
            repo.getRelatedPosts(["a", "b"], "new", 2),
        ).resolves.toEqual([posts[2], posts[0]]);
    });

    it("returns an empty related list when retrieval fails.", async () => {
        const NoteRepository = await load();
        const repo = NoteRepository.getInstance();
        vi.spyOn(repo, "getPostList").mockRejectedValueOnce(
            new Error("failed"),
        );
        vi.spyOn(console, "error").mockImplementation(() => {});
        await expect(repo.getRelatedPosts(["a"], "old")).resolves.toEqual([]);
    });

    it("caches the post list and falls back to an empty list on errors.", async () => {
        const NoteRepository = await load();
        const repo = NoteRepository.getInstance();
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => posts,
        } as Response);
        await repo.getPostList();
        await repo.getPostList();
        expect(fetch).toHaveBeenCalledTimes(1);

        const reloaded = await load();
        const repo2 = reloaded.getInstance();
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(fetch).mockRejectedValueOnce(new Error("down"));
        await expect(repo2.getPostList()).resolves.toEqual([]);
    });

    it("fetches a single note and swallows errors.", async () => {
        const NoteRepository = await load();
        const repo = NoteRepository.getInstance();
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => posts[0],
        } as Response);
        await expect(repo.getPost("abc")).resolves.toEqual(posts[0]);

        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(fetch).mockRejectedValueOnce(new Error("missing"));
        await expect(repo.getPost("missing")).resolves.toBeUndefined();
    });
});