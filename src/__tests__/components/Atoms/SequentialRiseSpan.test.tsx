import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { prepareWithSegments, layoutWithLines } = vi.hoisted(() => ({
    prepareWithSegments: vi.fn((text: string) => ({ text })),
    layoutWithLines: vi.fn(),
}));

vi.mock("@chenglou/pretext", () => ({
    prepareWithSegments,
    layoutWithLines,
}));

import SequentialRiseSpan from "@/components/Atoms/SequentialRiseSpan/SequentialRiseSpan";

let observerCallback: any;
const observe = vi.fn();
const unobserve = vi.fn();
const disconnect = vi.fn();

const mockLayoutLines = (prepared: { text: string }) => {
    const words = prepared.text.split(" ");
    const lines = [];

    for (let index = 0; index < words.length; index += 2) {
        lines.push({
            text: words.slice(index, index + 2).join(" "),
            width: 0,
            start: { segmentIndex: 0, graphemeIndex: 0 },
            end: { segmentIndex: 0, graphemeIndex: 0 },
        });
    }

    return { lineCount: lines.length, height: lines.length, lines };
};

beforeEach(() => {
    observe.mockClear();
    unobserve.mockClear();
    disconnect.mockClear();
    prepareWithSegments.mockClear();
    layoutWithLines.mockClear();
    prepareWithSegments.mockImplementation((text: string) => ({ text }));
    layoutWithLines.mockImplementation(mockLayoutLines);
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
        fontSize: "16px",
        fontWeight: "700",
        fontFamily: '"Inter", sans-serif',
        lineHeight: "20px",
    } as any);
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get() {
            return 300;
        },
    });
});

afterEach(() => {
    vi.restoreAllMocks();
    delete (HTMLElement.prototype as any).offsetWidth;
    delete (document as any).fonts;
});

describe("SequentialRiseSpan", () => {
    it("lays out text with pretext, wraps and animates lines.", () => {
        const { container, unmount } = render(
            <SequentialRiseSpan
                className="headline"
                elementType="h2"
                baseAnimationDelay={25}
            >
                one two three four
            </SequentialRiseSpan>,
        );

        expect(prepareWithSegments).toHaveBeenCalledWith(
            "one two three four",
            '700 16px "Inter", sans-serif',
        );
        expect(layoutWithLines).toHaveBeenCalledWith(
            expect.anything(),
            300,
            20,
        );
        expect(screen.getByText("one two")).toBeInTheDocument();
        expect(screen.getByText("three four")).toBeInTheDocument();
        expect(container.querySelectorAll("h2").length).toBe(2);
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

        const layoutCallsBeforeResize = layoutWithLines.mock.calls.length;
        act(() => {
            window.dispatchEvent(new Event("resize"));
        });
        expect(layoutWithLines.mock.calls.length).toBeGreaterThan(
            layoutCallsBeforeResize,
        );

        unmount();
        expect(disconnect).toHaveBeenCalled();
    });

    it("uses explicit font and line height overrides.", () => {
        render(
            <SequentialRiseSpan font="700 24px Inter" lineHeight={30}>
                alpha beta
            </SequentialRiseSpan>,
        );

        expect(prepareWithSegments).toHaveBeenCalledWith(
            "alpha beta",
            "700 24px Inter",
        );
        expect(layoutWithLines).toHaveBeenCalledWith(
            expect.anything(),
            300,
            30,
        );
    });

    it("falls back to the font size when line height is not a number.", () => {
        vi.spyOn(globalThis, "getComputedStyle").mockReturnValue({
            paddingLeft: "0px",
            paddingRight: "0px",
            fontSize: "16px",
            fontWeight: "400",
            fontFamily: "Inter",
            lineHeight: "normal",
        } as any);

        render(<SequentialRiseSpan>alpha</SequentialRiseSpan>);

        expect(layoutWithLines).toHaveBeenCalledWith(
            expect.anything(),
            300,
            expect.closeTo(16 * 1.2, 5),
        );
    });

    it("skips measurement when the container has no width.", () => {
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
            configurable: true,
            get() {
                return 0;
            },
        });

        render(<SequentialRiseSpan>alpha</SequentialRiseSpan>);

        expect(layoutWithLines).not.toHaveBeenCalled();
    });

    it("re-measures after web fonts have loaded.", async () => {
        const ready = Promise.resolve();
        Object.defineProperty(document, "fonts", {
            configurable: true,
            value: { ready },
        });

        render(<SequentialRiseSpan>alpha beta</SequentialRiseSpan>);
        const layoutCallsBeforeFonts = layoutWithLines.mock.calls.length;

        await act(async () => {
            await ready;
        });

        expect(layoutWithLines.mock.calls.length).toBeGreaterThan(
            layoutCallsBeforeFonts,
        );
    });
});
