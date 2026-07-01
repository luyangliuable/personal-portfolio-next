import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BlogNote from "@/page/BlogPage/BlogContent/BlogNote/BlogNote";
import BlogWarning from "@/page/BlogPage/BlogContent/BlogWarning/BlogWarning";
import BuyMeACoffeeButton from "@/page/BlogPage/BlogContent/BuyMeACoffeeButton/BuyMeACoffeeButton";
import SkeletonBlogContent from "@/page/BlogPage/BlogContent/SkeletonBlogContent/SkeletonBlogContent";

vi.mock("react-icons/io", () => ({
    IoIosInformationCircle: () => <span data-testid="info" />,
}));
vi.mock("react-icons/io5", () => ({
    IoWarning: () => <span data-testid="warning" />,
}));
vi.mock("next/link", () => ({
    default: ({ href, children, ...props }: any) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

describe("blog callouts and utility content", () => {
    it("renders note and warning messages with their icons.", () => {
        render(
            <>
                <BlogNote>Remember this</BlogNote>
                <BlogWarning>Careful</BlogWarning>
            </>,
        );
        expect(screen.getByText("Remember this")).toHaveClass("blog-note");
        expect(screen.getByText("Careful")).toHaveClass("blog-warning");
        expect(screen.getByTestId("info")).toBeInTheDocument();
        expect(screen.getByTestId("warning")).toBeInTheDocument();
    });

    it("renders an external Ko-fi link with accessible image text.", () => {
        render(<BuyMeACoffeeButton />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "https://ko-fi.com/D1D1PFTTH");
        expect(link).toHaveAttribute("target", "_blank");
        expect(
            screen.getByAltText("Buy Me a Coffee at ko-fi.com"),
        ).toBeInTheDocument();
    });

    it("renders skeleton lines and image placeholder blocks.", () => {
        const { container } = render(<SkeletonBlogContent />);
        expect(
            container.querySelectorAll(".skeleton-blog-content__line"),
        ).toHaveLength(7);
        expect(
            container.querySelectorAll(".skeleton-blog-content__square"),
        ).toHaveLength(1);
    });
});
