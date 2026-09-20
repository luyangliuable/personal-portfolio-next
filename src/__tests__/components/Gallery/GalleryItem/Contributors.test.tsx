import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { listContributors, createPortalMock } = vi.hoisted(() => ({
    listContributors: vi.fn(),
    createPortalMock: vi.fn(),
}));
vi.mock("@octokit/rest", () => ({
    Octokit: vi.fn(function (this: any) {
        return { repos: { listContributors } };
    }),
}));
vi.mock("react-dom", async (importOriginal) => {
    const actual: any = await importOriginal();
    return {
        ...actual,
        createPortal: (children: any, container: any) =>
            createPortalMock(children, container),
    };
});
vi.mock("@/components/Image/Image", () => ({
    default: ({ src, alt }: any) => <img src={src} alt={alt} />,
}));

import Contributors from "@/components/Gallery/GalleryItem/Contributors/Contributors";

describe("Contributors", () => {
    beforeEach(() => {
        listContributors.mockReset();
        createPortalMock.mockReset();
        createPortalMock.mockImplementation((children: any) => children);
    });

    it("renders fetched contributors and appends the repository owner.", async () => {
        listContributors.mockResolvedValueOnce({
            data: [
                {
                    login: "alice",
                    avatar_url: "a",
                    html_url: "pa",
                    contributions: 3,
                },
            ],
        });
        render(<Contributors repoName="repo" repoOwner="owner" />);
        expect(await screen.findByAltText("alice")).toBeInTheDocument();
        expect(await screen.findByAltText("luyangliuable")).toBeInTheDocument();
    });

    it("does not duplicate the owner when already returned by the api.", async () => {
        listContributors.mockResolvedValueOnce({
            data: [
                {
                    login: "luyangliuable",
                    avatar_url: "a",
                    html_url: "pa",
                    contributions: 5,
                },
            ],
        });
        render(<Contributors repoName="repo" repoOwner="owner" />);
        expect(await screen.findByAltText("luyangliuable")).toBeInTheDocument();
        expect(screen.getAllByAltText("luyangliuable")).toHaveLength(1);
    });

    it("swallows api failures and still renders the owner.", async () => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {});
        listContributors.mockRejectedValueOnce(new Error("nope"));
        render(<Contributors repoName="repo" repoOwner="owner" />);
        expect(await screen.findByAltText("luyangliuable")).toBeInTheDocument();
        expect(error).toHaveBeenCalled();
    });

    it("updates the portal tooltip on hover interactions.", async () => {
        listContributors.mockResolvedValueOnce({
            data: [
                {
                    login: "alice",
                    avatar_url: "a",
                    html_url: "pa",
                    contributions: 3,
                },
            ],
        });
        render(<Contributors repoName="repo" repoOwner="owner" />);
        const anchor = (await screen.findByAltText("alice")).closest("a")!;

        fireEvent.click(anchor);
        fireEvent.mouseOver(anchor);
        fireEvent.mouseMove(anchor, { pageX: 10, pageY: 20 });
        fireEvent.mouseOut(anchor);

        const tooltip = document.querySelector(
            ".contributor--tooltip",
        ) as HTMLElement;
        expect(tooltip).toBeInTheDocument();
        expect(tooltip.textContent).toBe("alice");
        expect(tooltip.style.opacity).toBe("0");
        expect(tooltip.style.left).toMatch(/px$/);
        expect(tooltip.style.top).toMatch(/px$/);
    });

    it("ignores tooltip updates when the portal is unavailable.", async () => {
        createPortalMock.mockReturnValue(null);
        listContributors.mockResolvedValueOnce({
            data: [
                {
                    login: "alice",
                    avatar_url: "a",
                    html_url: "pa",
                    contributions: 3,
                },
            ],
        });
        render(<Contributors repoName="repo" repoOwner="owner" />);
        const anchor = (await screen.findByAltText("alice")).closest("a")!;

        fireEvent.mouseOver(anchor);
        fireEvent.mouseMove(anchor, { pageX: 1, pageY: 1 });
        fireEvent.mouseOut(anchor);

        expect(document.querySelector(".contributor--tooltip")).toBeNull();
    });
});