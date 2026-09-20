import { describe, expect, it, vi } from "vitest";

vi.mock("@/page/BlogPage/BlogContent/CodeBlock/CodeBlock", () => ({
    default: ({ filename, children }: any) => `${filename ?? ""}|${children}`,
}));

import customCodeBlockPlugin from "@/utils/BlogPage/BlogContent/MarkdownRendererV2/Plugins/customCodeBlockPlugin";

describe("customCodeBlockPlugin", () => {
    it("converts inline code, code blocks and tables into html nodes.", () => {
        const tree: any = {
            type: "root",
            children: [
                { type: "inlineCode", value: "npm i" },
                { type: "table", children: [] },
                {
                    type: "code",
                    lang: "js",
                    meta: "index.js a=b",
                    value: "const x = 1;",
                },
                { type: "code", lang: "xyz", value: "plain" },
                { type: "code", value: "no language" },
                { type: "code", lang: "js", meta: "", value: "empty meta" },
            ],
        };

        customCodeBlockPlugin()(tree);

        const [inlineCode, , scripted, unknown, noLanguage, emptyMeta] =
            tree.children;
        expect(inlineCode.type).toBe("html");
        expect(inlineCode.value).toContain("<kbd");
        expect(inlineCode.value).toContain("npm i");

        expect(scripted.type).toBe("html");
        expect(scripted.value).toContain("index.js");
        expect(scripted.value).toContain("const x = 1;");

        expect(unknown.type).toBe("html");
        expect(unknown.value).toContain("plain");

        expect(noLanguage.type).toBe("html");
        expect(noLanguage.value).toContain("no language");

        expect(emptyMeta.type).toBe("html");
        expect(emptyMeta.value).toContain("empty meta");
    });
});