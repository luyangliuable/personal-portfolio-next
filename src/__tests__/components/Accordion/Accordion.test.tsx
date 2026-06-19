import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Accordion from "@/components/Accordion/Accordion";

describe("Accordion", () => {
    it("reveals hidden item content when the heading is opened and scrolls it into view.", () => {
        const scrollIntoView = vi.fn();
        Element.prototype.scrollIntoView = scrollIntoView;
        render(<Accordion><Accordion.Item heading="Details">Body</Accordion.Item></Accordion>);
        const body = document.querySelector(".accordion--content");
        fireEvent.click(screen.getByText("Details"));
        expect(body).not.toHaveClass("hidden");
        expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });
    });

    it("hides open content without scrolling when the same heading is closed.", () => {
        const scrollIntoView = vi.fn();
        Element.prototype.scrollIntoView = scrollIntoView;
        render(<Accordion><Accordion.Item heading="Details">Body</Accordion.Item></Accordion>);
        const body = document.querySelector(".accordion--content");
        fireEvent.click(screen.getByText("Details"));
        scrollIntoView.mockClear();
        fireEvent.click(screen.getByText("Details"));
        expect(body).toHaveClass("hidden");
        expect(scrollIntoView).not.toHaveBeenCalled();
    });

    it("does not create a navigable link when the accordion button is disabled.", () => {
        render(<Accordion.Button heading="Locked" href="/secret" disabled />);
        expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
});
