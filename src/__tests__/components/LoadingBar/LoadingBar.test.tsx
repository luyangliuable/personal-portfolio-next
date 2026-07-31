import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoadingBar from "@/components/LoadingBar/LoadingBar";

describe("LoadingBar", () => {
    it("renders four boxes with three animated bars each.", () => {
        const { container } = render(<LoadingBar />);
        expect(container.querySelector(".loading-bar")).toBeInTheDocument();
        expect(container.querySelectorAll(".box1,.box2,.box3,.box4"))
            .toHaveLength(4);
        expect(container.querySelectorAll(".bar")).toHaveLength(12);
    });
});
