import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Burger from "@/components/Organisms/Burger/Burger";
import ZaOcean from "@/components/Organisms/ZaOcean/ZaOcean";

describe("Burger", () => {
    it("renders the bun, filling, sesame, and lettuce layers.", () => {
        const { container } = render(<Burger />);
        expect(container.querySelector(".burger__wrapper")).toBeTruthy();
        expect(container.querySelector(".crown")).toBeTruthy();
        expect(container.querySelector(".tomato")).toBeTruthy();
        expect(container.querySelector(".patty .cheese")).toBeTruthy();
        expect(container.querySelector(".heel")).toBeTruthy();
        expect(container.querySelectorAll(".sesame")).toHaveLength(8);
        expect(container.querySelectorAll(".lettuce__circle")).toHaveLength(9);
    });
});

describe("ZaOcean", () => {
    it("renders the ship, water layers, fishes, and line decorations.", () => {
        const { container } = render(<ZaOcean />);
        expect(container.querySelector(".section-down")).toBeTruthy();
        expect(container.querySelector(".ship span")).toBeTruthy();
        expect(container.querySelectorAll(".water-big")).toHaveLength(3);
        expect(container.querySelectorAll(".water-lines")).toHaveLength(2);
        expect(container.querySelectorAll(".fish")).toHaveLength(2);
        expect(container.querySelectorAll(".water")).toHaveLength(12);
    });
});
