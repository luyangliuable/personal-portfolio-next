import React from "react";
import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EventEmitter } from "events";
import TableOfContents from "@/page/BlogPage/BlogContent/TableOfContents/TableOfContents";
import { stringToHash } from "@/components/Utility/StringUtility";

describe("TableOfContents", () => {
    beforeEach(() => {
        vi.spyOn(window, "getComputedStyle").mockReturnValue({
            height: "20px",
            marginBottom: "2px",
        } as any);
        (SVGElement.prototype as any).getTotalLength = vi.fn(() => 100);
        Element.prototype.scrollIntoView = vi.fn();
    });

    it("renders sanitized headings and scrolls to the matching section.", async () => {
        const id = stringToHash("Intro &amp; More").toString();
        document.body.innerHTML = `<section class="blog-section" id="${id}"></section>`;
        render(
            <TableOfContents
                headings={[{ title: "Intro &amp; More", level: 2 }]}
                className="wide"
            />,
        );
        await screen.findByText("Intro & More");
        expect(
            screen.getByText("Table of Contents").closest("div")?.parentElement,
        ).toHaveClass("wide");
        fireEvent.click(screen.getByText("Intro & More"));
        expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
            block: "start",
            behavior: "smooth",
        });
    });

    it("marks entries active when the emitter reports visible sections.", async () => {
        const emitter = new EventEmitter();
        const heading = { title: "Details", level: 3 };
        const id = stringToHash(heading.title).toString();
        render(<TableOfContents headings={[heading]} emitter={emitter} />);
        await screen.findByText("Details");
        act(() => emitter.emit("intersectingSections", [id]));
        await waitFor(() =>
            expect(screen.getByText("Details")).toHaveClass("active"),
        );
    });
});
