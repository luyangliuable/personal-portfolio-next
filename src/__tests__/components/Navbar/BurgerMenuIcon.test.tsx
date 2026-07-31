import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import BurgerMenuIcon from "@/components/Navbar/BurgerMenuIcon/BurgerMenuIcon";

describe("BurgerMenuIcon", () => {
    it("renders the burger svg path with expected attributes.", () => {
        const { container } = render(<BurgerMenuIcon />);
        const svg = container.querySelector("svg")!;
        expect(svg).toHaveClass("navbar-burger-icon");
        expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
        expect(container.querySelector("path"))
            .toHaveAttribute("d", "M3 12h18M3 6h18M3 18h18");
    });
});
