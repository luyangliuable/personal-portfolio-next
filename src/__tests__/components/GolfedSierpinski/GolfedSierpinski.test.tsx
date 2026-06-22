import React from "react";
import { act, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import GolfedSierpinski from "@/components/GolfedSierpinski/GolfedSierpinski";

const context = { fillRect: vi.fn(), fillStyle: "" };
let animationCallbacks: FrameRequestCallback[] = [];

beforeEach(() => {
    animationCallbacks = [];
    context.fillRect.mockClear();
    vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation((cb) => {
        animationCallbacks.push(cb);
        return animationCallbacks.length;
    });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context as any);
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("GolfedSierpinski", () => {
    it("uses a minimum canvas size and draws animation frames when the viewport is narrow.", async () => {
        Object.defineProperty(globalThis, "innerWidth", { value: 400, configurable: true });
        const { container } = render(<GolfedSierpinski />);
        const canvas = container.querySelector("canvas")!;
        await waitFor(() => expect(canvas).toHaveAttribute("width", "114"));
        act(() => animationCallbacks.at(0)?.(100));
        expect(context.fillStyle).toBe("#433");
        expect(context.fillRect).toHaveBeenCalled();
    });

    it("recalculates the canvas size from resize events and skips drawing without a 2d context.", async () => {
        vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
        Object.defineProperty(globalThis, "innerWidth", { value: 1600, configurable: true });
        const { container } = render(<GolfedSierpinski />);
        const canvas = container.querySelector("canvas")!;
        await waitFor(() => expect(canvas).toHaveAttribute("width", "200"));
        Object.defineProperty(globalThis, "innerWidth", { value: 912, configurable: true });
        act(() => globalThis.dispatchEvent(new Event("resize")));
        await waitFor(() => expect(canvas).toHaveAttribute("width", "114"));
        expect(context.fillRect).not.toHaveBeenCalled();
    });
});
