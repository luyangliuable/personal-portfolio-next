import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MusicPlayerItem from "@/components/MusicPlayer/MusicPlayerItem/MusicPlayerItem";
import { cardGradientEffect } from "@/components/Utility/MouseUtility";

vi.mock("@/components/Image/Image", () => ({
    default: ({ src, alt }: any) => <img src={src} alt={alt ?? ""} />,
}));
vi.mock("@/components/Utility/MouseUtility", () => ({
    cardGradientEffect: vi.fn(),
}));

describe("MusicPlayerItem", () => {
    it("renders supplied track metadata and image.", () => {
        render(
            <MusicPlayerItem
                imageSrc="/cover.png"
                imageSrcAlt="Cover"
                artistName="Artist"
                length="03:10"
                musicTitle="Song"
            />,
        );
        expect(screen.getByRole("heading", { name: "Song" }))
            .toBeInTheDocument();
        expect(screen.getByText("Artist")).toBeInTheDocument();
        expect(screen.getByText("03:10")).toBeInTheDocument();
        expect(screen.getByAltText("Cover")).toHaveAttribute("src", "/cover.png");
    });

    it("uses the fallback cover and mouse gradient handler.", () => {
        const { container } = render(
            <MusicPlayerItem artistName="A" length="1" musicTitle="T" />,
        );
        fireEvent.mouseMove(container.querySelector(".music-player--item")!);
        expect(cardGradientEffect).toHaveBeenCalled();
        expect(container.querySelector("img")!.getAttribute("src"))
            .toContain("abc-cdn.net.au");
    });
});
