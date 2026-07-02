import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TagCloud from "@/components/TagCloud/TagCloud";

describe("TagCloud", () => {
    it("renders each tag prefixed with a hash.", () => {
        render(<TagCloud tags={["react", "testing"]} />);
        expect(screen.getByText("#react")).toBeInTheDocument();
        expect(screen.getByText("#testing")).toBeInTheDocument();
    });

    it("renders an empty container when tags are absent.", () => {
        const { container } = render(<TagCloud tags={undefined as any} />);
        expect(container.querySelector("aside")).toHaveClass("card-item__tags");
        expect(container.querySelectorAll("span")).toHaveLength(0);
    });
});
