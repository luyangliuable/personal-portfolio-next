import React from "react";
const h = React.createElement;
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AuthorDetails from "@/page/BlogPage/BlogContent/AuthorDetails/AuthorDetails";

vi.mock("@/components/Image/Image", () => ({
    default: ({ src, alt }: any) =>
        h("img", { "data-testid": "author-image", src, alt }),
}));

describe("AuthorDetails", () => {
    it("renders author identity details with the local author image id.", () => {
        render(
            h(AuthorDetails, {
                content: { author: "Lu", date_created: "2026-06-20" } as any,
            }),
        );

        expect(screen.getByText("Lu")).toBeInTheDocument();
        expect(screen.getByText(/June 2026/)).toBeInTheDocument();
        expect(screen.getByTestId("author-image")).toHaveAttribute(
            "src",
            "65817ae96c73ceb16ba51731",
        );
    });

    it("does not render author markup when content has not loaded.", () => {
        const { container } = render(h(AuthorDetails));

        expect(container).toBeEmptyDOMElement();
    });
});
