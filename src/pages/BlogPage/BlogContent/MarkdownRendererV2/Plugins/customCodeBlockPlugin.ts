import { visit } from 'unist-util-visit';
import CodeBlock from '../../CodeBlock/CodeBlock';
import ReactDOMServer from 'react-dom/server';
import React from "react";


function customCodeBlockPlugin() {
    const languageMap: { [category: string]: string } = {
        "sh": "bash",
        "rs": "rust",
        "js": "javascript",
        "py": "python"
    }

    return (tree: any) => {
        visit(tree, 'inlineCode', (node) => {
            node.type = 'html';
            node.value = `<kbd style="background: #E3E3E3; font-weight: 500; border: .2px solid #CCC; padding: 2px; font-size: 1rem; border-radius: 4px; color: #491ed3">${node.value}</kbd>`;
        });

        visit(tree, 'table', (node) => {
            console.log(node)
        });

        visit(tree, 'code', node => {
            let language: string = node.lang || 'unknown';

            const getMetadataKeyValPairs = (metadata: string) => {
                const regexPattern = /([\w\.]+)=([\w\.\-\/\d]+)/g;
                const keyValuePairs: string[] = [];
                let match: RegExpExecArray;
                while ((match = regexPattern.exec(metadata)) !== null) {
                    if (!/app\.js/.test(match[1])) {
                        keyValuePairs.push(match[0]);
                    }
                }

                return keyValuePairs;
            }

            const getMetaDataFileName = (metadata: string) => {
                const codeblocktitleregex = /^[\w.]+(?!\w*=)\b/g;
                const result = codeblocktitleregex.exec(metadata);
                if (result !== null) return result[0];
                return ""
            }

            if (Object.keys(languageMap).includes(language)) language = languageMap[language];

            node.type = 'html';

            node.value = ReactDOMServer.renderToString(React.createElement(CodeBlock, {
                "filename": getMetaDataFileName(node.meta) ?? ""
            }, node.value));
        });
    };
}

export default customCodeBlockPlugin;
