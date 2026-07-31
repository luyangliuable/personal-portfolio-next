import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MusicPlayer from "@/components/MusicPlayer/MusicPlayer";

vi.mock("@/components/MusicPlayer/MusicPlayerItem/MusicPlayerItem", () => ({
    default: ({ musicTitle }: any) => <div>{musicTitle}</div>,
}));

describe("MusicPlayer", () => {
    it("portals the player, default tracks, and custom children to body.", () => {
        render(
            <MusicPlayer>
                <span>Custom track</span>
            </MusicPlayer>,
        );
        expect(document.body.querySelector(".music-player"))
            .toBeInTheDocument();
        expect(document.body.querySelector(".music-player--play"))
            .toBeInTheDocument();
        expect(screen.getAllByText("Test Music")).toHaveLength(6);
        expect(screen.getByText("Custom track")).toBeInTheDocument();
    });
});
