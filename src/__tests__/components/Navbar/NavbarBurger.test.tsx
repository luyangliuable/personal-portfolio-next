import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import NavbarBurger from "@/components/Navbar/NavbarBurger/NavbarBurger";

describe("NavbarBurger", () => {
    it("calls the supplied click handler from the burger wrapper.", () => {
        const onClick = vi.fn();
        const { container } = render(
            <NavbarBurger onNavbarBurgerClick={onClick} />,
        );
        fireEvent.click(container.querySelector(".nav-burger")!);
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(container.querySelector("svg"))
            .toHaveClass("navbar-burger-icon");
    });
});
