import { describe, expect, it } from "vitest";
import { Node } from "unist";
import { Parent } from "mdast";
import remarkTableToHtml from "../../../../../page/BlogPage/BlogContent/MarkdownRendererV2/remarkTableToHtml";

function runPlugin(tree: Node): Node {
    const transformer = remarkTableToHtml();
    transformer(tree);
    return tree;
}

describe("remarkTableToHtml", () => {
    it("converts markdown table text nodes into html table nodes", () => {
        const tree = {
            type: "root",
            children: [
                {
                    type: "paragraph",
                    children: [
                        {
                            type: "text",
                            value: "| Name | Role |\n| --- | --- |\n| Lu | Engineer |",
                        },
                    ],
                },
            ],
        } as Parent;

        runPlugin(tree);

        const child = (tree.children[0] as Parent).children[0] as any;
        expect(child.type).toBe("html");
        expect(child.value).toContain('<div class="table-wrapper"><table>');
        expect(child.value).toContain('<th style="text-align:left;">Name</th>');
        expect(child.value).toContain(
            '<td style="text-align:left;">Engineer</td>',
        );
    });

    it("preserves markdown table alignment markers as text alignment styles", () => {
        const tree = {
            type: "root",
            children: [
                {
                    type: "paragraph",
                    children: [
                        {
                            type: "text",
                            value: "| Left | Center | Right |\n| :--- | :---: | ---: |\n| A | B | C |",
                        },
                    ],
                },
            ],
        } as Parent;

        runPlugin(tree);

        const child = (tree.children[0] as Parent).children[0] as any;
        expect(child.value).toContain('<th style="text-align:left;">Left</th>');
        expect(child.value).toContain(
            '<th style="text-align:center;">Center</th>',
        );
        expect(child.value).toContain(
            '<th style="text-align:right;">Right</th>',
        );
    });

    it("leaves non-table text nodes unchanged", () => {
        const tree = {
            type: "root",
            children: [
                {
                    type: "paragraph",
                    children: [{ type: "text", value: "not a table" }],
                },
            ],
        } as Parent;

        runPlugin(tree);

        const child = (tree.children[0] as Parent).children[0] as any;
        expect(child).toEqual({ type: "text", value: "not a table" });
    });
});
