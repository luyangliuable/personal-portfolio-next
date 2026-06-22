import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import NavbarMainSection from "@/components/Navbar/NavbarMainSection/NavbarMainSection";

const scroll = vi.hoisted(() => ({ y: 0 }));
vi.mock("@/hooks", () => ({ useScrollPosition: () => ({ scrollY: scroll.y }) }));
vi.mock("next/navigation", () => ({ usePathname: () => "/parent" }));
vi.mock("next/link", () => ({ default: ({ href, children }: any) => <a href={href}>{children}</a> }));
vi.mock("@/components/EmojIcon/EmojIcon", () => ({ default: ({ emojis }: any) => <span>{emojis.join("")}</span> }));

const manySublinks = Array.from({ length: 6 }, (_, index) => ({
    name: `Child ${index}`,
    to: `/child-${index}`,
    description: `Child page ${index}`,
}));
const links: any[] = [
    { name: "Parent", to: "/parent", sublinks: manySublinks },
    { name: "Plain", to: "/plain" },
];

describe("NavbarMainSection", () => {
    beforeEach(() => {
        scroll.y = 0;
        Element.prototype.getBoundingClientRect = vi.fn(() => ({ height: 40, width: 80, top: 0, left: 0, right: 80, bottom: 40, x: 0, y: 0, toJSON: vi.fn() }));
    });
    afterEach(() => vi.useRealTimers());

    it("populates the desktop dropdown with sublinks when a parent link is hovered.", () => {
        const { container } = render(<NavbarMainSection links={links} />);
        fireEvent.mouseOver(container.querySelector(".navbar-left a")!);
        const dropdown = container.querySelector(".navbar-item__dropdown")!;
        expect(dropdown).toHaveTextContent("Child 0");
        expect(dropdown).toHaveStyle({ width: "900px" });
        expect(screen.getByText("Child page 0")).toBeInTheDocument();
    });

    it("toggles the mobile burger panel and hides it after outside clicks.", async () => {
        Object.defineProperty(window, "innerWidth", { value: 500, configurable: true });
        render(<NavbarMainSection links={links} />);
        await waitFor(() => expect(document.body.querySelector(".nav-burger-panel")).toBeInTheDocument());
        const panel = document.body.querySelector(".nav-burger-panel")!;
        fireEvent.click(document.querySelector(".nav-burger")!);
        expect(panel).not.toHaveClass("nav-burger-panel-hide");
        fireEvent.click(document.body);
        expect(panel).toHaveClass("nav-burger-panel-hide");
    });

    it("detaches and hides the navbar after scrolling beyond its measured height.", () => {
        vi.useFakeTimers();
        scroll.y = 80;
        const { container } = render(<NavbarMainSection links={links} />);
        act(() => vi.advanceTimersByTime(100));
        expect(container).toHaveClass("navbar--hidden");
        expect(container).toHaveClass("detached");
    });
});
