import React from "react";
import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ZaBanquet from "@/components/Organisms/ZaBanquet/ZaBanquet";

const observe = vi.fn();
const unobserve = vi.fn();

describe("ZaBanquet", () => {
    beforeEach(() => {
        observe.mockClear();
        unobserve.mockClear();
        vi.spyOn(Math, "random").mockReturnValue(0.25);
        let createdRefs = 0;
        vi.spyOn(React, "createRef").mockImplementation(() => {
            createdRefs += 1;
            const refIndex = createdRefs;
            let current: Element | null = null;
            return Object.defineProperty({}, "current", {
                get: () => (refIndex === 1 ? null : current),
                set: (value) => {
                    if (value) current = value;
                },
            }) as any;
        });
        global.IntersectionObserver = vi.fn(function (callback: any) {
            return {
                observe: (element: Element) => {
                    observe(element);
                    callback([
                        { isIntersecting: true, target: element },
                        { isIntersecting: false, target: element },
                    ]);
                },
                unobserve,
                disconnect: vi.fn(),
            };
        }) as any;
    });

    afterEach(() => vi.restoreAllMocks());

    it("creates and observes a banquet of animated flowers.", async () => {
        const { container, unmount } = render(<ZaBanquet />);
        expect(container.querySelector(".flowers .bunch")).toBeTruthy();
        expect(container.querySelectorAll(".flower")).toHaveLength(80);
        expect(container.querySelectorAll(".petal")).toHaveLength(400);
        await waitFor(() => expect(observe).toHaveBeenCalledTimes(79));
        expect(container.querySelectorAll(".flower.show")).toHaveLength(79);
        unmount();
        expect(unobserve).toHaveBeenCalledTimes(79);
        expect(container.querySelectorAll(".flower")).toHaveLength(0);
    });
});
