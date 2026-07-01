import React from "react";
import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LandingPageCard from "@/components/LandingPageCard/LandingPageCard";

vi.mock("@/components/Atoms/SequentialRiseSpan/SequentialRiseSpan", () => ({
    default: ({ children, elementType: Tag = "span", className }: any) => (
        <Tag className={className}>{children}</Tag>
    ),
}));

describe("LandingPageCard", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        document.documentElement.scrollTo = vi.fn();
    });

    it("renders heading, children, style, and fit-content modifiers.", () => {
        const { container } = render(
            <LandingPageCard
                heading="Featured"
                landingPageCardType="fitContent"
                className="custom"
                blendWithBackground
                grainyBackground
                style={{ color: "red" }}
            >
                Body
            </LandingPageCard>,
        );
        const card = container.firstElementChild as HTMLElement;
        expect(screen.getByRole("heading", { name: "Featured" }))
            .toBeInTheDocument();
        expect(screen.getByText("Body")).toBeInTheDocument();
        expect(card).toHaveClass("landing-page-card--fit-content");
        expect(card).toHaveClass("custom", "blend-with-background");
        expect(card).toHaveClass("grainy-background");
        expect(card.style.color).toBe("red");
        act(() => {
            window.dispatchEvent(new Event("scroll"));
            vi.advanceTimersByTime(500);
        });
        expect(document.documentElement.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it("uses normal card classes when type is omitted or explicit.", () => {
        const { container } = render(<LandingPageCard>No heading</LandingPageCard>);
        expect(container.firstElementChild).toHaveClass("landing-page-card");
        const rendered = render(
            <LandingPageCard landingPageCardType="normal">Normal</LandingPageCard>,
        );
        expect(rendered.container.firstElementChild).toHaveClass("landing-page-card");
    });
});
