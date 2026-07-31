import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PostDetailsPanel from "@/page/BlogPage/BlogContent/PostDetailsPanel/PostDetailsPanel";

vi.mock("next/link", () => ({
    default: ({ href, children, ...props }: any) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));
vi.mock("@/page/BlogPage/BlogContent/AuthorDetails/AuthorDetails", () => ({
    default: ({ content }: any) => <div>Author:{content.author}</div>,
}));
vi.mock("@/components/TagCloud/TagCloud", () => ({
    default: ({ tags }: any) => <div>Tags:{tags.join(",")}</div>,
}));
vi.mock(
    "@/page/BlogPage/BlogContent/BuyMeACoffeeButton/BuyMeACoffeeButton",
    () => ({ default: () => <button type="button">Coffee</button> }),
);
vi.mock("@/components/Utility/MouseUtility", () => ({
    cardGradientEffect: vi.fn(),
}));

const post = (id: string, heading = "Post") => ({
    _id: { $oid: id },
    heading,
    author: "Lu",
    body: "Body",
    date_created: "2026-01-01",
    image: { $oid: "image" },
    tags: ["react", "test"],
});

describe("PostDetailsPanel", () => {
    it("renders nothing when content is missing.", () => {
        const { container } = render(<PostDetailsPanel />);
        expect(container).toBeEmptyDOMElement();
    });

    it("renders author, related post links, tags, and coffee action.", () => {
        render(
            <PostDetailsPanel
                content={post("main") as any}
                relatedPosts={[post("rel", "Related") as any]}
            />,
        );
        expect(screen.getByText("Author")).toBeInTheDocument();
        expect(screen.getByText("Author:Lu")).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /Related/ })).toHaveAttribute(
            "href",
            "/digital-chronicles/blog/rel",
        );
        expect(screen.getByText("Tags:react,test")).toBeInTheDocument();
        expect(screen.getByText("Coffee")).toBeInTheDocument();
    });
});
