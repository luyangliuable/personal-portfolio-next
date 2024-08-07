import React, { useEffect, useState } from 'react';
import { remark } from 'remark';
import { visit } from 'unist-util-visit';
import html from 'remark-html';
import Prism from "prismjs";
import { extractAttributesFromHtmlElement } from "../../../../utils/BlogPage/BlogContent/MarkdownRendererV2/utils";
import sectionise from "../../../../utils/BlogPage/BlogContent/MarkdownRendererV2/Plugins/sectionisePlugin";
import reactComponentWhiteList from "../../../../utils/BlogPage/BlogContent/MarkdownRendererV2/reactComponentWhiteList";
import "./MarkdownRenderer.css";

import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-nginx';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-toml';
import 'prismjs/components/prism-lisp';
import remarkTableToHtml from './remarkTableToHtml';


type MarkdownRendererProps = {
    markdown: string;
};

function customCodeBlockPlugin() {
    return (tree: any) => {
        visit(tree, 'inlineCode', (node) => {
            node.type = 'html';
            node.value = `<kbd style="background: #E3E3E3; font-weight: 500; border: .2px solid #CCC; padding: 2px; font-size: 1rem; border-radius: 4px; color: #491ed3">${node.value}</kbd>`;
        });

        visit(tree, 'code', (node) => {
            let language = node.lang || 'unknown';
            const escapedCode = node.value.replace(/{/g, '&#123;').replace(/}/g, '&#125;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            if (language === "sh") {
                language = "bash";
            } else if (language === "rs") {
                language = "rust";
            } else if (language === "js") {
                language = "javascript";
            } else if (language === "py") {
                language = "python";
            }
            node.type = 'html';
            node.value = `<div class="code-block--native__container"><pre class="code-block--native"><code class="language-${language}">${escapedCode}</code></pre></div>`;
        });
    };
}

const processNodes = (node: any): any => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;

    if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        const attributes = extractAttributesFromHtmlElement(node);

        if (reactComponentWhiteList[tagName]) {
            const Component = reactComponentWhiteList[tagName];
            const children = Array.from(node.childNodes).map(processNodes);
            return React.createElement(Component, attributes, ...children);
        }

        return React.createElement(
            tagName,
            attributes,
            ...Array.from(node.childNodes).map(processNodes)
        );
    }

    return node.outerHTML;
};

const convertHtmlToReact = (htmlString: string): JSX.Element => {
    const container = document.createElement('div');
    container.innerHTML = htmlString;
    const elements = Array.from(container.childNodes).map(processNodes);
    console.log(elements);
    return (
        <>
            {
                elements.map((el, index) => {
                    const key = typeof el + index;
                    return typeof el === "string"
                        ? React.createElement("div", { dangerouslySetInnerHTML: { __html: el }, key: key })
                        : React.cloneElement(el ?? "div", { key: key });
                })
            }
        </>
    );
};


const MarkdownRendererV2: React.FC<MarkdownRendererProps> = ({ markdown }) => {
    const [renderedContent, setRenderedContent] = useState<JSX.Element | null>(null);

    const processCallback = (err: any, file: any): undefined => {
        if (err) {
            console.error(err);
        } else {
            setRenderedContent(convertHtmlToReact(String(file)));
        }
        return;
    };

    function filterMarkdown(text: string): string {
        // Regular expression to match the Table of Contents section
        const tocRegex = /\*\*Table of Contents\*\*\n(?:\s*-\s[^\n]*\n)+/g;

        // Replace the Table of Contents section with an empty string
        let filteredText = text.replace(tocRegex, '');

        // Regular expression to remove * characters from text surrounded by |
        const asteriskRegex = /\|([^\|]*)\|/g;

        // Replace * characters within |...| blocks
        filteredText = filteredText.replace(asteriskRegex, (match, p1) => {
            return `|${p1.replace(/\*/g, '')}|`;
        });

        return filteredText;
    }

    useEffect(() => {

        const filteredMarkdown = filterMarkdown(markdown.split('\n')
            .filter(line => !/^#[^#]/.test(line) && !/^<!.*>/.test(line))
            .join('\n'));

        remark()
            .use(remarkTableToHtml as any)
            .use(customCodeBlockPlugin)
            .use(html, { sanitize: false })
            .use(sectionise)
            .process(filteredMarkdown, processCallback)
    }, [markdown]);


    useEffect(() => {
        Prism.highlightAll();
    }, [renderedContent]);

    return renderedContent;
};

export default MarkdownRendererV2;
