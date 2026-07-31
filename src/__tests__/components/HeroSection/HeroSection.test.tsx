import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import HeroSection from "@/components/HeroSection/HeroSection";

vi.mock("next/link", () => ({
    default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));
vi.mock("@gsap/react", () => ({ useGSAP: (cb: any) => cb() }));
vi.mock("gsap", () => ({
    gsap: { registerPlugin: vi.fn(), timeline: vi.fn(() => ({ add: vi.fn() })), to: vi.fn() },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));
vi.mock("@/components/CodingCat/CodingCat", () => ({
    default: ({ pixelated }: any) => <div>{pixelated ? "Pixel cat" : "Smooth cat"}</div>,
}));
vi.mock("@/components/Button/Button", () => ({
    default: ({ to, children }: any) => <a href={to}>{children}</a>,
}));
vi.mock("@/components/LandingPageCard/LandingPageCard", () => ({
    default: ({ children, className }: any) => <section className={className}>{children}</section>,
}));
vi.mock("@/components/Atoms/SequentialRiseSpan/SequentialRiseSpan", () => ({
    default: ({ children, elementType: Tag = "span", className }: any) => <Tag className={className}>{children}</Tag>,
}));

describe("HeroSection", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        globalThis.innerWidth = 800;
        globalThis.innerHeight = 1000;
        Element.prototype.getBoundingClientRect = vi.fn(() => ({
            left: 0, top: 0, width: 200, height: 100, right: 200, bottom: 100,
            x: 0, y: 0, toJSON: () => {},
        }));
    });

    it("renders heading, CTA links, social links, and coding cats.", () => {
        render(<HeroSection />);
        expect(screen.getByRole("heading", { name: "Hi There, I am Luyang." })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /See my Blog/ })).toHaveAttribute("href", "/digital-chronicles/blog");
        expect(screen.getByRole("link", { name: /NOTION/ })).toHaveAttribute("target", "_blank");
        expect(screen.getByText("Pixel cat")).toBeInTheDocument();
        expect(screen.getByText("Smooth cat")).toBeInTheDocument();
    });

    it("updates the pixel reveal clip path after the cat becomes ready.", () => {
        const { container } = render(<HeroSection />);
        act(() => vi.advanceTimersByTime(800));
        fireEvent.mouseMove(container.querySelector(".hero-section__content__left")!, { clientX: 100, clientY: 50 });
        expect((container.querySelector("[style*='circle']") as HTMLElement).style.clipPath).toContain("50%");
    });
});
