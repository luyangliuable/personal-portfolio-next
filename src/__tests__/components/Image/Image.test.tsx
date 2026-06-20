import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Image from "@/components/Image/Image";
import { API_BASE_URL } from "@/config/api";

vi.mock("next/image", () => ({
    default: ({ src, alt, className }: any) => (
        <img src={src} alt={alt} className={className} />
    ),
}));

describe("Image", () => {
    beforeEach(() => {
        vi.stubGlobal(
            "IntersectionObserver",
            vi.fn(() => ({ observe: vi.fn(), unobserve: vi.fn() })),
        );
    });

    it("shows a skeleton until a bare image id is resolved", async () => {
        render(
            <Image
                src="abc"
                alt="preview"
                isLazyLoading={false}
                compression={40}
            />,
        );
        expect(document.querySelector(".image-skeleton")).toBeInTheDocument();
        await waitFor(() =>
            expect(screen.getByAltText("preview")).toBeInTheDocument(),
        );
        expect(screen.getByAltText("preview")).toHaveAttribute(
            "src",
            `${API_BASE_URL}/image/abc?compression=40`,
        );
    });
});
