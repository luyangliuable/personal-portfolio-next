import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MarkdownRendererV2 from "@/page/BlogPage/BlogContent/MarkdownRendererV2/MarkdownRendererV2";

vi.mock("prismjs", () => ({ default: { highlightAll: vi.fn() } }));
vi.mock("prismjs/components/prism-javascript", () => ({}));
vi.mock("prismjs/components/prism-bash", () => ({}));
vi.mock("prismjs/components/prism-python", () => ({}));
vi.mock("prismjs/components/prism-nginx", () => ({}));
vi.mock("prismjs/components/prism-rust", () => ({}));
vi.mock("prismjs/components/prism-toml", () => ({}));
vi.mock("prismjs/components/prism-lisp", () => ({}));
vi.mock(
    "@/utils/BlogPage/BlogContent/MarkdownRendererV2/reactComponentWhiteList",
    () => ({
        default: {
            note: ({ children }: any) => (
                <aside data-testid="note">{children}</aside>
            ),
            warn: ({ children }: any) => (
                <aside data-testid="warn">{children}</aside>
            ),
        },
    }),
);

describe("MarkdownRendererV2", () => {
    it("filters root headings and renders markdown, inline code, and whitelisted HTML.", async () => {
        render(
            <MarkdownRendererV2
                markdown={"# Hidden\n## Shown\nUse `key`.\n<note>Info</note>"}
            />,
        );
        expect(await screen.findByText("Shown")).toBeInTheDocument();
        expect(screen.queryByText("Hidden")).not.toBeInTheDocument();
        expect(screen.getByText("key").tagName.toLowerCase()).toBe("kbd");
        expect(screen.getByTestId("note")).toHaveTextContent("Info");
    });

    it("maps fenced code language aliases and strips generated table-of-contents text.", async () => {
        const markdown =
            "**Table of Contents**\n- Remove me\n\n```py\nprint({})\n```";
        const { container } = render(
            <MarkdownRendererV2 markdown={markdown} />,
        );
        await waitFor(() =>
            expect(container.querySelector("code")).toBeInTheDocument(),
        );
        expect(screen.queryByText(/Remove me/)).not.toBeInTheDocument();
        expect(container.querySelector("code")).toHaveClass("language-python");
        expect(container.querySelector("code")).toHaveTextContent("print({})");
    });

    it("maps every supported fenced code language alias.", async () => {
        const markdown =
            "```sh\necho ok\n```\n```rs\nfn main()\n```\n```js\nconst x = 1\n```\n```go\nfmt.Println()\n```";
        const { container } = render(
            <MarkdownRendererV2 markdown={markdown} />,
        );
        await waitFor(() =>
            expect(container.querySelectorAll("code")).toHaveLength(4),
        );
        expect(container.querySelector(".language-bash")).toBeInTheDocument();
        expect(container.querySelector(".language-rust")).toBeInTheDocument();
        expect(
            container.querySelector(".language-javascript"),
        ).toBeInTheDocument();
        expect(container.querySelector(".language-go")).toBeInTheDocument();
    });
});
