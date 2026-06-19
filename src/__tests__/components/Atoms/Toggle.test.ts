import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Toggle from "@/components/Atoms/Toggle/Toggle";

const h = React.createElement;

describe("Toggle", () => {
    it("uses a functional state update to invert the current value when enabled.", () => {
        const setToggleState = vi.fn();
        render(h(Toggle, { toggleState: false, setToggleState }));
        fireEvent.click(screen.getByText("Display Leetcode Posts?").parentElement as Element);
        expect(setToggleState).toHaveBeenCalledTimes(1);
        expect(setToggleState.mock.calls[0][0](false)).toBe(true);
    });

    it("does not request a state update when the control is disabled.", () => {
        const setToggleState = vi.fn();
        render(h(Toggle, { toggleState: true, setToggleState, disabled: true }));
        fireEvent.click(screen.getByText("Display Leetcode Posts?").parentElement as Element);
        expect(setToggleState).not.toHaveBeenCalled();
    });
});
