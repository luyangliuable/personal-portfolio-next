import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BlogContent from "@/page/BlogPage/BlogContent/BlogContent";

const { getRelatedPosts } = vi.hoisted(() => ({ getRelatedPosts: vi.fn() }));
vi.mock("@/repositories/PostRepository", () => ({
    default: { getInstance: () => ({ getRelatedPosts }) },
}));
vi.mock("@/hooks", () => ({ useScrollPosition: () => ({ scrollY: 12 }) }));
vi.mock("@/components/Utility/ScrollUtility", () => ({
    getVisiblePercentage: () => 15,
}));
vi.mock("@/components/Image/Image", () => ({
    default: ({ src, className }: any) => (
        <img alt="hero" src={src} className={className} />
    ),
}));
vi.mock("@/page/BlogPage/BlogContent/AuthorDetails/AuthorDetails", () => ({
    default: ({ content }: any) => <p>Author {content.author}</p>,
}));
vi.mock(
    "@/page/BlogPage/BlogContent/MarkdownRendererV2/MarkdownRendererV2",
    () => ({ default: ({ markdown }: any) => <div>Markdown:{markdown}</div> }),
);
vi.mock("@/page/BlogPage/BlogContent/TableOfContents/TableOfContents", () => ({
    default: ({ headings = [] }: any) => (
        <nav>TOC:{headings.map((h: any) => h.title).join("|")}</nav>
    ),
}));
vi.mock(
    "@/page/BlogPage/BlogContent/PostDetailsPanel/PostDetailsPanel",
    () => ({
        default: ({ relatedPosts }: any) => (
            <aside>Related:{relatedPosts?.length ?? 0}</aside>
        ),
    }),
);

const content = {
    _id: { $oid: "post-id" },
    heading: "Main Post",
    author: "Lu",
    body: "# Root\n## First\n### Second\nBody",
    date_created: "2026-01-01",
    image: { $oid: "image-id" },
    tags: ["react"],
};

describe("BlogContent", () => {
    beforeEach(() => {
        getRelatedPosts.mockResolvedValue([
            { ...content, _id: { $oid: "rel" } },
        ]);
        document.documentElement.scrollTo = vi.fn();
    });

    it("renders post image, heading, author details, markdown body, and generated TOCs.", async () => {
        render(<BlogContent id="post-id" content={content as any} />);
        expect(document.documentElement.scrollTo).toHaveBeenCalledWith(0, 0);
        expect(screen.getByAltText("hero")).toHaveAttribute("src", "image-id");
        expect(
            screen.getByRole("heading", { name: "Main Post" }),
        ).toBeInTheDocument();
        await waitFor(() =>
            expect(screen.getAllByText("TOC:Root|First|Second")).toHaveLength(
                2,
            ),
        );
        expect(screen.getByText(/Markdown:/)).toHaveTextContent("## First");
    });

    it("fetches related posts when the related-posts option is enabled.", async () => {
        render(
            <BlogContent
                id="post-id"
                content={content as any}
                showRelatedPosts
            />,
        );
        await waitFor(() =>
            expect(getRelatedPosts).toHaveBeenCalledWith(
                ["react"],
                "post-id",
                3,
            ),
        );
        expect(await screen.findByText("Related:1")).toBeInTheDocument();
    });
});
