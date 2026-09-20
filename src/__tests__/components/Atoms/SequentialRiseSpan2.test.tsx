import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SequentialRiseSpan2 from "@/components/Atoms/SequentialRiseSpan2/SequentialRiseSpan2";

describe("SequentialRiseSpan2", () => {
    it("renders children inside the sequential-rise wrapper.", () => {
        const { container } = render(
            <SequentialRiseSpan2 className="custom">hello</SequentialRiseSpan2>,
        );
        expect(screen.getByText("hello")).toBeInTheDocument();
        expect(container.firstChild).toHaveClass(
            "sequential-rise-span",
            "custom",
        );
    });

    it("renders without a className.", () => {
        const { container } = render(
            <SequentialRiseSpan2>plain</SequentialRiseSpan2>,
        );
        expect(container.firstChild).toHaveClass("sequential-rise-span");
    });
});