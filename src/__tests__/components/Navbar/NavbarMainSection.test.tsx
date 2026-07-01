import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NavbarMainSection from "@/components/Navbar/NavbarMainSection/NavbarMainSection";

const scrollState = vi.hoisted(() => ({ scrollY: 0 }));
vi.mock("@/hooks", () => ({ useScrollPosition: () => ({ scrollY: scrollState.scrollY }) }));
vi.mock("next/link", () => ({ default: ({ href, children }: any) => <a href={href}>{children}</a> }));
vi.mock("@/components/Navbar/NavBurgerPanel/NavBurgerPanel", () => ({
    default: ({ burgerPanel }: any) => <div ref={burgerPanel} className="nav-burger-panel-hide">Panel</div>,
}));
vi.mock("@/components/Navbar/BurgerMenuIcon/BurgerMenuIcon", () => ({ default: () => <span>Menu</span> }));
vi.mock("@/components/Navbar/NavbarScrollProgress/NavbarScrollProgress", () => ({ default: () => <div>Progress</div> }));
vi.mock("@/components/Navbar/NavLink/NavLink", () => ({
    default: ({ link, renderDropdownMenu, hideDropdownMenu, isSubLink }: any) => (
        <button
            onFocus={() => renderDropdownMenu(link.sublinks)}
            onMouseOver={() => renderDropdownMenu(link.sublinks)}
            onClick={hideDropdownMenu}
            data-sub={isSubLink}
        >
            {link.name}
        </button>
    ),
}));

const links: any = [
    { name: "Home", to: "/" },
    { name: "Docs", to: "/docs", sublinks: [{ name: "API", to: "/api" }] },
];

describe("NavbarMainSection", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        scrollState.scrollY = 0;
        window.innerWidth = 800;
        Element.prototype.getBoundingClientRect = vi.fn(() => ({ height: 50 }) as DOMRect);
        Object.defineProperty(document.documentElement, "scrollTop", { configurable: true, writable: true, value: 0 });
    });

    it("renders logo, links, burger panel, and dropdown sublinks.", () => {
        const { container } = render(<NavbarMainSection links={links} />);
        expect(screen.getByRole("heading", { name: "~/llcode.tech" })).toBeInTheDocument();
        fireEvent.mouseOver(screen.getByText("Docs"));
        expect(screen.getByText("API")).toBeInTheDocument();
        fireEvent.click(container.querySelector(".nav-burger")!);
        expect(screen.getByText("Panel")).not.toHaveClass("nav-burger-panel-hide");
    });

    it("detaches and hides the navbar as scrolling passes its height.", () => {
        const { container, rerender } = render(<NavbarMainSection links={links} />);
        scrollState.scrollY = 100;
        rerender(<NavbarMainSection links={links} />);
        expect(container).toHaveClass("navbar--hidden");
        act(() => vi.advanceTimersByTime(100));
        expect(container).toHaveClass("detached");
    });
});
