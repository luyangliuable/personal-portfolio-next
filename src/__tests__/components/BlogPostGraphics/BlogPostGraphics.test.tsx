import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BlogPostGraphics from "@/components/BlogPostGraphics/BlogPostGraphics";

describe("BlogPostGraphics", () => {
    it("renders the decorative paper markup.", () => {
        const { container } = render(<BlogPostGraphics />);
        expect(container.querySelector(".blog-graphics")).toBeInTheDocument();
        expect(
            container.querySelector(".blog-graphics__paper"),
        ).toBeInTheDocument();
        expect(container.querySelector(".paper.-two")).toBeInTheDocument();
        expect(container.querySelectorAll(".line").length).toBeGreaterThan(0);
    });
});