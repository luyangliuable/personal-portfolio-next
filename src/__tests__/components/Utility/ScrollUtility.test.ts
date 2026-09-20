import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
    centerElementInParent,
    getHTMLElementCenterYPosition,
    getVisiblePercentage,
    isCenterAlignedWithViewport,
    isCloseToAnotherElement,
    refreshScrollTrigger,
    resetElementPosition,
    useScrollToTopOnLoad,
} from "@/components/Utility/ScrollUtility";

const rect = (top: number, bottom: number, height: number): DOMRect =>
    ({
        top,
        bottom,
        height,
        left: 0,
        width: 100,
        right: 100,
        x: 0,
        y: top,
        toJSON: () => ({}),
    }) as DOMRect;

describe("ScrollUtility", () => {
    beforeEach(() => {
        Object.defineProperty(window, "innerHeight", {
            configurable: true,
            writable: true,
            value: 800,
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
        delete (document as any).elementFromPoint;
    });

    it("computes the visible percentage of an element.", () => {
        expect(getVisiblePercentage(null)).toBe(0);

        const fullyVisible = document.createElement("div");
        fullyVisible.getBoundingClientRect = () => rect(0, 100, 100);
        expect(getVisiblePercentage(fullyVisible)).toBe(100);

        const halfVisible = document.createElement("div");
        halfVisible.getBoundingClientRect = () => rect(-50, 50, 100);
        expect(getVisiblePercentage(halfVisible)).toBe(50);

        const belowViewport = document.createElement("div");
        belowViewport.getBoundingClientRect = () => rect(900, 1000, 100);
        expect(getVisiblePercentage(belowViewport)).toBe(0);
    });

    it("measures how far an element is from the viewport center.", () => {
        expect(isCenterAlignedWithViewport(null)).toBe(Number.MAX_SAFE_INTEGER);

        const element = document.createElement("div");
        element.getBoundingClientRect = () => rect(0, 100, 100);
        expect(isCenterAlignedWithViewport(element)).toBe(-350);
        expect(getHTMLElementCenterYPosition(element)).toBe(0);
    });

    it("repositions and resets an element within its parent.", () => {
        const element = document.createElement("div");
        centerElementInParent(element, 12);
        expect(element.style.position).toBe("absolute");
        expect(element.style.top).toBe("calc(12px)");
        expect(element.style.transform).toBe("translate(-50%, -50%)");

        const centered = document.createElement("div");
        centerElementInParent(centered);
        expect(centered.style.top).toBe("");

        resetElementPosition(element);
        expect(element.style.position).toBe("");
        expect(element.style.top).toBe("");
        expect(element.style.left).toBe("");
        expect(element.style.transform).toBe("");
    });

    it("finds nearby elements matching any requested class.", () => {
        const target = document.createElement("div");
        target.className = "hit";
        const element = document.createElement("div");
        element.getBoundingClientRect = () => rect(100, 200, 100);

        const fromPoint = vi.fn();
        (document as any).elementFromPoint = fromPoint;
        fromPoint
            .mockReturnValueOnce(target)
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(target)
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(target)
            .mockReturnValueOnce(null)
            .mockReturnValueOnce(target)
            .mockReturnValueOnce(null);

        expect(isCloseToAnotherElement(element, "top", 100, ["hit"])).toContain(
            target,
        );
        expect(
            isCloseToAnotherElement(element, "bottom", 100, ["missing"]),
        ).toEqual([]);
        expect(
            isCloseToAnotherElement(element, "both", 100, ["hit"]).length,
        ).toBeGreaterThan(0);
    });

    it("refreshes scroll triggers immediately and after a delay.", () => {
        vi.useFakeTimers();
        const scrollTrigger = { refresh: vi.fn() };
        refreshScrollTrigger(scrollTrigger);
        expect(scrollTrigger.refresh).toHaveBeenCalledTimes(1);
        vi.advanceTimersByTime(500);
        expect(scrollTrigger.refresh).toHaveBeenCalledTimes(2);
        vi.useRealTimers();
    });

    it("scrolls to the top on mount and on unmount.", () => {
        const scrollTo = vi
            .spyOn(window, "scrollTo")
            .mockImplementation(() => {});
        const { unmount } = renderHook(() => useScrollToTopOnLoad());
        expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
        unmount();
        expect(scrollTo).toHaveBeenCalledTimes(2);
    });
});