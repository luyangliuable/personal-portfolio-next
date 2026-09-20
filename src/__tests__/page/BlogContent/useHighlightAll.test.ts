import { describe, expect, it, vi } from "vitest";

const highlightAll = vi.hoisted(() => vi.fn());
vi.mock("prismjs", () => ({ default: { highlightAll } }));

import useHighlightAll from "@/page/BlogPage/BlogContent/MarkdownRendererV2/useHighlightAll";

describe("useHighlightAll", () => {
    it("delegates to Prism.highlightAll.", () => {
        useHighlightAll();
        expect(highlightAll).toHaveBeenCalledTimes(1);
    });
});