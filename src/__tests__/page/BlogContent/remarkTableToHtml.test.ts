import { describe, expect, it } from "vitest";
import { remark } from "remark";
import html from "remark-html";
import remarkTableToHtml from "@/page/BlogPage/BlogContent/MarkdownRendererV2/remarkTableToHtml";

describe("remarkTableToHtml", () => {
    it("converts markdown table text into aligned HTML table markup.", async () => {
        const markdown = "| Name | Score |\n| :--- | ---: |\n| Ada | 10 |";
        const file = await remark()
            .use(remarkTableToHtml as any)
            .use(html, { sanitize: false })
            .process(markdown);
        const result = String(file);
        expect(result).toContain('<div class="table-wrapper"><table>');
        expect(result).toContain('<th style="text-align:left;">Name</th>');
        expect(result).toContain('<th style="text-align:right;">Score</th>');
        expect(result).toContain('<td style="text-align:right;">10</td>');
    });

    it("leaves non-table text untouched.", async () => {
        const file = await remark()
            .use(remarkTableToHtml as any)
            .use(html)
            .process("Plain text");
        expect(String(file)).toContain("<p>Plain text</p>");
    });
});
