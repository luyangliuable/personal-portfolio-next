import React from "react";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Bento from "@/components/Bento/Bento";

describe("Bento", () => {
    it("renders responsive items and collapses columns on small screens.", () => {
        globalThis.innerWidth = 1200;
        const { container, unmount } = render(
            <Bento className="custom" gap="2vw">
                <Bento.Item rowSpan={2} colSpan={3} className="item">
                    content
                </Bento.Item>
            </Bento>,
        );

        expect(screen.getByText("content")).toBeInTheDocument();
        expect(container.querySelector(".bento-container")).toHaveClass(
            "custom",
        );
        const item = container.querySelector(".bento-item") as HTMLElement;
        expect(item.style.gridRow).toBe("span 2");
        expect(item.style.gridColumn).toBe("span 3");
        expect(
            container.querySelector(".bento-item--bottom"),
        ).toBeInTheDocument();

        act(() => {
            globalThis.innerWidth = 500;
            window.dispatchEvent(new Event("resize"));
        });
        expect(item.style.gridColumn).toBe("span 1");

        unmount();
    });
});