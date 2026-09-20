import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const makeObserver = () => {
    let callback: any;
    const observe = vi.fn();
    const unobserve = vi.fn();
    const disconnect = vi.fn();
    const ctor = vi.fn(function (this: any, cb: any) {
        callback = cb;
        this.observe = observe;
        this.unobserve = unobserve;
        this.disconnect = disconnect;
    });
    return { ctor, observe, unobserve, getCallback: () => callback };
};

describe("DynamicLoadQueue", () => {
    beforeEach(() => {
        vi.resetModules();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.unstubAllGlobals();
    });

    it("observes elements and fades queued entries in through its observer.", async () => {
        const { ctor, observe, unobserve, getCallback } = makeObserver();
        vi.stubGlobal("IntersectionObserver", ctor);

        const { default: DynamicLoadQueue } = await import(
            "@/stores/DynamicLoadQueue/DynamicLoadQueue"
        );
        const instance = DynamicLoadQueue.getInstance();
        expect(DynamicLoadQueue.getInstance()).toBe(instance);

        const first = document.createElement("div");
        const second = document.createElement("div");
        const third = document.createElement("div");
        instance.addToQueue(first);
        instance.addToQueue(second);
        instance.addToQueue(third);
        expect(observe).toHaveBeenCalledTimes(3);

        const callback = getCallback();
        callback([{ isIntersecting: false, target: first }]);
        callback([{ isIntersecting: true, target: first }]);
        callback([
            { isIntersecting: true, target: second },
            { isIntersecting: true, target: third },
        ]);

        expect(first.style.opacity).toBe("1");
        expect(first.style.transform).toBe("translate(0, 0)");
        expect(unobserve).toHaveBeenCalledWith(first);

        vi.advanceTimersByTime(500);
        expect(second.style.opacity).toBe("1");
        expect(third.style.opacity).toBe("1");
    });

    it("falls back to direct processing without IntersectionObserver support.", async () => {
        delete (globalThis as any).IntersectionObserver;
        delete (window as any).IntersectionObserver;
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

        const { default: DynamicLoadQueue } = await import(
            "@/stores/DynamicLoadQueue/DynamicLoadQueue"
        );
        const instance = DynamicLoadQueue.getInstance();
        expect(warn).toHaveBeenCalledWith(
            "IntersectionObserver is not supported",
        );

        const element = document.createElement("div");
        instance.addToQueue(element);
        expect(element.style.opacity).toBe("1");

        vi.advanceTimersByTime(500);
    });
});