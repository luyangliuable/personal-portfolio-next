import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Button from "@/components/Button/Button";

vi.mock("next/link", () => ({
    default: ({ href, children }: any) => <a href={href}>{children}</a>,
}));
vi.mock("@/components/Utility/MouseUtility", () => ({
    cardGradientEffect: vi.fn(),
}));

describe("Button", () => {
    it("renders an enabled navigation destination for link-style buttons.", () => {
        render(<Button to="/about">About</Button>);
        expect(screen.getByRole("link")).toHaveAttribute("href", "/about");
    });

    it("replaces the destination with an empty href when link-style buttons are disabled.", () => {
        render(
            <Button to="/private" disabled>
                Private
            </Button>,
        );
        expect(screen.getByText("Private").closest("a")).toHaveAttribute(
            "href",
            "",
        );
    });

    it("prevents submission and does not call the handler when disabled.", () => {
        const onClick = vi.fn();
        render(
            <Button onClick={onClick} disabled>
                Save
            </Button>,
        );
        fireEvent.click(screen.getByRole("button"));
        expect(onClick).not.toHaveBeenCalled();
    });
});
