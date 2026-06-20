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
    default: ({ children, heading }: any) => (
        <section>
            <h2>{heading}</h2>
            {children}
        </section>
    ),
}));

vi.mock("@/components/Button/Button", () => ({
    default: ({ children, onClick }: any) => (
        <button onClick={onClick}>{children}</button>
    ),
}));

vi.mock("@/components/Gallery/GalleryItem/GalleryItem", () => ({
    default: ({ name, type, link, image, imageOverlay }: any) => (
        <article>
            <h3>{name}</h3>
            <p>{type}</p>
            <p>{link}</p>
            <p>{image}</p>
            <p>{imageOverlay}</p>
        </article>
    ),
}));

vi.mock("@/components/TwinCandle/TwinCandle", () => ({
    default: React.forwardRef((_: any, ref: any) => {
        React.useImperativeHandle(ref, () => ({
            transitionCandleFireToOn: vi.fn(),
            transitionCandleFireToOff: vi.fn(),
        }));
        return <div>TwinCandle</div>;
    }),
}));

vi.mock("@/components/Retro/Retro", () => ({
    default: () => <div>Retro</div>,
}));

beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "innerWidth", {
        value: 1200,
        configurable: true,
    });
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
            <FeaturedContentSection postList={[featuredPost, hiddenPost]} />,
        );
        expect(screen.getByText("Featured Content")).toBeInTheDocument();
        expect(screen.getByText("Featured Blog")).toBeInTheDocument();
        expect(screen.queryByText("Hidden Blog")).not.toBeInTheDocument();
        expect(screen.getByText("blog")).toBeInTheDocument();
    });

    it("shows all post groups and toggles layout refresh.", () => {
        Object.defineProperty(window, "innerWidth", {
            value: 400,
            configurable: true,
        });
        render(<FeaturedContentSection postList={[featuredPost]} />);
        fireEvent.click(screen.getByText(/Show More/));
        expect(toggleTrigger).toHaveBeenCalledTimes(1);
        expect(
            screen.getByText("/digital-chronicles/blog/featured-post"),
        ).toBeInTheDocument();
    });
});
