import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import useScrollAnimation from "@/hooks/useScrollAnimation";

describe("useScrollAnimation", () => {
    it("returns the initial empty animation state.", () => {
        const { result } = renderHook(() => useScrollAnimation());
        expect(result.current).toEqual({});
    });
});