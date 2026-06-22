import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FractalHills from "@/components/FractalHills/FractalHills";

const p5State = vi.hoisted(() => ({ instance: undefined as any }));
const makeColor = (...args: any[]) => `color:${args.join(",")}`;
const lerpColor = (a: string, b: string, n: number) => `${a}->${b}@${n}`;

vi.mock("p5/lib/p5.js", () => ({
    default: vi.fn(function (this: any, sketch: any, node: HTMLElement) {
        Object.assign(this, {
            node,
            windowWidth: 120,
            windowHeight: 80,
            WEBGL: "WEBGL",
            PI: Math.PI,
            TRIANGLE_STRIP: "TRIANGLE_STRIP",
            createCanvas: vi.fn(),
            map: vi.fn((v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c)),
            noise: vi.fn(() => 0.5),
            color: vi.fn(makeColor),
            lerpColor: vi.fn(lerpColor),
            background: vi.fn(),
            translate: vi.fn(),
            rotateX: vi.fn(),
            stroke: vi.fn(),
            strokeWeight: vi.fn(),
            beginShape: vi.fn(),
            fill: vi.fn(),
            vertex: vi.fn(),
            endShape: vi.fn(),
            resizeCanvas: vi.fn(),
            remove: vi.fn(),
        });
        sketch(this);
        p5State.instance = this;
    }),
}));

describe("FractalHills", () => {
    it("initializes the p5 sketch against the mounted container and removes it on unmount.", () => {
        const { unmount, container } = render(<FractalHills />);
        expect(p5State.instance.node).toBe(container.firstElementChild);
        unmount();
        expect(p5State.instance.remove).toHaveBeenCalledOnce();
    });

    it("generates terrain vertices and resizes the canvas through the p5 lifecycle callbacks.", () => {
        render(<FractalHills />);
        p5State.instance.setup();
        p5State.instance.draw();
        p5State.instance.resizeCanvas.mockClear();
        window.dispatchEvent(new Event("resize"));
        expect(p5State.instance.createCanvas).toHaveBeenCalledWith(120, 80, "WEBGL");
        expect(p5State.instance.vertex).toHaveBeenCalled();
        expect(p5State.instance.resizeCanvas).toHaveBeenCalledWith(120, 80);
    });

    it.each([
        "heatmap",
        "rainbow",
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
    ])("maps terrain colors for the %s color theme.", (colorTheme) => {
        render(<FractalHills colorTheme={colorTheme} />);
        p5State.instance.setup();
        p5State.instance.draw();
        expect(p5State.instance.fill).toHaveBeenCalled();
    });
});
