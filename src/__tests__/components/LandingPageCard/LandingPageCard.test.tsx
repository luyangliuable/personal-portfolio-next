import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import LandingPageCard from "@/components/LandingPageCard/LandingPageCard";

vi.mock("@/components/Atoms/SequentialRiseSpan/SequentialRiseSpan", () => ({
    default: ({ children, elementType: Tag = "span" }: any) => <Tag>{children}</Tag>,
}));

describe("LandingPageCard", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        document.documentElement.scrollTo = vi.fn();
    });

    afterEach(() => vi.useRealTimers());

    it("resets the page to the top when the card mounts.", () => {
        render(<LandingPageCard heading="Featured">Body</LandingPageCard>);
        expect(document.documentElement.scrollTo).toHaveBeenCalledWith(0, 0);
        expect(screen.getByRole("heading", { name: "Featured" })).toBeInTheDocument();
    });

    it("clears transient scrolling state after the inactivity interval.", () => {
        const setState = vi.spyOn(LandingPageCard.prototype, "setState");
        render(<LandingPageCard landingPageCardType="fitContent">Body</LandingPageCard>);
        fireEvent.scroll(window);
        act(() => vi.advanceTimersByTime(500));
        expect(setState).toHaveBeenCalledWith(expect.objectContaining({ scrolling: true }));
        expect(setState).toHaveBeenCalledWith(expect.objectContaining({ scrolling: false }));
    });
});
