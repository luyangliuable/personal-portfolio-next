import "../SequentialRiseSpan/SequentialRiseSpan.css";
import { ISequentialRiseSpanProps } from "../SequentialRiseSpan/SequentialRiseSpan";
import React from "react";

const SequentialRiseSpan2: React.FC<ISequentialRiseSpanProps> = ({
    children,
    elementType = "p",
    wordsPerAnimation = 5,
    animationDelayMiliseconds = 70,
    className
}) => {

    const setWrappedLines = () => {
        const lines = String(children).split(" ");

        const lumpedLines: string[] = [];

        let currentLine = '';

        lines.forEach((word) => {
            const space = currentLine ? ' ' : '';
            if ((currentLine + space + word).split(" ").length > wordsPerAnimation) {
                lumpedLines.push(currentLine);
                currentLine = word;
            } else {
                currentLine += (currentLine.length > 0 ? ' ' : '') + word;
            }
        })

        if (currentLine) {
            lumpedLines.push(currentLine);
        }

        const lineElements = lumpedLines.map((line, index) => {
            const content = line + "\u00A0";
            const LineElement = React.createElement(
                'span',
                {
                    key: index,
                    style: { animationDelay: `${index * animationDelayMiliseconds}ms`},
                    className: ["visible-hidden", "slide-up"].join(" ")
                },
                content
            );
            return LineElement;
        });

        return lineElements;
    };

    const lineElements = setWrappedLines();

    return (
        <div className="sequential-rise-span">
            {
                React.createElement(
                    elementType,
                    { className: className },
                    lineElements.map((line, _) => {
                        return line
                    })
                )
            }
        </div>
    )
};

export default SequentialRiseSpan2;
