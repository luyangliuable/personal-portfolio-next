import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CodeBlock from "@/page/BlogPage/BlogContent/CodeBlock/CodeBlock";

vi.mock("react-icons/fa", () => ({ FaRegCopy: () => <span>copy</span> }));
vi.mock("prismjs", () => ({ default: { highlightAll: vi.fn() } }));
vi.mock("prismjs/components/prism-jsx", () => ({}));
vi.mock("prismjs/components/prism-javascript", () => ({}));
vi.mock("prismjs/components/prism-bash", () => ({}));
vi.mock("prismjs/components/prism-python", () => ({}));
vi.mock("prismjs/components/prism-nginx", () => ({}));
vi.mock("prismjs/components/prism-rust", () => ({}));
vi.mock("prismjs/components/prism-toml", () => ({}));
vi.mock("prismjs/components/prism-lisp", () => ({}));

describe("CodeBlock", () => {
    beforeEach(() => vi.clearAllMocks());

    it("maps shorthand languages and removes a leading newline.", () => {
        const { container } = render(
            <CodeBlock lang="py">{"\nprint('hi')"}</CodeBlock>,
        );
        const code = container.querySelector("code") as HTMLElement;
        expect(code).toHaveClass("language-python");
        expect(code).toHaveTextContent("print('hi')");
        expect(code.textContent?.startsWith("\n")).toBe(false);
    });

    it("copies cleaned code and offsets blocks that include a filename.", async () => {
        const writeText = vi.spyOn(navigator.clipboard, "writeText");
        const { container } = render(
            <CodeBlock lang="rs" filename="main.rs">
                {"fn main() {}"}
            </CodeBlock>,
        );
        fireEvent.click(screen.getByText("copy").parentElement as HTMLElement);
        expect(writeText).toHaveBeenCalledWith("fn main() {}");
        expect(container.querySelector("code")).toHaveClass("language-rust");
        await waitFor(() =>
            expect(container.firstElementChild).toHaveStyle({
                marginTop: "50px",
            }),
        );
        expect(screen.getByText("main.rs")).toHaveClass(
            "code-block--file-name",
        );
    });

    it("uses the JavaScript fallback class when no language is provided.", () => {
        const { container } = render(<CodeBlock>const a = 1;</CodeBlock>);
        expect(container.querySelector("code")).toHaveClass("language-js");
    });
});
