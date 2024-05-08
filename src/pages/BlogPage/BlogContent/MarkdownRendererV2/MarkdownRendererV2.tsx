import React, { useEffect, useState } from 'react';
import html from 'remark-html';
import Prism from "prismjs";
import DOMPurify from "dompurify";
import { extractAttributesFromHtmlElement } from "./utils/utils";
import { remark } from 'remark';
import { sectionise, customCodeBlock } from "./Plugins";
import "./MarkdownRenderer.css";
import 'prismjs/components';
import reactComponentWhiteList from "./reactComponentWhiteList";
import remarkTableToHtml from './remarkTableToHtml';

type MarkdownRendererProps = {
    markdown: string;
};


const ReactBlogElement = (htmlString: string): JSX.Element => {

    const processNodesIntoReactElement = (node: any): any => {
        if (node.nodeType === Node.TEXT_NODE) return node.textContent;
        if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toLowerCase();
            const attributes = extractAttributesFromHtmlElement(node);
            if (reactComponentWhiteList[tagName]) {
                const Component = reactComponentWhiteList[tagName];
                const children = Array.from(node.childNodes).map(processNodesIntoReactElement);
                return React.createElement(Component, attributes, ...children);
            }
            return React.createElement(
                tagName,
                attributes,
                ...Array.from(node.childNodes).map(processNodesIntoReactElement)
            );
        }
        return node.outerHTML;
    };

    const container = document.createElement('div');
    container.innerHTML = DOMPurify.sanitize(htmlString);
    const elements = Array.from(container.childNodes).map(processNodesIntoReactElement);
    return (
        <>
            {
                elements.map((el, index) => {
                    const key = typeof el + index;
                    return typeof el === 'string'
                        ? React.createElement('div', { dangerouslySetInnerHTML: { __html: el }, key: key })
                        : React.cloneElement(el, { key: key });
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
            setRenderedContent(ReactBlogElement(String(file)));
        }
        return;
    };

    useEffect(() => {
        const filteredMarkdown = markdown.split('\n')
            .filter(line => !/^#[^#]/.test(line))
            .join('\n');

        remark()
            .use(remarkTableToHtml as any)
            .use(customCodeBlock)
            .use(html, { sanitize: false })
            .use(sectionise)
            .process(filteredMarkdown, processCallback)
    }, [markdown]);


    useEffect(() => {
        Prism.highlightAll();
    }, [renderedContent]);

    return (
        <>{renderedContent}</>
    );
};

export default MarkdownRendererV2;
