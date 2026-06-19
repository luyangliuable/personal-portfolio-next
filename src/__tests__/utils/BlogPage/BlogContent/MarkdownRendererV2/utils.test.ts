import { describe, expect, it } from "vitest";
import {
    extractAttributesFromHtmlElement,
    getFirstTagName,
} from "../../../../../utils/BlogPage/BlogContent/MarkdownRendererV2/utils";

describe("Markdown renderer html utilities", () => {
    it("extracts the first html tag name in lowercase from a valid html string", () => {
        expect(
            getFirstTagName('<Section data-id="intro">Hello</Section>'),
        ).toBe("section");
    });

    it("returns null when the html string does not contain an opening tag", () => {
        expect(getFirstTagName("plain text only")).toBeNull();
    });

    it("maps html attributes into react-compatible properties", () => {
        const element = document.createElement("div");
        element.setAttribute("class", "callout");
        element.setAttribute("data-kind", "info");

        expect(extractAttributesFromHtmlElement(element)).toEqual({
            className: "callout",
            "data-kind": "info",
        });
    });

    it("converts inline style declarations into camel-cased react style objects", () => {
        const element = document.createElement("div");
        element.setAttribute(
            "style",
            "background-color: red; font-size: 12px; invalid",
        );

        expect(extractAttributesFromHtmlElement(element)).toEqual({
            style: {
                backgroundColor: "red",
                fontSize: "12px",
            },
        });
    });
});
