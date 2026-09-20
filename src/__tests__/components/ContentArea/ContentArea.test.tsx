import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock(
    "@/components/ContentArea/ContentAreaHandler/ContentAreaHandler",
    () => ({
        default: () => <div data-testid="handler" />,
    }),
);

import ContentArea from "@/components/ContentArea/ContentArea";

describe("ContentArea", () => {
    it("renders the handler and its children.", () => {
        render(
            <ContentArea>
                <p>child content</p>
            </ContentArea>,
        );
        expect(screen.getByTestId("handler")).toBeInTheDocument();
        expect(screen.getByText("child content")).toBeInTheDocument();
    });
});