import { describe, expect, it, vi } from "vitest";
import {
    convertHtmlEntities,
    deepCopyJson,
    isoDateFormatToString,
    isActive,
    removeHashesAndStripWhitespace,
    removeTextInsideAngleBrackets,
    stringToHash,
    stripAwayHashSymbols,
    truncateTextBody,
} from "../../../components/Utility/StringUtility";

describe("StringUtility", () => {
    it("truncates long text to the requested size and appends an ellipsis", () => {
        expect(truncateTextBody("abcdef", 3)).toBe("abc...");
    });

    it("returns an empty string when truncating undefined text", () => {
        expect(truncateTextBody(undefined, 3)).toBe("");
    });

    it("removes hash symbols without changing the remaining text", () => {
        expect(stripAwayHashSymbols("#Hello ##World")).toBe("Hello World");
    });

    it("formats calendar dates with ordinal suffixes and month names", () => {
        expect(isoDateFormatToString(new Date(2024, 0, 1))).toBe(
            "1st January 2024",
        );
        expect(isoDateFormatToString(new Date(2024, 0, 22))).toBe(
            "22nd January 2024",
        );
    });

    it("removes markdown heading hashes and leading whitespace from each line", () => {
        expect(removeHashesAndStripWhitespace("  # Title\n  ## Child")).toBe(
            "Title\nChild",
        );
    });

    it("removes html-like tags and trims surrounding whitespace", () => {
        expect(removeTextInsideAngleBrackets(" <span>Hello</span> ")).toBe(
            "Hello",
        );
    });

    it("converts html entities into readable text content", () => {
        expect(convertHtmlEntities("Tom &amp; Jerry")).toBe("Tom & Jerry");
    });

    it("warns and returns the original text when html entity conversion has no text content", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

        expect(convertHtmlEntities("")).toBe("");
        expect(warn).toHaveBeenCalledWith("Failed to convert html entities: ");

        warn.mockRestore();
    });

    it("creates the same hash for headings that differ only by markdown and html wrappers", () => {
        expect(stringToHash("# <span>Same Heading</span>")).toBe(
            stringToHash("Same Heading"),
        );
    });

    it("matches nested active routes after trimming trailing slashes", () => {
        expect(isActive("/projects/code/", "/projects")).toBe(true);
    });

    it("does not mark the root route or missing paths as active parent routes", () => {
        expect(isActive("/projects", "/")).toBe(false);
        expect(isActive(undefined, "/projects")).toBe(false);
        expect(isActive("/projects", undefined)).toBe(false);
    });

    it("deep copies json-compatible values without sharing nested references", () => {
        const source = { nested: { value: 1 } };
        const copy = deepCopyJson(source);

        copy.nested.value = 2;

        expect(source.nested.value).toBe(1);
        expect(copy.nested.value).toBe(2);
    });
});
