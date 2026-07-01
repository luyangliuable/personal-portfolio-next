import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Chatbot from "@/page/Chatbot/Chatbot";
import LandingPage from "@/page/LandingPage/LandingPage";
import SkeletonPage from "@/page/SkeletonPage/SkeletonPage";
import YoutubePlaylist from "@/page/YoutubePlaylist/YoutubePlaylist";

vi.mock("ollama-chat-client", () => ({
    Chatbot: ({ baseURI }: any) => <div>Chatbot {baseURI}</div>,
}));
vi.mock("@/components/HeroSection/HeroSection", () => ({ default: () => <div>HeroSection</div> }));
vi.mock("@/components/ExperienceSection/ExperienceSection", () => ({ default: () => <div>Experiences</div> }));
vi.mock("@/components/FeaturedContentSection/FeaturedContentSection", () => ({ default: () => <div>Featured</div> }));
vi.mock("@/components/LandingPageCard/LandingPageCard", () => ({ default: ({ children }: any) => <section>{children}</section> }));
vi.mock("@/page/BlogPage/BlogPage", () => ({ default: () => <div>BlogPage</div> }));
vi.mock("@/components/Utility/ScrollUtility", () => ({ useScrollToTopOnLoad: vi.fn() }));
vi.mock("@/components/HeroHeader/HeroHeader", () => ({ default: ({ heading, description }: any) => <header>{heading}{description}</header> }));
vi.mock("@/components/ProgressBar/Progressbar", () => ({ default: ({ progress }: any) => <span>progress {progress}</span> }));
vi.mock("@/components/Gallery/Gallery", () => ({ default: ({ heading, content }: any) => <div>{heading}{content[0].metadata[1].value}</div> }));

describe("page wrappers", () => {
    it("renders the chatbot shell and scrolls to top on mount.", () => {
        document.documentElement.scrollTo = vi.fn();
        vi.spyOn(console, "log").mockImplementation(() => {});
        render(<Chatbot baseURI="http://api" />);
        expect(screen.getByText("Chatbot http://api")).toBeInTheDocument();
        expect(document.documentElement.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it("renders landing page sections after load state is set.", () => {
        render(<LandingPage postList={[]} /> as any);
        expect(screen.getByText("HeroSection")).toBeInTheDocument();
        expect(screen.getByText("Featured")).toBeInTheDocument();
        expect(screen.getByText("Experiences")).toBeInTheDocument();
        expect(screen.getByText("BlogPage")).toBeInTheDocument();
    });

    it("renders skeleton and youtube playlist wrappers.", () => {
        const { container } = render(<SkeletonPage />);
        expect(container.querySelector(".skeleton-page__header")).toBeInTheDocument();
        render(<YoutubePlaylist />);
        expect(screen.getByText(/Youtube Playlists/)).toBeInTheDocument();
        expect(screen.getByText(/50:14:38 watch/)).toBeInTheDocument();
    });
});
