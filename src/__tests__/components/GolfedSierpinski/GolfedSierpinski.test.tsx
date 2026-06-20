import React from "react";
const h = React.createElement;
import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GolfedSierpinski from "@/components/GolfedSierpinski/GolfedSierpinski";

describe("GolfedSierpinski", () => {
    let animationFrames: FrameRequestCallback[];
    const fillRect = vi.fn();

    beforeEach(() => {
        animationFrames = [];
        fillRect.mockClear();
        Object.defineProperty(window, "innerWidth", {
            value: 1200,
            configurable: true,
        });
        vi.spyOn(window, "requestAnimationFrame").mockImplementation(
            (callback) => {
                animationFrames.push(callback);
                return animationFrames.length;
            },
        );
        vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
            fillRect,
            fillStyle: "",
        } as unknown as CanvasRenderingContext2D);
    });

    it("sizes the canvas from the viewport and draws a Sierpinski frame.", async () => {
        const { container } = render(h(GolfedSierpinski));
        const canvas = container.querySelector("canvas")!;

        await waitFor(() => expect(canvas.width).toBe(150));

        act(() => {
            animationFrames[animationFrames.length - 1]?.(1000);
        });

        expect(canvas.height).toBe(150);
        expect(fillRect).toHaveBeenCalled();
    });

    it("exits safely when the browser cannot provide a 2d canvas context.", async () => {
        vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);

        const { container } = render(h(GolfedSierpinski));

        await waitFor(() =>
            expect(container.querySelector("canvas")!.width).toBe(150),
        );
        expect(fillRect).not.toHaveBeenCalled();
    });
});
