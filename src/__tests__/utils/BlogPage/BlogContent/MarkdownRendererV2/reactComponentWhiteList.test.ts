import { describe, expect, it } from "vitest";
import reactComponentWhiteList from "@/utils/BlogPage/BlogContent/MarkdownRendererV2/reactComponentWhiteList";
import Image from "@/components/Image/Image";
import CodeBlock from "@/page/BlogPage/BlogContent/CodeBlock/CodeBlock";
import BlogNote from "@/page/BlogPage/BlogContent/BlogNote/BlogNote";
import BlogWarning from "@/page/BlogPage/BlogContent/BlogWarning/BlogWarning";

describe("reactComponentWhiteList", () => {
    it("maps markdown tags to their React components.", () => {
        expect(reactComponentWhiteList).toMatchObject({
            img: Image,
            note: BlogNote,
            warn: BlogWarning,
            bbb: CodeBlock,
        });
    });
});