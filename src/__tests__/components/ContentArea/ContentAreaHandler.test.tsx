import React from "react";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const useContentAreaHandler = vi.hoisted(() => vi.fn());
vi.mock(
    "@/components/ContentArea/ContentAreaHandler/useContentAreaHandler",
    () => ({
        default: useContentAreaHandler,
    }),
);

import ContentAreaHandler from "@/components/ContentArea/ContentAreaHandler/ContentAreaHandler";

describe("ContentAreaHandler", () => {
    beforeEach(() => useContentAreaHandler.mockClear());

    it("invokes the content-area hook and renders nothing.", () => {
        const { container } = render(<ContentAreaHandler />);
        expect(useContentAreaHandler).toHaveBeenCalledTimes(1);
        expect(container).toBeEmptyDOMElement();
    });
});