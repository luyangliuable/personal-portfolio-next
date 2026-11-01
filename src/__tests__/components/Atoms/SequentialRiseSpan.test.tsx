import React from "react";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import SequentialRiseSpan from "@/components/Atoms/SequentialRiseSpan/SequentialRiseSpan";

// Every character measures 10px, so "one" is 30px and a space 10px.
const pretext = vi.hoisted(() => ({
    prepare: vi.fn((text: string, font: string, options: unknown) => ({
        text,
        font,
        options,
    })),
    measureNaturalWidth: vi.fn(
        (prepared: { text: string }) => prepared.text.length * 10,
    ),
}));
vi.mock("@chenglou/pretext", () => pretext);

let observerCallback: any;
const observe = vi.fn();
const unobserve = vi.fn();
const disconnect = vi.fn();
let resizeCallback: (() => void) | undefined;
const disconnectResize = vi.fn();
const OriginalResizeObserver = globalThis.ResizeObserver;
let lineStyle: Record<string, string>;
let spanStyle: Record<string, string>;

beforeEach(() => {
    vi.clearAllMocks();
    observerCallback = undefined;
    resizeCallback = undefined;
    globalThis.ResizeObserver = class {
        constructor(callback: () => void) {
            resizeCallback = callback;
        }
        observe() {}
        disconnect = disconnectResize;
    } as unknown as typeof ResizeObserver;
    globalThis.IntersectionObserver = vi.fn(function (this: any, cb: any) {
        observerCallback = cb;
        this.observe = observe;
        this.unobserve = unobserve;
        this.disconnect = disconnect;
    }) as any;
    spanStyle = {
        width: "100px",
        boxSizing: "content-box",
        paddingLeft: "0px",
        paddingRight: "0px",
    };
    lineStyle = {
        fontStyle: "normal",
        fontWeight: "700",
        fontSize: "20px",
        fontFamily: '"Test Sans", sans-serif',
        letterSpacing: "normal",
        minWidth: "0px",
        maxWidth: "none",
        whiteSpace: "normal",
    };
    vi.spyOn(globalThis, "getComputedStyle").mockImplementation(
        (element: Element) =>
            (element.classList.contains("sequential-rise-span")
                ? spanStyle
                : lineStyle) as unknown as CSSStyleDeclaration,
    );
});

afterEach(() => {
    vi.restoreAllMocks();
    delete (document as any).fonts;
    globalThis.ResizeObserver = OriginalResizeObserver;
});

const lineTexts = (container: HTMLElement, tag = "p") =>
    Array.from(container.querySelectorAll(tag)).map((line) => line.textContent);

describe("SequentialRiseSpan", () => {
    it("wraps words at the measured width and animates each line.", () => {
        const { container, unmount } = render(
            <SequentialRiseSpan
                className="headline"
                elementType="h2"
                baseAnimationDelay={25}
            >
                one two three four
            </SequentialRiseSpan>,
        );

        expect(lineTexts(container, "h2")).toEqual(["one two", "three four"]);
        expect(pretext.prepare).toHaveBeenCalledWith(
            "three",
            'normal 700 20px "Test Sans", sans-serif',
            { letterSpacing: 0 },
        );
        const lines = container.querySelectorAll("h2");
        expect(lines[0]).toHaveClass("invisible", "headline");
        expect(lines[0].parentElement).toHaveClass("w-full", "break-words");
        expect(lines[0].style.animationDelay).toBe("25ms");
        expect(lines[1].style.animationDelay).toBe("125ms");

        act(() => {
            observerCallback([{ isIntersecting: false, target: lines[0] }]);
            observerCallback([{ isIntersecting: true, target: lines[0] }]);
        });
        expect(lines[0]).toHaveClass("slide-up");
        expect(lines[1]).not.toHaveClass("slide-up");
        expect(unobserve).toHaveBeenCalledWith(lines[0]);

        unmount();
        expect(disconnect).toHaveBeenCalled();
    });

    it("re-wraps when the space narrows after mount, not when it widens.", () => {
        const { container, unmount } = render(
            <SequentialRiseSpan>one two three four</SequentialRiseSpan>,
        );
        expect(lineTexts(container)).toEqual(["one two", "three four"]);

        spanStyle.width = "200px";
        act(() => resizeCallback!());
        expect(lineTexts(container)).toEqual(["one two", "three four"]);

        spanStyle.width = "60px";
        act(() => resizeCallback!());
        expect(lineTexts(container)).toEqual(["one", "two", "three", "four"]);
        container
            .querySelectorAll<HTMLElement>(".sequential-rise-span > div")
            .forEach((line) => expect(line.style.display).toBe(""));

        unmount();
        expect(disconnectResize).toHaveBeenCalled();
    });

    it("wraps within the line's min-width and max-width like CSS.", () => {
        lineStyle.maxWidth = "60px";
        const narrow = render(
            <SequentialRiseSpan>one two three</SequentialRiseSpan>,
        );
        expect(lineTexts(narrow.container)).toEqual(["one", "two", "three"]);
        narrow.unmount();

        lineStyle.maxWidth = "none";
        lineStyle.minWidth = "130px";
        const wide = render(
            <SequentialRiseSpan>one two three four</SequentialRiseSpan>,
        );
        expect(lineTexts(wide.container)).toEqual(["one two three", "four"]);
    });

    it("uses the border-box layout width without padding or borders.", () => {
        spanStyle = {
            width: "120px",
            boxSizing: "border-box",
            paddingLeft: "5px",
            paddingRight: "5px",
            borderLeftWidth: "5px",
            borderRightWidth: "5px",
        };
        const { container } = render(
            <SequentialRiseSpan>one two three four</SequentialRiseSpan>,
        );
        expect(lineTexts(container)).toEqual(["one two", "three four"]);
    });

    it("only breaks at spaces and keeps trailing spaces on the line.", () => {
        const { container } = render(
            <SequentialRiseSpan>{"self-interested one "}</SequentialRiseSpan>,
        );
        expect(lineTexts(container)).toEqual(["self-interested", "one "]);
    });

    it("keeps nowrap lines on one line.", () => {
        lineStyle.whiteSpace = "nowrap";
        const { container } = render(
            <SequentialRiseSpan>one two three four</SequentialRiseSpan>,
        );
        expect(lineTexts(container)).toEqual(["one two three four"]);
    });

    it("loads the line's web font before measuring.", async () => {
        let fontLoaded!: () => void;
        const load = vi.fn(
            () => new Promise<void>((resolve) => (fontLoaded = resolve)),
        );
        (document as any).fonts = { load };
        const { container } = render(
            <SequentialRiseSpan>one two</SequentialRiseSpan>,
        );

        expect(load).toHaveBeenCalledWith(
            'normal 700 20px "Test Sans", sans-serif',
            "one two",
        );
        expect(pretext.prepare).not.toHaveBeenCalled();
        expect(lineTexts(container)).toEqual([]);

        await act(async () => fontLoaded());
        expect(lineTexts(container)).toEqual(["one two"]);
    });

    it("resolves ch-based widths against the loaded font.", async () => {
        let fontLoaded!: () => void;
        (document as any).fonts = {
            load: () => new Promise<void>((resolve) => (fontLoaded = resolve)),
        };
        lineStyle.minWidth = "200px"; // ch measured with the fallback font
        const { container } = render(
            <SequentialRiseSpan>one two three four</SequentialRiseSpan>,
        );
        lineStyle.minWidth = "130px";
        await act(async () => fontLoaded());
        expect(lineTexts(container)).toEqual(["one two three", "four"]);
    });

    it("skips measuring when unmounted before the font loads.", async () => {
        let fontLoaded!: () => void;
        (document as any).fonts = {
            load: () => new Promise<void>((resolve) => (fontLoaded = resolve)),
        };
        const { unmount } = render(
            <SequentialRiseSpan>one two</SequentialRiseSpan>,
        );
        unmount();
        await act(async () => fontLoaded());
        expect(pretext.prepare).not.toHaveBeenCalled();
    });

    it("shows the text as one line when it can't be measured.", () => {
        pretext.prepare.mockImplementationOnce(() => {
            throw new RangeError("no canvas");
        });
        render(<SequentialRiseSpan>one two three four</SequentialRiseSpan>);
        expect(screen.getByText("one two three four")).toBeInTheDocument();
    });

    it("renders no lines for empty text.", () => {
        const { container } = render(
            <SequentialRiseSpan>{""}</SequentialRiseSpan>,
        );
        expect(
            container.querySelector(".sequential-rise-span"),
        ).toBeEmptyDOMElement();
    });
});
