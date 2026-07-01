import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Retro from "@/components/Retro/Retro";

describe("Retro", () => {
    it("wraps children with retro classes and caller styles.", () => {
        render(
            <Retro className="custom" style={{ color: "red" }}>
                Console
            </Retro>,
        );
        const wrapper = screen.getByText("Console");
        expect(wrapper).toHaveClass("retro", "custom", "retro--show-border");
        expect(wrapper).toHaveStyle("color: rgb(255, 0, 0)");
    });

    it("uses an empty style object when no style is supplied.", () => {
        render(<Retro>Plain</Retro>);
        expect(screen.getByText("Plain")).toHaveClass("retro");
        expect(screen.getByText("Plain")).not.toHaveAttribute("style");
    });
});
