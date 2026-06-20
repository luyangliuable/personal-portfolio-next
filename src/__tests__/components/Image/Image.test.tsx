import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Image from "@/components/Image/Image";
import { API_BASE_URL } from "@/config/api";

vi.mock("next/image", () => ({
    default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

vi.mock("@/components/Image/SkeletonImage/SkeletonImage", async () => {
    const React = await import("react");
    return {
        default: React.forwardRef<HTMLDivElement>(() => (
            <div role="status" aria-label="loading image" />
        )),
    };
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
    });

    it("keeps the loading placeholder when a lazy image has not entered the viewport.", () => {
        render(<Image src="abc" alt="preview" />);

        expect(
            screen.getByRole("status", { name: "loading image" }),
        ).toBeInTheDocument();
        expect(screen.queryByAltText("preview")).not.toBeInTheDocument();
    });
});
