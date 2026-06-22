import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import HeroSection from "@/components/HeroSection/HeroSection";

vi.mock("next/link", () => ({ default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a> }));
vi.mock("@/components/Button/Button", () => ({ default: ({ to, children }: any) => <a href={to}>{children}</a> }));
vi.mock("@/components/LandingPageCard/LandingPageCard", () => ({ default: ({ children }: any) => <section>{children}</section> }));
vi.mock("@/components/CodingCat/CodingCat", () => ({ default: ({ pixelated }: any) => <div data-testid={pixelated ? "pixel-cat" : "normal-cat"} /> }));
vi.mock("@/components/Atoms/SequentialRiseSpan/SequentialRiseSpan", () => ({
    default: ({ children, maxNumberOfLettersPerLine }: any) => <span data-max={maxNumberOfLettersPerLine}>{children}</span>,
}));
vi.mock("gsap", () => ({ gsap: { registerPlugin: vi.fn(), timeline: vi.fn(() => ({ add: vi.fn() })), to: vi.fn() } }));
vi.mock("@gsap/react", () => ({ useGSAP: (cb: any) => cb() }));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));

describe("HeroSection", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("uses the compact heading configuration when the viewport is narrow.", () => {
        Object.defineProperty(window, "innerWidth", { value: 500, configurable: true });
        render(<HeroSection />);
        expect(screen.getByText("Hi There, I am Luyang.")).toHaveAttribute("data-max", "10");
        expect(screen.getByRole("link", { name: /See my Blog/i })).toHaveAttribute("href", "/digital-chronicles/blog");
    });

    it("updates the pixel-cat clip path from cursor position after the readiness delay.", () => {
        Object.defineProperty(window, "innerWidth", { value: 900, configurable: true });
        render(<HeroSection />);
        act(() => vi.advanceTimersByTime(800));
        const wrapper = screen.getByTestId("pixel-cat").parentElement!;
        wrapper.getBoundingClientRect = () => ({ left: 10, top: 20, width: 100, height: 200, right: 110, bottom: 220, x: 10, y: 20, toJSON: vi.fn() });
        fireEvent.mouseMove(wrapper.closest("section")!, { clientX: 50, clientY: 70 });
        expect(wrapper).toHaveStyle({ clipPath: "circle(70px at 40% 25%)" });
    });
});
