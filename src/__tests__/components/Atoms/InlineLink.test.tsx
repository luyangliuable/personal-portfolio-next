import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import InlineLink from "@/components/Atoms/InlineLink/InlineLink";

vi.mock("next/link", () => ({ default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a> }));

describe("InlineLink", () => {
    it("creates a navigable link when a destination is provided.", () => {
        render(<InlineLink to="/posts">Posts</InlineLink>);
        expect(screen.getByRole("link")).toHaveAttribute("href", "/posts");
    });

    it("falls back to an empty destination when the link value is null.", () => {
        render(<InlineLink to={null as any}>Locked</InlineLink>);
        expect(screen.getByText("Locked").closest("a")).toHaveAttribute("href", "");
    });

    it("calls the supplied click handler for action-style inline links.", () => {
        const onClick = vi.fn();
        render(<InlineLink onClick={onClick}>Run</InlineLink>);
        fireEvent.click(screen.getByText("Run").parentElement as Element);
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
