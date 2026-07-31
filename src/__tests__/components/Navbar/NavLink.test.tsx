import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import NavLink from "@/components/Navbar/NavLink/NavLink";

const pathState = vi.hoisted(() => ({ pathname: "/current" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathState.pathname }));
vi.mock("@/components/EmojIcon/EmojIcon", () => ({
    default: ({ emojis }: any) => <span>{emojis[0]}</span>,
}));

const baseProps = {
    isSubLink: false,
    links: [{ name: "Docs", to: "/docs", sublinks: [{ name: "API", to: "/api" }] }],
    hideDropdownMenu: vi.fn(),
    renderDropdownMenu: vi.fn(),
};

describe("NavLink", () => {
    beforeEach(() => vi.clearAllMocks());

    it("renders active enabled links and opens dropdowns on hover.", () => {
        render(<NavLink {...baseProps} link={{ name: "Docs", to: "/current", emoji: "D" }} />);
        const link = screen.getByRole("link");
        expect(link).toHaveAttribute("href", "/current");
        expect(link).toHaveClass("active-link");
        expect(screen.getByText("D")).toBeInTheDocument();
        fireEvent.mouseOver(link);
        expect(baseProps.renderDropdownMenu).toHaveBeenCalledWith([{ name: "API", to: "/api" }]);
    });

    it("hides the dropdown when a disabled top-level link is clicked.", () => {
        render(<NavLink {...baseProps} link={{ name: "Disabled", to: "/off", isDisabled: true }} />);
        fireEvent.click(screen.getByRole("link"));
        expect(screen.getByRole("link")).toHaveAttribute("href", "/current");
        expect(baseProps.hideDropdownMenu).toHaveBeenCalled();
    });

    it("renders locked sublinks as non-anchor items with descriptions.", () => {
        render(<NavLink {...baseProps} isSubLink link={{ name: "Secret", to: "/secret", isLocked: true, description: "Locked", emoji: "L" }} />);
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
        expect(screen.getByText("Locked")).toBeInTheDocument();
    });
});
