import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NavLink from "@/components/Navbar/NavLink/NavLink";

const nav = vi.hoisted(() => ({ pathname: "/current" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));
vi.mock("@/components/EmojIcon/EmojIcon", () => ({ default: ({ emojis }: any) => <span>{emojis.join("")}</span> }));

const base = {
    isSubLink: false,
    links: [] as any[],
    hideDropdownMenu: vi.fn(),
    renderDropdownMenu: vi.fn(),
};

describe("NavLink", () => {
    beforeEach(() => vi.clearAllMocks());

    it("opens a dropdown with matching sublinks when a top-level nav item is hovered.", () => {
        const sublinks = [{ name: "Child", to: "/child" }];
        const renderDropdownMenu = vi.fn();
        render(<NavLink {...base} renderDropdownMenu={renderDropdownMenu} links={[{ name: "Parent", to: "/parent", sublinks }]} link={{ name: "Parent", to: "/parent", sublinks }} />);
        fireEvent.mouseOver(screen.getByText("Parent"));
        expect(renderDropdownMenu).toHaveBeenCalledWith(sublinks);
    });

    it("keeps disabled links on the current path and hides the dropdown when clicked.", () => {
        const hideDropdownMenu = vi.fn();
        render(<NavLink {...base} hideDropdownMenu={hideDropdownMenu} link={{ name: "Disabled", to: "/target", isDisabled: true }} />);
        const link = screen.getByText("Disabled").closest("a")!;
        fireEvent.click(link);
        expect(link).toHaveAttribute("href", "/current");
        expect(hideDropdownMenu).toHaveBeenCalledOnce();
    });

    it("renders locked destinations as non-navigable content with their description preserved.", () => {
        const { container } = render(<NavLink {...base} isSubLink link={{ name: "Locked", to: "/secret", isLocked: true, description: "Members only" }} />);
        expect(container.querySelector("a")).not.toBeInTheDocument();
        expect(screen.getByText("Members only")).toBeInTheDocument();
    });
});
