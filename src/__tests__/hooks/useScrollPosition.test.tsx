import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useScrollPosition from "@/hooks/useScrollPosition";

describe("useScrollPosition", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        Object.defineProperty(window, "scrollY", {
            configurable: true,
            writable: true,
            value: 0,
        });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("tracks scroll position, scrolling state and delta scroll.", () => {
        const { result } = renderHook(() => useScrollPosition(1));

        act(() => {
            window.scrollY = 100;
            window.dispatchEvent(new Event("scroll"));
        });
        expect(result.current.scrollY).toBe(100);
        expect(result.current.scrolling).toBe(true);

        act(() => {
            vi.advanceTimersByTime(50);
        });
        expect(result.current.scrolling).toBe(false);

        act(() => {
            vi.advanceTimersByTime(400);
        });
        expect(result.current.deltaScrollCalculation?.deltaScrolled).toBe(100);
        expect(
            result.current.deltaScrollCalculation?.lastRecordedScrollY,
        ).toBe(100);

        act(() => {
            window.dispatchEvent(new Event("scroll"));
            window.dispatchEvent(new Event("scroll"));
            vi.advanceTimersByTime(400);
        });
        expect(result.current.scrollY).toBe(100);
    });

    it("keeps the previous state when the delta scroll is unchanged.", () => {
        const { result } = renderHook(() => useScrollPosition(1));

        act(() => {
            vi.advanceTimersByTime(400);
            vi.advanceTimersByTime(400);
            vi.advanceTimersByTime(400);
        });
        expect(result.current.deltaScrollCalculation?.deltaScrolled).toBe(0);
    });
});