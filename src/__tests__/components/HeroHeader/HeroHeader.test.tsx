import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HeroHeader from "@/components/HeroHeader/HeroHeader";

const to = vi.fn();
vi.mock("@gsap/react", () => ({ useGSAP: (cb: any) => cb() }));
vi.mock("gsap", () => ({
    gsap: { registerPlugin: vi.fn(), timeline: vi.fn(() => ({ to })) },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: { refresh: vi.fn() } }));
vi.mock("@/stores/TriggerContext", () => ({ useTrigger: () => ({ trigger: 1 }) }));
vi.mock("@/components/Utility/ScrollUtility", () => ({
    refreshScrollTrigger: vi.fn(),
}));
vi.mock("@/components/GolfedSierpinski/GolfedSierpinski", () => ({
    default: () => <div>Default graphic</div>,
}));
vi.mock("@/components/Atoms/SequentialRiseSpan/SequentialRiseSpan", () => ({
    default: ({ children, elementType: Tag = "span", className }: any) => (
        <Tag className={className}>{children}</Tag>
    ),
}));

describe("HeroHeader", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        globalThis.innerWidth = 1024;
    });

    it("renders desktop content with custom graphics and initializes GSAP.", () => {
        render(
            <HeroHeader heading="Hello" description="World" graphics={<b>Art</b>}>
                Child
            </HeroHeader>,
        );
        expect(screen.getByRole("heading", { name: /Hello/ })).toBeInTheDocument();
        expect(screen.getByText("World")).toBeInTheDocument();
        expect(screen.getByText("Art")).toBeInTheDocument();
        expect(screen.getByText("Child")).toBeInTheDocument();
        expect(to).toHaveBeenCalledWith(".hero-header", expect.any(Object));
    });

    it("uses default graphics after resizing into the mobile layout.", () => {
        render(<HeroHeader heading="Hi" description="There" />);
        act(() => {
            globalThis.innerWidth = 500;
            fireEvent.resize(globalThis as Window);
        });
        expect(screen.getByText("Default graphic")).toBeInTheDocument();
    });
});
