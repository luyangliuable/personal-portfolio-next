import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Image from "@/components/Image/Image";
import { API_BASE_URL } from "@/config/api";

vi.mock("next/image", async () => {
    const React = await import("react");
    const MockNextImage = React.forwardRef<HTMLImageElement, any>(
        ({ src, alt, unoptimized }, ref) => (
            <img
                ref={ref}
                src={src}
                alt={alt}
                data-unoptimized={unoptimized ? "true" : "false"}
            />
        ),
    );
    MockNextImage.displayName = "MockNextImage";
    return { default: MockNextImage };
});

vi.mock("@/components/Image/SkeletonImage/SkeletonImage", async () => {
    const React = await import("react");
    const MockSkeletonImage = React.forwardRef<HTMLDivElement>(() => (
        <div role="status" aria-label="loading image" />
    ));
    MockSkeletonImage.displayName = "MockSkeletonImage";
    return { default: MockSkeletonImage };
});

class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();

    constructor() {}
}

describe("Image", () => {
    beforeEach(() => {
        vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    });

    it("resolves a bare image id to an API URL when eager loading is requested.", async () => {
        render(
            <Image
                src="abc"
                alt="preview"
                isLazyLoading={false}
                compression={40}
            />,
        );

        await waitFor(() =>
            expect(screen.getByAltText("preview")).toHaveAttribute(
                "src",
                `${API_BASE_URL}/image/abc?compression=40`,
            ),
        );
        expect(screen.getByAltText("preview")).toHaveAttribute(
            "data-unoptimized",
            "true",
        );
    });

    it("keeps the loading placeholder when a lazy image has not entered the viewport.", () => {
        render(<Image src="abc" alt="preview" />);

        expect(
            screen.getByRole("status", { name: "loading image" }),
        ).toBeInTheDocument();
        expect(screen.queryByAltText("preview")).not.toBeInTheDocument();
    });
});
