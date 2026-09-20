import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import useContentAreaHandler from "@/components/ContentArea/ContentAreaHandler/useContentAreaHandler";

describe("useContentAreaHandler", () => {
    afterEach(() => {
        document.querySelector("footer")?.remove();
        document.documentElement.style.removeProperty("--footer-height");
    });

    it("publishes the footer height as a CSS variable.", () => {
        const footer = document.createElement("footer");
        Object.defineProperty(footer, "offsetHeight", {
            configurable: true,
            value: 128,
        });
        document.body.appendChild(footer);
        renderHook(() => useContentAreaHandler());
        expect(
            document.documentElement.style.getPropertyValue("--footer-height"),
        ).toBe("128px");
    });

    it("does nothing when no footer is present.", () => {
        renderHook(() => useContentAreaHandler());
        expect(
            document.documentElement.style.getPropertyValue("--footer-height"),
        ).toBe("");
    });
});