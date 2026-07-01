import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProgressBar from "@/components/ProgressBar/Progressbar";

describe("ProgressBar", () => {
    it("renders the progress wrapper and exposes progress as a CSS variable.", () => {
        const { container } = render(<ProgressBar progress={0.7} />);
        const wrapper = container.querySelector(".progress-bar") as HTMLElement;
        expect(wrapper).toBeInTheDocument();
        expect(wrapper.style.getPropertyValue("--scale-x")).toBe("0.7");
        expect(container.querySelector(".progress-bar-inner")).toBeTruthy();
    });
});
