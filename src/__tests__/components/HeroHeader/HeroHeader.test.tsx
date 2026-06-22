import React from "react";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HeroHeader from "@/components/HeroHeader/HeroHeader";

const gsapState = vi.hoisted(() => ({ timeline: vi.fn(), registerPlugin: vi.fn(), refresh: vi.fn() }));
vi.mock("gsap", () => ({
    gsap: {
        registerPlugin: gsapState.registerPlugin,
        timeline: gsapState.timeline.mockReturnValue({ to: vi.fn() }),
    },
}));
vi.mock("@gsap/react", () => ({ useGSAP: (cb: any) => cb() }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { name: "ScrollTrigger" } }));
vi.mock("@/stores/TriggerContext", () => ({ useTrigger: () => ({ trigger: 7 }) }));
vi.mock("@/components/Utility/ScrollUtility", () => ({ refreshScrollTrigger: gsapState.refresh }));
vi.mock("@/components/GolfedSierpinski/GolfedSierpinski", () => ({ default: () => <div>Default graphic</div> }));
vi.mock("@/components/Atoms/SequentialRiseSpan/SequentialRiseSpan", () => ({
    default: ({ children, elementType: Tag = "span" }: any) => <Tag>{children}</Tag>,
}));

describe("HeroHeader", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("uses the default graphic and refreshes scroll triggers when no graphic is provided.", () => {
        Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
        render(<HeroHeader heading="Hello" description="Intro" />);
        expect(screen.getByText("Default graphic")).toBeInTheDocument();
        expect(screen.getByRole("heading", { name: /Hello.*\// })).toBeInTheDocument();
        expect(gsapState.timeline).toHaveBeenCalledWith(expect.objectContaining({ scrollTrigger: expect.any(Object) }));
        expect(gsapState.refresh).toHaveBeenCalledWith({ name: "ScrollTrigger" });
    });

    it("renders supplied graphics after the content on mobile-width screens.", () => {
        Object.defineProperty(window, "innerWidth", { value: 480, configurable: true });
        const { container } = render(<HeroHeader heading="Mobile" description="Copy" graphics={<div>Custom graphic</div>} />);
        const inner = container.querySelector(".hero-header__inner")!;
        expect(screen.getByText("Custom graphic")).toBeInTheDocument();
        expect(inner.lastElementChild).toHaveTextContent("Custom graphic");
    });
});
