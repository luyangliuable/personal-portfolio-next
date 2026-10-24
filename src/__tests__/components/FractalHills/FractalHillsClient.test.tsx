import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FractalHillsClient from "@/components/FractalHills/FractalHillsClient";

vi.mock("@/components/FractalHills/FractalHills", () => ({
    default: ({ colorTheme }: { colorTheme?: string }) => (
        <div>Fractal Hills {colorTheme}</div>
    ),
}));

describe("FractalHillsClient", () => {
    it("loads the p5 sketch on the client and forwards props.", async () => {
        render(<FractalHillsClient colorTheme="viridis" />);

        expect(
            await screen.findByText("Fractal Hills viridis"),
        ).toBeInTheDocument();
    });
});
