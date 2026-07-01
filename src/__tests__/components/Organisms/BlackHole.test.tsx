import React from "react";
import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BlackHole from "@/components/Organisms/BlackHole/BlackHole";

describe("BlackHole", () => {
    const ctx = {
        clearRect: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        fillStyle: "",
    };

    beforeEach(() => {
        vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
            ctx as any,
        );
        vi.spyOn(globalThis, "requestAnimationFrame").mockReturnValue(1);
    });

    it("renders and initializes the layered canvases for the animation.", async () => {
        const { container } = render(<BlackHole />);
        const canvases = container.querySelectorAll("canvas");

        expect(canvases).toHaveLength(3);
        expect(canvases[0]).toHaveClass("back");
        expect(canvases[1]).toHaveClass("middle");
        expect(canvases[2]).toHaveClass("front");
        await waitFor(() => expect(canvases[0].width).toBe(1500));
        expect(canvases[0].height).toBe(1000);
        expect(ctx.arc).toHaveBeenCalled();
    });
});
