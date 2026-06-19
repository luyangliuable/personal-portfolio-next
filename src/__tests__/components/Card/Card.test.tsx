import React from "react";
const h = React.createElement;
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Card from "@/components/Card/Card";

const addToQueue = vi.fn();
vi.mock("@/stores/DynamicLoadQueue/DynamicLoadQueue", () => ({
    default: { getInstance: () => ({ addToQueue }) },
}));
vi.mock("@/components/Image/Image", () => ({
    default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));
vi.mock("@/components/TagCloud/TagCloud", () => ({
    default: ({ tags }: any) => <div>{tags?.join(",")}</div>,
}));
vi.mock("@/components/Utility/MouseUtility", () => ({
    cardGradientEffect: vi.fn(),
}));

describe("Card", () => {
    const baseProps = {
        link: "/post",
        image: "/image.png",
        authorImage: "/author.png",
        author: "Author",
        heading: "Heading",
        minuteRead: 5,
        tags: ["ts"],
        date_created: "2024-01-02T00:00:00Z",
    };

    it("renders article metadata and queues the card for dynamic loading when required props exist.", () => {
        render(<Card {...baseProps} />);
        expect(screen.getByText("Heading")).toBeInTheDocument();
        expect(screen.getByText(/5 min read/)).toBeInTheDocument();
        expect(addToQueue).toHaveBeenCalledTimes(1);
    });

    it("returns no card when required navigation or image props are missing.", () => {
        const { container } = render(<Card {...baseProps} image={undefined} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("extracts only internal llcode.tech paths from absolute URLs.", () => {
        const instance = new Card(baseProps as any);
        expect(instance.extractRouteFromURL("https://llcode.tech/blog/a")).toBe(
            "/blog/a",
        );
        expect(
            instance.extractRouteFromURL("https://example.com/blog/a"),
        ).toBeNull();
    });
});
