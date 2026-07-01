import React from "react";
const h = React.createElement;
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SkeletonImage from "@/components/Image/SkeletonImage/SkeletonImage";

describe("SkeletonImage", () => {
    it("renders a styled image loading placeholder.", () => {
        render(
            h(SkeletonImage, {
                className: "custom-skeleton",
                style: { height: "120px" },
            }),
        );

        const placeholder = document.querySelector(".image-skeleton");
        expect(placeholder).toHaveClass("custom-skeleton");
        expect(placeholder).toHaveStyle({ height: "120px" });
    });
});
