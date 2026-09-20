import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SequentialRiseSpan from "@/components/Atoms/SequentialRiseSpan/SequentialRiseSpan";

let observerCallback: any;
const observe = vi.fn();
const unobserve = vi.fn();
const disconnect = vi.fn();

beforeEach(() => {
    observe.mockClear();
    unobserve.mockClear();
    disconnect.mockClear();
    observerCallback = undefined;
    globalThis.IntersectionObserver = vi.fn(function (this: any, cb: any) {
        observerCallback = cb;
        this.observe = observe;
        this.unobserve = unobserve;
        this.disconnect = disconnect;
    }) as any;
    vi.spyOn(globalThis, "getComputedStyle").mockReturnValue({
        paddingLeft: "0px",
        paddingRight: "0px",
    } as any);
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get() {
            return this.textContent ? this.textContent.length * 10 : 100;
        },
    });
});

afterEach(() => {
    vi.restoreAllMocks();
    delete (HTMLElement.prototype as any).offsetWidth;
});

describe("SequentialRiseSpan", () => {
    it("measures, wraps and animates text lines.", () => {
        const { container, unmount } = render(
            <SequentialRiseSpan
                className="headline"
                elementType="h2"
                minNumberOfLettersPerLine={4}
                maxNumberOfLettersPerLine={8}
                baseAnimationDelay={25}
            >
                one two three four
            </SequentialRiseSpan>,
        );

        expect(screen.getByText("one two")).toBeInTheDocument();
        expect(screen.getByText("three")).toBeInTheDocument();
        expect(screen.getByText("four")).toBeInTheDocument();
        expect(container.querySelectorAll("h2").length).toBe(3);
        expect(container.querySelector("h2")!.style.animationDelay).toBe(
            "25ms",
        );

        act(() => {
            observerCallback([
                {
                    isIntersecting: false,
                    target: container.querySelector("h2")!,
                },
            ]);
            observerCallback([
                {
                    isIntersecting: true,
                    target: container.querySelector("h2")!,
                },
            ]);
        });
        expect(container.querySelector("h2")).toHaveClass("slide-up");
        expect(unobserve).toHaveBeenCalled();

        act(() => {
            window.dispatchEvent(new Event("resize"));
        });

        unmount();
        expect(disconnect).toHaveBeenCalled();
    });

    it("uses an explicit letters-per-line value without measuring.", () => {
        const { container } = render(
            <SequentialRiseSpan numberOfLettersPerLine={5}>
                alpha beta gamma
            </SequentialRiseSpan>,
        );
        expect(container.querySelectorAll("p").length).toBe(3);
        expect(screen.getByText("alpha")).toBeInTheDocument();
        expect(screen.getByText("beta")).toBeInTheDocument();
        expect(screen.getByText("gamma")).toBeInTheDocument();
    });
});