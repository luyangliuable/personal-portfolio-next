import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import useFadeInOnView from "@/components/Utility/UseFadeInOnView/UseFadeInOnView";

let observerCallback: any;
const observe = vi.fn();
const unobserve = vi.fn();
const disconnect = vi.fn();

beforeEach(() => {
    observe.mockClear();
    unobserve.mockClear();
    disconnect.mockClear();
    globalThis.IntersectionObserver = vi.fn(function (this: any, cb: any) {
        observerCallback = cb;
        this.observe = observe;
        this.unobserve = unobserve;
        this.disconnect = disconnect;
    }) as any;
    document.body.innerHTML = "";
});

afterEach(() => {
    vi.useRealTimers();
});

describe("useFadeInOnView", () => {
    it("observes gallery items and fades in intersecting elements in order.", () => {
        vi.useFakeTimers();
        const first = document.createElement("div");
        first.className = "gallery-item";
        const second = document.createElement("div");
        second.className = "gallery-item";
        document.body.append(first, second);

        const { result, unmount } = renderHook(() => useFadeInOnView());
        expect(observe).toHaveBeenCalledTimes(2);
        expect(result.current).toEqual([first, second]);

        act(() => {
            observerCallback([{ isIntersecting: false, target: first }]);
            observerCallback([{ isIntersecting: true, target: first }]);
        });
        expect(first.style.opacity).toBe("1");
        expect(first.style.transition).toContain("opacity");
        expect(unobserve).toHaveBeenCalledWith(first);

        act(() => {
            vi.advanceTimersByTime(200);
        });

        unmount();
        expect(disconnect).toHaveBeenCalled();
    });
});