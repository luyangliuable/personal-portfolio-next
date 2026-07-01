import React from "react";
const h = React.createElement;
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Image from "@/components/Image/Image";
import { API_BASE_URL } from "@/config/api";
import ImageRepository from "@/repositories/ImageRepository";

vi.mock("next/image", () => {
    const MockNextImage = React.forwardRef<HTMLImageElement, any>(
        (props, ref) => h("img", { ...props, ref }),
    );
    MockNextImage.displayName = "MockNextImage";
    return { default: MockNextImage };
});
vi.mock("@/components/Image/SkeletonImage/SkeletonImage", async () => {
    const React = await import("react");
    const MockSkeletonImage = React.forwardRef<HTMLDivElement>((_, ref) =>
        h("div", { ref, role: "status", "aria-label": "loading image" }),
    );
    MockSkeletonImage.displayName = "MockSkeletonImage";
    return { default: MockSkeletonImage };
});

const observerInstances: MockIntersectionObserver[] = [];

class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();

    constructor(
        public callback: (entries: IntersectionObserverEntry[]) => void,
    ) {
        observerInstances.push(this);
    }
}

describe("Image", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        observerInstances.length = 0;
        vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    });

    it("resolves a bare image id to an API URL when eager loading is requested.", async () => {
        render(
            h(Image, {
                src: "abc",
                alt: "preview",
                isLazyLoading: false,
                compression: 40,
            }),
        );
        await waitFor(() =>
            expect(screen.getByAltText("preview")).toHaveAttribute(
                "src",
                `${API_BASE_URL}/image/abc?compression=40`,
            ),
        );
    });

    it("keeps the loading placeholder when a lazy image has not entered the viewport.", () => {
        render(h(Image, { src: "abc", alt: "preview" }));
        expect(
            screen.getByRole("status", { name: "loading image" }),
        ).toBeInTheDocument();
        expect(screen.queryByAltText("preview")).not.toBeInTheDocument();
    });

    it("loads a lazy image after the placeholder enters the viewport.", async () => {
        render(h(Image, { src: "abc", alt: "preview", compression: 60 }));
        const placeholder = screen.getByRole("status", {
            name: "loading image",
        });

        act(() => {
            observerInstances[0].callback([
                {
                    isIntersecting: true,
                    target: placeholder,
                } as unknown as IntersectionObserverEntry,
            ]);
        });

        await waitFor(() =>
            expect(screen.getByAltText("preview")).toHaveAttribute(
                "src",
                `${API_BASE_URL}/image/abc?compression=60`,
            ),
        );
    });

    it("keeps skeleton styling until the image load event fires.", async () => {
        render(h(Image, { src: "abc", alt: "preview" }));
        const placeholder = screen.getByRole("status", {
            name: "loading image",
        });

        act(() => {
            observerInstances[0].callback([
                {
                    isIntersecting: true,
                    target: placeholder,
                } as unknown as IntersectionObserverEntry,
            ]);
        });

        const image = await screen.findByAltText("preview");
        expect(image).toHaveClass("image-skeleton");
        expect(image).toHaveClass("animation");
        fireEvent.load(image);
        await waitFor(() => expect(image).not.toHaveClass("image-skeleton"));
        expect(image).not.toHaveClass("animation");
    });

    it("uses the default image id and empty alt text when no image data is provided.", async () => {
        render(h(Image, { isLazyLoading: false }));
        await waitFor(() =>
            expect(document.querySelector("img")).toHaveAttribute(
                "src",
                `${API_BASE_URL}/image/651942aaf9b642fb30be59ae?compression=100`,
            ),
        );
    });

    it("keeps the placeholder visible when image URL resolution fails.", async () => {
        const error = new Error("bad image id");
        vi.spyOn(console, "error").mockImplementation(() => {});
        vi.spyOn(
            ImageRepository.getInstance(),
            "getImageUrl",
        ).mockImplementation(() => {
            throw error;
        });
        render(
            h(Image, {
                src: "broken",
                alt: "Broken image",
                isLazyLoading: false,
            }),
        );
        await waitFor(() =>
            expect(console.error).toHaveBeenCalledWith(
                "Error fetching images:",
                error,
            ),
        );
        expect(
            screen.getByRole("status", { name: "loading image" }),
        ).toBeInTheDocument();
    });
});
