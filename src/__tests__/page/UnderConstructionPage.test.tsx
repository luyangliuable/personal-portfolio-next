import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import UnderConstruction from "@/page/UnderConstructionPage/UnderConstruction";
import { cardGradientEffect } from "@/components/Utility/MouseUtility";

vi.mock("@/components/Utility/MouseUtility", () => ({
    cardGradientEffect: vi.fn(),
}));

describe("UnderConstruction", () => {
    it("renders the coming soon card and wires the gradient handler.", () => {
        const { container } = render(<UnderConstruction />);
        expect(screen.getByRole("heading", { name: "Coming Soon" }))
            .toBeInTheDocument();
        fireEvent.mouseMove(container.querySelector(".under-contruction-card")!);
        expect(cardGradientEffect).toHaveBeenCalled();
    });
});
