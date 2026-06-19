import { describe, expect, it, vi } from "vitest";
import {
    throttle,
    debounce,
} from "../../../components/Utility/AnimationUtility";
import { getEl } from "../../../components/Utility/ElementUtility";
import { cardGradientEffect } from "../../../components/Utility/MouseUtility";

describe("additional utility helpers", () => {
    it("returns matching elements by id and null when the id does not exist", () => {
        const element = document.createElement("section");
        element.id = "target";
        document.body.appendChild(element);

        expect(getEl<HTMLElement>("target")).toBe(element);
        expect(getEl<HTMLElement>("missing")).toBeNull();
    });

    it("sets mouse gradient coordinates using direct and inverse pointer positions", () => {
        const target = document.createElement("div");
        target.getBoundingClientRect = vi.fn(
            () => ({ left: 10, top: 20 }) as DOMRect,
        );

        cardGradientEffect(
            { target, clientX: 30, clientY: 50 },
            false,
            2,
            1,
            2,
        );
        expect(target.style.getPropertyValue("--mouse-x")).toBe("9px");
        expect(target.style.getPropertyValue("--mouse-y")).toBe("13px");

        cardGradientEffect({ target, clientX: 30, clientY: 50 }, true);
        expect(target.style.getPropertyValue("--mouse-x")).toBe("-20px");
        expect(target.style.getPropertyValue("--mouse-y")).toBe("-30px");
    });

    it("throttles repeated calls until the configured interval has elapsed", () => {
        vi.useFakeTimers();
        const callback = vi.fn();
        const throttled = throttle(callback, 100);

        throttled("first");
        throttled("second");
        expect(callback).toHaveBeenCalledTimes(1);

        vi.advanceTimersByTime(100);
        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback).toHaveBeenLastCalledWith("second");
        vi.useRealTimers();
    });

    it("debounces calls so only the latest invocation runs after waiting", () => {
        vi.useFakeTimers();
        const callback = vi.fn();
        const debounced = debounce(callback, 50);

        debounced("first");
        debounced("second");
        vi.advanceTimersByTime(50);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith("second");
        vi.useRealTimers();
    });
});
