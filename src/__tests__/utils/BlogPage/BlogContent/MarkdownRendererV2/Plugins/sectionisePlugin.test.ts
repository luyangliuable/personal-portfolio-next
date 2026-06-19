import { describe, expect, it } from "vitest";
import sectionisePlugin from "../../../../../../utils/BlogPage/BlogContent/MarkdownRendererV2/Plugins/sectionisePlugin";

const heading = (depth: number, value: string) => ({
    type: "heading",
    depth,
    children: [{ type: "text", value }],
});

describe("sectionisePlugin", () => {
    it("wraps headings and following content into section nodes", () => {
        const tree = {
            type: "root",
            children: [
                heading(1, "Intro"),
                { type: "paragraph", children: [] },
            ],
        };

        sectionisePlugin()(tree);

        expect(tree.children[0]).toMatchObject({
            type: "section",
            depth: 1,
            data: {
                hName: "section",
                hProperties: { className: "blog-section--root" },
            },
        });
        expect((tree.children[0] as any).children).toHaveLength(2);
    });

    it("hides table of contents sections and stops at the next heading", () => {
        const tree = {
            type: "root",
            children: [
                heading(2, "Table of Contents"),
                { type: "paragraph", children: [] },
                heading(2, "Next"),
            ],
        };

        sectionisePlugin()(tree);

        expect(tree.children[0]).toMatchObject({
            type: "section",
            data: { hProperties: { className: "hidden" } },
        });
        expect((tree.children[0] as any).children).toHaveLength(2);
        expect(tree.children[1]).toMatchObject({ type: "section", depth: 2 });
    });
});
