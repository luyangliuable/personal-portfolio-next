import React, { createRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Image from "@/components/Image/Image";
import SkeletonImage from "@/components/Image/SkeletonImage/SkeletonImage";
import LoadingBar from "@/components/LoadingBar/LoadingBar";

const repo = vi.hoisted(() => ({ getImageUrl: vi.fn() }));
vi.mock("next/image", () => ({
    default: React.forwardRef<HTMLImageElement, any>(
        ({ src, alt, ...props }, ref) => (
            <img ref={ref} src={src} alt={alt} {...props} />
        ),
    ),
}));
vi.mock("@/repositories/ImageRepository", () => ({
    default: { getInstance: () => repo },
}));

beforeEach(() => {
    vi.clearAllMocks();
    globalThis.IntersectionObserver = vi.fn(function (this: any, cb: any) {
        this.observe = vi.fn((target) => cb([{ isIntersecting: true, target }]));
        this.unobserve = vi.fn();
    });
});

describe("Image", () => {
    it("fetches the image after it enters view and renders the resolved object URL.", async () => {
        repo.getImageUrl.mockReturnValue("blob:test-image");
        render(<Image src="image-id" compression={55} alt="Preview" />);
        await waitFor(() => expect(screen.getByAltText("Preview")).toHaveAttribute("src", "blob:test-image"));
        expect(repo.getImageUrl).toHaveBeenCalledWith("image-id", 55);
    });

    it("resolves an eager image without waiting for an intersection event.", async () => {
        repo.getImageUrl.mockReturnValue("/api/image/abc?compression=40");
        render(<Image src="abc" alt="preview" isLazyLoading={false} compression={40} />);
        await waitFor(() => expect(screen.getByAltText("preview")).toHaveAttribute("src", "/api/image/abc?compression=40"));
    });

    it("keeps the loading placeholder when a lazy image has not entered the viewport.", () => {
        globalThis.IntersectionObserver = vi.fn(function (this: any) {
            this.observe = vi.fn();
            this.unobserve = vi.fn();
        });
        const { container } = render(<Image src="abc" alt="preview" />);
        expect(container.querySelector(".image-skeleton")).toBeInTheDocument();
        expect(repo.getImageUrl).not.toHaveBeenCalled();
    });

    it("logs fetch failures and keeps the skeleton fallback visible when the repository rejects.", async () => {
        const error = new Error("network down");
        const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
        repo.getImageUrl.mockImplementation(() => {
            throw error;
        });
        const { container } = render(<Image src="broken-id" alt="Broken" />);
        await waitFor(() => expect(consoleError).toHaveBeenCalledWith("Error fetching images:", error));
        expect(container.querySelector(".image-skeleton")).toBeInTheDocument();
        expect(screen.queryByAltText("Broken")).not.toBeInTheDocument();
    });
});

describe("SkeletonImage and LoadingBar", () => {
    it("forwards the skeleton element ref used by image intersection observers.", () => {
        const ref = createRef<HTMLDivElement>();
        render(<SkeletonImage ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it("exposes an indeterminate progress indicator while content is loading.", () => {
        render(<LoadingBar />);
        expect(screen.getByRole("progressbar", { name: "Loading content" })).not.toHaveAttribute("aria-valuenow");
    });
});
