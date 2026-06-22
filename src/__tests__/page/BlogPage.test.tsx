import React from "react";
const h = React.createElement;
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BlogPage from "@/page/BlogPage/BlogPage";

vi.mock("react-icons/fa", () => ({ FaWindowClose: () => h("span") }));
vi.mock("@/components/HeroHeader/HeroHeader", () => ({
    default: ({ children }: any) => h("div", null, children),
}));
vi.mock("@/components/BlogPostGraphics/BlogPostGraphics", () => ({
    default: () => h("div"),
}));
vi.mock("@/components/Atoms/SmallCard/SmallCard", () => ({
    default: ({ authorImage, heading, link }: any) =>
        h(
            "aside",
            { "data-testid": "top-pick", "data-link": link },
            h("h3", null, heading),
            h("span", null, authorImage),
        ),
}));
vi.mock("@/components/Atoms/Toggle/Toggle", () => ({
    default: () => h("button", null, "toggle"),
}));
vi.mock("@/page/SkeletonPage/SkeletonPage", () => ({
    default: () => h("div", null, "Loading"),
}));
vi.mock("@/components/TextInputCard/TextInputWithCard", () => ({
    default: () => h("div"),
}));
vi.mock("@/components/BlogYear/BlogYear", () => ({
    default: ({ year }: any) => h("h2", null, year),
}));
vi.mock("@/components/Card/Card", () => ({
    default: ({ authorImage, heading, link, tags }: any) =>
        h(
            "article",
            { "data-testid": "blog-card", "data-link": link },
            h("h3", null, heading),
            h("span", null, authorImage),
            h("span", null, tags.join(",")),
        ),
}));

describe("BlogPage", () => {
    beforeEach(() => {
        globalThis.history.replaceState({}, "", "/digital-chronicles/blog");
        Object.defineProperty(document.documentElement, "scrollTo", {
            value: vi.fn(),
            configurable: true,
        });
    });

    const createPost = (overrides: Record<string, unknown> = {}) => ({
        _id: { $oid: "post-id" },
        heading: "React Post",
        author: "Lu",
        body: "Body",
        date_created: "2026-06-20",
        date_last_modified: "2026-06-21",
        reading_time_minutes: 1,
        in_progress: false,
        tags: ["react"],
        is_featured: false,
        image: { $oid: "image-id" },
        ...overrides,
    });

    it("filters posts from the URL tag while preserving local author image data.", async () => {
        globalThis.history.replaceState(
            {},
            "",
            "/digital-chronicles/blog?tag=react",
        );
        render(
            h(BlogPage, {
                showTopPicks: false,
                data: [
                    createPost(),
                    createPost({
                        _id: { $oid: "hidden" },
                        heading: "Hidden Post",
                        tags: ["design"],
                    }),
                ] as any,
            }),
        );

        await waitFor(() =>
            expect(screen.getByText("React Post")).toBeInTheDocument(),
        );
        expect(screen.queryByText("Hidden Post")).not.toBeInTheDocument();
        expect(screen.getByTestId("blog-card")).toHaveAttribute(
            "data-link",
            "/digital-chronicles/blog/post-id",
        );
        expect(screen.getByTestId("blog-card")).toHaveTextContent(
            "65817ae96c73ceb16ba51731",
        );
    });
});
