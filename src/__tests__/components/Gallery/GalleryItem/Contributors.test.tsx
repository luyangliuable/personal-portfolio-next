import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Contributors from "@/components/Gallery/GalleryItem/Contributors/Contributors";

const listContributors = vi.hoisted(() => vi.fn());

vi.mock("@octokit/rest", () => ({
    Octokit: vi.fn(function MockOctokit() {
        return { repos: { listContributors } };
    }),
}));
vi.mock("@/components/Image/Image", () => ({
    default: ({ src, alt, className }: any) => (
        <img src={src} alt={alt} className={className} />
    ),
}));

describe("Contributors", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("loads contributors, appends the owner fallback, and updates tooltip position.", async () => {
        listContributors.mockResolvedValue({
            data: [
                {
                    login: "guest",
                    avatar_url: "/guest.png",
                    html_url: "https://github.com/guest",
                    contributions: 3,
                },
            ],
        });
        render(<Contributors repoName="repo" repoOwner="owner" />);
        const guest = await screen.findByAltText("guest");
        const owner = await screen.findByAltText("luyangliuable");
        expect(guest.closest("a")).toHaveAttribute("href", "https://github.com/guest");
        expect(owner).toBeInTheDocument();
        fireEvent.mouseOver(guest.closest("a")!);
        fireEvent.mouseMove(guest.closest("a")!, { pageX: 10, pageY: 20 });
        expect(document.body.querySelector(".contributor--tooltip"))
            .toHaveTextContent("guest");
        fireEvent.mouseOut(guest.closest("a")!);
    });

    it("uses returned owner data and stops tooltip link clicks.", async () => {
        listContributors.mockResolvedValue({
            data: [{
                login: "luyangliuable",
                avatar_url: "/owner.png",
                html_url: "https://github.com/luyangliuable",
                contributions: 10,
            }],
        });
        render(<Contributors repoName="repo" repoOwner="owner" />);
        const owner = await screen.findByAltText("luyangliuable");
        const click = new MouseEvent("click", { bubbles: true });
        const stopPropagation = vi.spyOn(click, "stopPropagation");
        owner.closest("a")!.dispatchEvent(click);
        expect(stopPropagation).toHaveBeenCalled();
        expect(screen.getAllByAltText("luyangliuable")).toHaveLength(1);
    });

    it("falls back to the owner when the contributor request fails.", async () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        listContributors.mockRejectedValue(new Error("network"));
        render(<Contributors repoName="repo" repoOwner="owner" />);
        expect(await screen.findByAltText("luyangliuable")).toBeInTheDocument();
        expect(console.error).toHaveBeenCalled();
    });
});
