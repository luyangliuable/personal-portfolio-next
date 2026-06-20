import React from "react";
const h = React.createElement;
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Contributors, {
    buildContributors,
} from "@/components/Gallery/GalleryItem/Contributors/Contributors";

const { octokitList } = vi.hoisted(() => ({
    octokitList: vi.fn(),
}));

vi.mock("@octokit/rest", () => {
    class Octokit {
        repos = { listContributors: octokitList };
    }
    return { Octokit };
});

vi.mock("@/components/Image/Image", () => ({
    default: ({ src, alt, className }: any) => (
        <img src={src} alt={alt} className={className} />
    ),
}));

beforeEach(() => {
    vi.clearAllMocks();
});

describe("Contributors", () => {
    it("builds contributors and default fallback lists.", () => {
        expect(
            buildContributors([
                {
                    login: "dev",
                    avatar_url: "/dev.png",
                    html_url: "https://github.com/dev",
                    contributions: 2,
                },
            ]),
        ).toHaveLength(2);
        expect(
            buildContributors([
                {
                    login: "luyangliuable",
                    avatar_url: "a",
                    html_url: "p",
                    contributions: 1,
                },
            ]),
        ).toHaveLength(1);
        expect(buildContributors()).toHaveLength(1);
    });
    it("renders fetched contributors and tooltip interactions.", async () => {
        octokitList.mockResolvedValue({
            data: [
                {
                    login: "dev",
                    avatar_url: "/dev.png",
                    html_url: "https://github.com/dev",
                    contributions: 2,
                },
            ],
        });
        render(<Contributors repoOwner="owner" repoName="repo" />);
        const contributor = await screen.findByAltText("dev");
        const link = contributor.closest("a")!;
        expect(link).toHaveAttribute("href", "https://github.com/dev");
        fireEvent.mouseOver(link);
        expect(document.body).toHaveTextContent("dev");
        fireEvent.mouseMove(link, { pageX: 10, pageY: 20 });
        fireEvent.mouseOut(link);
    });

    it("adds the owner fallback and handles fetch failures.", async () => {
        octokitList.mockResolvedValue({ data: [] });
        const { unmount } = render(
            <Contributors repoOwner="owner" repoName="repo" />,
        );
        expect(await screen.findByAltText("luyangliuable")).toBeInTheDocument();
        unmount();
        vi.spyOn(console, "error").mockImplementation(() => undefined);
        octokitList.mockRejectedValue(new Error("boom"));
        render(<Contributors repoOwner="owner" repoName="repo" />);
        expect(await screen.findByAltText("luyangliuable")).toBeInTheDocument();
        await waitFor(() => expect(console.error).toHaveBeenCalled());
    });
});
