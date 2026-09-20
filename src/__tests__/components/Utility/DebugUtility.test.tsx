import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useTraceUpdate } from "@/components/Utility/DebugUtility";

describe("useTraceUpdate", () => {
    afterEach(() => vi.restoreAllMocks());

    it("logs only the props that changed between renders.", () => {
        const log = vi.spyOn(console, "log").mockImplementation(() => {});
        const { rerender } = renderHook(
            ({ a, b }: { a: number; b: number }) => useTraceUpdate({ a, b }),
            { initialProps: { a: 1, b: 2 } },
        );
        expect(log).not.toHaveBeenCalled();

        rerender({ a: 1, b: 3 });
        expect(log).toHaveBeenCalledWith("Changed props:", { b: [2, 3] });

        log.mockClear();
        rerender({ a: 1, b: 3 });
        expect(log).not.toHaveBeenCalled();
    });
});