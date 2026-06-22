import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NavbarBurger from "@/components/Navbar/NavbarBurger/NavbarBurger";
import BurgerMenuIcon from "@/components/Navbar/BurgerMenuIcon/BurgerMenuIcon";

describe("NavbarBurger and BurgerMenuIcon", () => {
    it("delegates burger clicks to the provided navbar toggle handler.", () => {
        const onNavbarBurgerClick = vi.fn();
        const { container } = render(<NavbarBurger onNavbarBurgerClick={onNavbarBurgerClick} />);
        fireEvent.click(container.querySelector(".nav-burger")!);
        expect(onNavbarBurgerClick).toHaveBeenCalledOnce();
    });

    it("marks the inline burger graphic as the menu control icon used by navbar buttons.", () => {
        const { container } = render(<BurgerMenuIcon />);
        expect(container.querySelector("svg.navbar-burger-icon path")).toHaveAttribute("d", "M3 12h18M3 6h18M3 18h18");
    });
});
