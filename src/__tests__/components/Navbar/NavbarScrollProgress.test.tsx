import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NavbarScrollProgress from "@/components/Navbar/NavbarScrollProgress/NavbarScrollProgress";

const state = vi.hoisted(() => ({ scrollY: 0 as number | undefined, pathname: "/a" }));
vi.mock("@/hooks", () => ({ useScrollPosition: () => ({ scrollY: state.scrollY }) }));
vi.mock("next/navigation", () => ({ usePathname: () => state.pathname }));

describe("NavbarScrollProgress", () => {
    beforeEach(() => {
        Object.defineProperty(window, "innerHeight", { value: 600, configurable: true });
        Object.defineProperty(document.documentElement, "scrollHeight", { value: 1000, configurable: true });
    });

    it("calculates progress width and gradient from the current scroll position.", () => {
        state.scrollY = 100;
        const { container } = render(<NavbarScrollProgress scrollY={0} />);
        const progress = container.querySelector("#scroll-progress")! as HTMLElement;
        expect(progress.style.width).toBe("25vw");
        expect(progress.style.background).toContain("96.125%");
    });

    it("resets the progress bar to the start when the pathname changes without a scroll reading.", () => {
        state.scrollY = undefined;
        state.pathname = "/b";
        const { container } = render(<NavbarScrollProgress scrollY={0} />);
        expect((container.querySelector("#scroll-progress") as HTMLElement).style.width).toBe("0vw");
    });
});
