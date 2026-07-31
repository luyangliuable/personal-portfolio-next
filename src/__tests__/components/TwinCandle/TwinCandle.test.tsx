import React from "react";
import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TwinCandles from "@/components/TwinCandle/TwinCandle";

describe("TwinCandles", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        document.body.innerHTML =
            '<div class="featured-section-content"></div>';
    });

    afterEach(() => vi.useRealTimers());

    it("initializes off and transitions the candle light on and off.", () => {
        const ref = React.createRef<TwinCandles>();
        const { container } = render(
            <TwinCandles ref={ref} style={{ marginTop: 4 }} />,
        );
        const room = document.querySelector(".featured-section-content")!;

        expect(container.querySelector(".wrapper")).toHaveStyle({
            marginTop: "4px",
        });
        expect(room).toHaveClass("featured-section-content-in-dark-room");
        expect(ref.current?.state.currentCandleState).toBe("Off");

        act(() => ref.current?.transitionCandleFireToOn());
        expect(ref.current?.state.currentCandleState).toBe("Transitioning");
        expect(room).not.toHaveClass("featured-section-content-in-dark-room");
        expect(container.querySelector(".candle2")).toHaveClass(
            "candle2-transition__on",
        );

        act(() => vi.runOnlyPendingTimers());
        expect(ref.current?.state.currentCandleState).toBe("On");
        expect(container.querySelector(".candle2__fire")).toHaveClass(
            "candle2__fire-animated",
        );

        act(() => ref.current?.transitionCandleFireToOff());
        expect(container.querySelector(".candle__smoke-one")).toHaveClass(
            "candle__smoke-one",
        );
        act(() => vi.runOnlyPendingTimers());
        expect(ref.current?.state.currentCandleState).toBe("Off");
        expect(room).toHaveClass("featured-section-content-in-dark-room");
    });

    it("ignores invalid transitions and works without a dark-room element.", () => {
        document.body.innerHTML = "";
        const ref = React.createRef<TwinCandles>();
        render(<TwinCandles ref={ref} />);

        act(() => ref.current?.transitionCandleFireToOff());
        expect(ref.current?.state.currentCandleState).toBe("Off");

        act(() => ref.current?.turnCandleLightOn());
        expect(ref.current?.state.currentCandleState).toBe("On");
        act(() => ref.current?.transitionCandleFireToOn());
        expect(ref.current?.state.currentCandleState).toBe("On");
    });
});
