import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SkeletonImage from "@/components/Image/SkeletonImage/SkeletonImage";

describe("SkeletonImage", () => {
    it("renders merged classes, style, and forwarded ref.", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(
            <SkeletonImage
                ref={ref}
                className="extra"
                style={{ width: "10px" }}
            />,
        );
        expect(ref.current).toHaveClass("image-skeleton", "extra");
        expect(ref.current).toHaveStyle({ width: "10px" });
    });
});
