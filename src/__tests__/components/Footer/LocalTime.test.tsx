import React from "react";
const h = React.createElement;
import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import LocalTime from "@/components/Footer/LocalTime/LocalTime";

describe("LocalTime", () => {
    afterEach(() => vi.useRealTimers());

    it("formats the current time for the Melbourne timezone after mounting.", () => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
        render(<LocalTime />);
        act(() => vi.advanceTimersByTime(0));
        expect(screen.getByText(/UTC \+10:00/)).toBeInTheDocument();
    });

    it("clears the update interval when the component unmounts.", () => {
        vi.useFakeTimers();
        const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");
        const { unmount } = render(<LocalTime />);
        unmount();
        expect(clearIntervalSpy).toHaveBeenCalled();
    });
});
