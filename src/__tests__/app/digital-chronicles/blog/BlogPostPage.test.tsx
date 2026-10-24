import { beforeEach, describe, expect, it, vi } from "vitest";
import BlogPostPage, {
    generateMetadata,
} from "@/app/digital-chronicles/blog/[id]/page";
import { apiImageUrl } from "@/config/api";

const { getPost } = vi.hoisted(() => ({ getPost: vi.fn() }));
vi.mock("@/repositories/PostRepository", () => ({
    default: { getInstance: () => ({ getPost }) },
}));
vi.mock("@/page/BlogPage/BlogContent/BlogContent", () => ({
    default: () => null,
}));
vi.mock("next/navigation", () => ({
    notFound: () => {
        throw new Error("NEXT_NOT_FOUND");
    },
}));

const post = {
    _id: { $oid: "post-id" },
    heading: "Recovered Post",
    author: "Lu",
    body: "# Recovered Post\nBody text",
};

describe("blog post page metadata", () => {
    beforeEach(() => getPost.mockReset());

    it("uses the cover image for the open graph preview.", async () => {
        getPost.mockResolvedValue({ ...post, image: { $oid: "cover-id" } });

        const metadata = await generateMetadata({ params: { id: "post-id" } });

        expect(metadata.title).toBe("Blog | Recovered Post");
        expect(metadata.openGraph?.images).toEqual([apiImageUrl("cover-id")]);
    });

    it("omits the preview image when the post has no cover.", async () => {
        getPost.mockResolvedValue({ ...post, image: null });

        const metadata = await generateMetadata({ params: { id: "post-id" } });

        expect(metadata.openGraph?.images).toEqual([]);
    });

    it("renders the not found page when the post cannot be loaded.", async () => {
        getPost.mockResolvedValue(undefined);
        const props = { params: { id: "missing-id" } };

        await expect(generateMetadata(props)).rejects.toThrow("NEXT_NOT_FOUND");
        await expect(BlogPostPage(props)).rejects.toThrow("NEXT_NOT_FOUND");
    });
});
