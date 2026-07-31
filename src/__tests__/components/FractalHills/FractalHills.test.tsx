import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FractalHills from "@/components/FractalHills/FractalHills";

const p5Mocks = vi.hoisted(() => ({
    remove: vi.fn(),
    resizeCanvas: vi.fn(),
    vertex: vi.fn(),
}));

vi.mock("p5/lib/p5.js", () => ({
    default: vi.fn(function MockP5(sketch: any) {
        let noiseStep = 0;
        const p: any = {
            WEBGL: "WEBGL",
            TRIANGLE_STRIP: "TRIANGLE_STRIP",
            PI: Math.PI,
            windowWidth: 320,
            windowHeight: 240,
            createCanvas: vi.fn(),
            resizeCanvas: p5Mocks.resizeCanvas,
            map: (value: number, a: number, b: number, c: number, d: number) =>
                c + ((value - a) / (b - a)) * (d - c),
            noise: () => {
                noiseStep = (noiseStep + 1) % 10;
                return noiseStep / 10;
            },
            background: vi.fn(),
            translate: vi.fn(),
            rotateX: vi.fn(),
            stroke: vi.fn(),
            strokeWeight: vi.fn(),
            beginShape: vi.fn(),
            fill: vi.fn(),
            vertex: p5Mocks.vertex,
            endShape: vi.fn(),
            color: (...args: number[]) => `color-${args.join("-")}`,
            lerpColor: (start: string, end: string) => `${start}-${end}`,
        };
        sketch(p);
        p.setup();
        p.draw();
        return { remove: p5Mocks.remove };
    }),
}));

describe("FractalHills", () => {
    it("initializes, draws, resizes, and removes p5 terrain sketches.", () => {
        const themes = [
            "heatmap",
            "rainbow",
            "invertedMonochrome",
            "monochrome",
            "red",
            "green",
            "blue",
            "temperature",
            "viridis",
            "magma",
            "heat",
            "brewer-ygb",
            "unknown",
        ];
        const { container, unmount } = render(
            <>{themes.map((theme) => <FractalHills key={theme} colorTheme={theme} />)}</>,
        );
        expect(container.firstElementChild).toHaveClass("bg-[red]", "h-screen");
        expect(p5Mocks.vertex).toHaveBeenCalled();
        globalThis.dispatchEvent(new Event("resize"));
        expect(p5Mocks.resizeCanvas).toHaveBeenCalledWith(320, 240);
        unmount();
        expect(p5Mocks.remove).toHaveBeenCalled();
    });
});
