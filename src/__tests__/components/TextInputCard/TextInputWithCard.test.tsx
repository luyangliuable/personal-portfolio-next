import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TextInputWithCard from "@/components/TextInputCard/TextInputWithCard";

vi.mock("@/components/Button/Button", () => ({
    default: ({ children, className, to }: any) => (
        <a href={to} className={className}>
            {children}
        </a>
    ),
}));

describe("TextInputWithCard", () => {
    it("renders card copy, input placeholder, submit button, and custom class.", () => {
        const { container } = render(
            <TextInputWithCard
                heading="Subscribe"
                text="Get updates"
                placeholder="Email"
                submitText="Join"
                className="extra-card"
            />,
        );
        expect(
            screen.getByRole("heading", { name: "Subscribe" }),
        ).toBeInTheDocument();
        expect(screen.getByText("Get updates")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email")).toHaveAttribute(
            "type",
            "text",
        );
        expect(screen.getByText("Join").closest("a")).toHaveAttribute(
            "href",
            "",
        );
        expect(container.firstElementChild).toHaveClass("extra-card");
    });
});
