import React from "react";
const h = React.createElement;
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FeaturedContentSection from "@/components/FeaturedContentSection/FeaturedContentSection";

const toggleTrigger = vi.fn();
vi.mock("@/stores/TriggerContext", () => ({
    useTrigger: () => ({ toggleTrigger }),
}));
vi.mock("@/components/LandingPageCard/LandingPageCard", () => ({
    default: ({ children, heading }: any) =>
        h("section", null, h("h2", null, heading), children),
}));
vi.mock("@/components/Button/Button", () => ({
    default: ({ children, onClick }: any) => h("button", { onClick }, children),
}));
vi.mock("@/components/Gallery/GalleryItem/GalleryItem", () => ({
    default: ({ name, type, link, image, imageOverlay }: any) =>
        h(
            "article",
            null,
            h("h3", null, name),
            h("p", null, type),
            h("p", null, link),
            h("p", null, image),
            h("p", null, imageOverlay),
        ),
}));
vi.mock("@/components/TwinCandle/TwinCandle", () => {
    const MockTwinCandle = React.forwardRef((_: any, ref: any) => {
        React.useImperativeHandle(ref, () => ({
            transitionCandleFireToOn: vi.fn(),
            transitionCandleFireToOff: vi.fn(),
        }));
        return h("div", null, "TwinCandle");
    });
    MockTwinCandle.displayName = "MockTwinCandle";
    return { default: MockTwinCandle };
});
vi.mock("@/components/Retro/Retro", () => ({
    default: () => h("div", null, "Retro"),
}));

beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(globalThis, "innerWidth", {
        value: 1200,
        configurable: true,
    });
    globalThis.IntersectionObserver = vi.fn(function (this: any) {
        this.observe = vi.fn();
        this.unobserve = vi.fn();
        this.disconnect = vi.fn();
    }) as any;
});

describe("FeaturedContentSection", () => {
    const featuredPost = {
        _id: { $oid: "featured-post" },
        is_featured: true,
        heading: "Featured Blog",
        body: "Featured body",
        tags: ["react"],
        post_type: "md",
        date_created: "2024-01-01",
    } as any;
    const hiddenPost = {
        _id: { $oid: "hidden-post" },
        is_featured: false,
        heading: "Hidden Blog",
        body: "Hidden body",
        tags: [],
        post_type: "tool",
    } as any;

    it("renders default and featured posts while filtering non-featured posts.", () => {
        render(
            h(FeaturedContentSection, { postList: [featuredPost, hiddenPost] }),
        );
        expect(screen.getByText("Featured Blog")).toBeInTheDocument();
        expect(screen.queryByText("Hidden Blog")).not.toBeInTheDocument();
        expect(screen.getByText("blog")).toBeInTheDocument();
    });

    it("preserves explicit tool links and image overrides for featured content.", () => {
        render(
            h(FeaturedContentSection, {
                postList: [
                    {
                        ...featuredPost,
                        post_type: "tool",
                        url: "/tools/local",
                        imageOverride: { src: "/override.png" },
                        imageOverlay: { src: "/overlay.png" },
                    },
                ],
            }),
        );
        expect(screen.getAllByText("tool").length).toBeGreaterThan(0);
        expect(screen.getByText("/tools/local")).toBeInTheDocument();
        expect(screen.getByText("/override.png")).toBeInTheDocument();
        expect(screen.getByText("/overlay.png")).toBeInTheDocument();
    });

    it("shows all post groups and toggles layout refresh.", () => {
        Object.defineProperty(globalThis, "innerWidth", {
            value: 400,
            configurable: true,
        });
        render(h(FeaturedContentSection, { postList: [featuredPost] }));
        fireEvent.click(screen.getByText(/Show More/));
        expect(toggleTrigger).toHaveBeenCalledTimes(1);
        expect(
            screen.getByText("Sponsor Me for Can4Cancer Now!"),
        ).toBeInTheDocument();
    });
});
