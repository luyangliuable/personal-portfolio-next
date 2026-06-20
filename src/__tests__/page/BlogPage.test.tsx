import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BlogPage from "@/page/BlogPage/BlogPage";

vi.mock("react-icons/fa", () => ({ FaWindowClose: () => <span /> }));
vi.mock("@/components/HeroHeader/HeroHeader", () => ({
    default: ({ children }: any) => <div>{children}</div>,
}));
vi.mock("@/components/BlogPostGraphics/BlogPostGraphics", () => ({
    default: () => <div />,
}));
vi.mock("@/components/Atoms/SmallCard/SmallCard", () => ({
    default: ({ authorImage }: any) => <div>{authorImage}</div>,
}));
vi.mock("@/components/Atoms/Toggle/Toggle", () => ({
    default: () => <button>toggle</button>,
}));
vi.mock("@/page/SkeletonPage/SkeletonPage", () => ({
    default: () => <div>Loading</div>,
}));
vi.mock("@/components/TextInputCard/TextInputWithCard", () => ({
    default: () => <div />,
}));
vi.mock("@/components/BlogYear/BlogYear", () => ({
    default: ({ year }: any) => <h2>{year}</h2>,
}));
vi.mock("@/components/Card/Card", () => ({
    default: ({ authorImage }: any) => (
        <div data-testid="blog-card">{authorImage}</div>
    ),
}));

describe("BlogPage", () => {
    beforeEach(() => {
        Object.defineProperty(document.documentElement, "scrollTo", {
            value: vi.fn(),
            configurable: true,
        });
    });

    it("passes the default author image id to blog cards", async () => {
        render(
            <BlogPage
                showTopPicks={false}
                data={[
                    {
                        _id: { $oid: "1" },
                        heading: "Post",
                        author: "Lu",
                        body: "",
                        date_created: "2026-06-20",
                        date_last_modified: "2026-06-20",
                        reading_time_minutes: 1,
                        in_progress: false,
                        tags: ["local"],
                        is_featured: false,
                        image: { $oid: "image-id" },
                    } as any,
                ]}
            />,
        );
        await waitFor(() =>
            expect(screen.getByTestId("blog-card")).toBeInTheDocument(),
        );
        expect(screen.getByTestId("blog-card")).toHaveTextContent(
            "65817ae96c73ceb16ba51731",
        );
    });
});
