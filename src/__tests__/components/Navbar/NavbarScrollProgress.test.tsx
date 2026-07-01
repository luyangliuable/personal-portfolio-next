import React from "react";
import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NavbarScrollProgress from "@/components/Navbar/NavbarScrollProgress/NavbarScrollProgress";

const state = vi.hoisted(() => ({ scrollY: 0 as number | undefined, pathname: "/" }));
vi.mock("@/hooks", () => ({ useScrollPosition: () => ({ scrollY: state.scrollY }) }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));

describe("NavbarScrollProgress", () => {
    beforeEach(() => {
        state.scrollY = 0;
        state.pathname = "/";
        window.innerHeight = 200;
        Object.defineProperty(document.documentElement, "scrollHeight", {
            configurable: true,
            value: 1000,
        });
    });

    it("updates width and gradient from scroll position.", async () => {
        const { rerender, container } = render(<NavbarScrollProgress scrollY={0} />);
        const progress = container.querySelector("#scroll-progress") as HTMLElement;
        expect(progress.style.width).toBe("0vw");
        state.scrollY = 200;
        rerender(<NavbarScrollProgress scrollY={200} />);
        await waitFor(() => expect(progress.style.width).toBe("25vw"));
        expect(progress.style.background).toContain("linear-gradient");
    });

    it("resets progress when the route changes and ignores undefined scroll.", () => {
        const { rerender, container } = render(<NavbarScrollProgress scrollY={0} />);
        const progress = container.querySelector("#scroll-progress") as HTMLElement;
        state.scrollY = 400;
        rerender(<NavbarScrollProgress scrollY={400} />);
        state.scrollY = undefined;
        rerender(<NavbarScrollProgress scrollY={0} />);
        state.pathname = "/next";
        state.scrollY = 0;
        rerender(<NavbarScrollProgress scrollY={1} />);
        expect(progress.style.width).toBe("0vw");
    });
});
