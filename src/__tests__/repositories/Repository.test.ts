import { beforeEach, describe, expect, it, vi } from "vitest";
import BlogRepository from "../../repositories/BlogRepository";
import ConfigRepository from "../../repositories/ConfigRepo";
import ImageRepository from "../../repositories/ImageRepository";
import NoteRepository from "../../repositories/NoteRepository";
import PostRepository from "../../repositories/PostRepository";
import Repository from "../../repositories/Repository";
import UserRepository from "../../repositories/UserRepository";

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

describe("repositories", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.stubGlobal("fetch", vi.fn());
    });

    it("builds base repository request options without mutating the body", () => {
        const body = { value: 1 };
        expect(Repository.options("POST", body)).toEqual({
            method: "POST",
            cache: "no-cache",
            credentials: "same-origin",
            body,
        });
    });

    it("fetches blog lists and returns undefined when the request fails", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => ["blog"],
        } as Response);
        await expect(BlogRepository.getBlogList()).resolves.toEqual(["blog"]);

        const error = new Error("network");
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(fetch).mockRejectedValueOnce(error);
        await expect(BlogRepository.getBlog("1")).resolves.toBeUndefined();
        expect(console.error).toHaveBeenCalledWith("Error:", error);
    });

    it("returns config text for successful responses and an empty string for failures", async () => {
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            text: async () => "enabled",
        } as Response);
        await expect(
            ConfigRepository.getInstance().get("feature"),
        ).resolves.toBe("enabled");

        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 500,
        } as Response);
        await expect(
            ConfigRepository.getInstance().get("feature"),
        ).resolves.toBe("");
    });

    it("sorts, filters and ranks posts by dates and shared tags", async () => {
        const repo = PostRepository.getInstance();
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => posts,
        } as Response);

        expect(
            repo
                .sortPostsByDate(posts as any, "asc")
                .map((post) => post._id.$oid),
        ).toEqual(["old", "mid", "new"]);
        await expect(repo.getFeaturedPostList()).resolves.toEqual([
            posts[2],
            posts[0],
        ]);
        await expect(
            repo.getRelatedPosts(["a", "b"], "new", 2),
        ).resolves.toEqual([posts[2], posts[0]]);
    });

    it("returns an empty related post list when post retrieval fails", async () => {
        const repo = NoteRepository.getInstance();
        vi.spyOn(repo, "getPostList").mockRejectedValueOnce(
            new Error("failed"),
        );
        vi.spyOn(console, "error").mockImplementation(() => {});

        await expect(repo.getRelatedPosts(["tag"], "id")).resolves.toEqual([]);
    });

    it("caches image requests and removes failed image requests from the in-flight map", async () => {
        const blob = new Blob(["image"]);
        const createObjectURL = vi.fn(() => "blob:image");
        vi.stubGlobal("URL", { createObjectURL });
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: true,
            blob: async () => blob,
        } as Response);

        await expect(
            ImageRepository.getInstance().getImageById("abc", 50),
        ).resolves.toBe("blob:image");
        await expect(
            ImageRepository.getInstance().getImageById("abc", 50),
        ).resolves.toBe("blob:image");
        expect(fetch).toHaveBeenCalledTimes(1);

        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(fetch).mockResolvedValueOnce({
            ok: false,
            status: 404,
        } as Response);
        await expect(
            ImageRepository.getInstance().getImageById("missing"),
        ).rejects.toThrow("HTTP error! status: 404");
    });

    it("uses include credentials for user account requests and returns logout responses", async () => {
        expect(UserRepository.options("POST", { name: "lu" })).toMatchObject({
            credentials: "include",
        });
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => ({ name: "Lu" }),
        } as Response);
        await expect(UserRepository.getUserName()).resolves.toEqual({
            name: "Lu",
        });

        vi.mocked(fetch).mockResolvedValueOnce({ ok: true } as Response);
        await expect(UserRepository.logout()).resolves.toMatchObject({
            ok: true,
        });
    });

    it("surfaces user login and registration failures", async () => {
        vi.mocked(fetch).mockRejectedValueOnce(new Error("denied"));
        await expect(UserRepository.login({})).rejects.toThrow();

        vi.mocked(fetch).mockRejectedValueOnce(new Error("duplicate"));
        await expect(UserRepository.register({})).rejects.toThrow();

        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => ({ id: 1 }),
        } as Response);
        await expect(UserRepository.register({ name: "Lu" })).resolves.toEqual({
            id: 1,
        });
    });

    it("sorts and fetches notes using the same post repository behavior", async () => {
        const repo = NoteRepository.getInstance();
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => posts,
        } as Response);

        expect(
            repo.sortPostsByDate(posts as any).map((post) => post._id.$oid),
        ).toEqual(["new", "mid", "old"]);
        await expect(repo.getFeaturedPostList()).resolves.toEqual([
            posts[2],
            posts[0],
        ]);
        vi.mocked(fetch).mockResolvedValueOnce({
            json: async () => posts[0],
        } as Response);
        await expect(repo.getPost("abc")).resolves.toEqual(posts[0]);

        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.mocked(fetch).mockRejectedValueOnce(new Error("notes unavailable"));
        await expect(repo.getPostList()).resolves.toEqual([
            posts[1],
            posts[2],
            posts[0],
        ]);
        vi.mocked(fetch).mockRejectedValueOnce(new Error("note missing"));
        await expect(repo.getPost("missing")).resolves.toBeUndefined();

        vi.spyOn(repo, "getPostList").mockRejectedValueOnce(
            new Error("related failed"),
        );
        await expect(repo.getRelatedPosts(["a"], "old")).resolves.toEqual([]);
    });
});
