import { describe, expect, it } from "vitest";
import {
    cl,
    clamp,
    deepCompare,
    setProperty,
    toggleClassName,
    toggleProperty,
} from "../../../components/Utility/LogicUtility";

describe("LogicUtility", () => {
    it("composes class names from strings and truthy object entries", () => {
        expect(cl("base", { active: true, hidden: false }, "extra")).toBe(
            "base active extra",
        );
    });

    it("ignores falsy class name inputs and returns an empty string when none apply", () => {
        expect(cl(undefined, null, false, { active: false })).toBe("");
    });

    it("clamps factored values between the provided minimum and maximum", () => {
        expect(clamp(0, 10, 8, 2)).toBe(10);
        expect(clamp(0, 10, -3, 2)).toBe(0);
        expect(clamp(0, 10, 4, 2)).toBe(8);
    });

    it("uses safe defaults when clamp receives no value or factor", () => {
        expect(clamp(5, 10)).toBe(5);
    });

    it("sets css custom properties on the provided element", () => {
        const element = document.createElement("div");

        setProperty(element, { "--accent-color": "red", opacity: "0.5" });

        expect(element.style.getPropertyValue("--accent-color")).toBe("red");
        expect(element.style.getPropertyValue("opacity")).toBe("0.5");
    });

    it("toggles class names according to the requested boolean state", () => {
        const element = document.createElement("div");

        toggleClassName(element, true, "visible");
        expect(element.classList.contains("visible")).toBe(true);

        toggleClassName(element, false, "visible");
        expect(element.classList.contains("visible")).toBe(false);
    });

    it("applies the matching property set for true and false states", () => {
        const element = document.createElement("div");

        toggleProperty(element, true, { opacity: "1" }, { opacity: "0" });
        expect(element.style.opacity).toBe("1");

        toggleProperty(element, false, { opacity: "1" }, { opacity: "0" });
        expect(element.style.opacity).toBe("0");
    });

    it("compares json-compatible structures by their serialized values", () => {
        expect(deepCompare({ a: [1, 2] }, { a: [1, 2] })).toBe(true);
        expect(deepCompare({ a: [1, 2] }, { a: [2, 1] })).toBe(false);
    });
});
