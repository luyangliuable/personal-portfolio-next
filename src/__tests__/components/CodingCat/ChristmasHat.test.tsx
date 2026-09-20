import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ChristmasHat from "@/components/CodingCat/ChristmasHat/ChristmasHat";

describe("ChristmasHat", () => {
    it("renders every decorative hat layer.", () => {
        const { container } = render(<ChristmasHat />);
        expect(container.querySelector(".christmas_hat")).toBeInTheDocument();
        expect(
            container.querySelector(".christmas_hat__ball"),
        ).toBeInTheDocument();
        expect(
            container.querySelector(".christmas_hat__circle"),
        ).toBeInTheDocument();
        expect(
            container.querySelector(".christmas_hat__body"),
        ).toBeInTheDocument();
        expect(
            container.querySelector(".christmas_hat__base")?.textContent,
        ).toBe(".");
    });
});