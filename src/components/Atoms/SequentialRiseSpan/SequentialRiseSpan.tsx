import React, { useState, useRef, useEffect, memo } from "react";
import { measureNaturalWidth, prepare } from "@chenglou/pretext";
import "./SequentialRiseSpan.css";

export interface ISequentialRiseSpanProps {
    children: string;
    className?: string;
    elementType?: keyof JSX.IntrinsicElements;
    wordsPerAnimation?: number;
    animationDelayMiliseconds?: number;
    baseAnimationDelay?: number;
}

const LINE_WRAPPER_CLASS = "w-full break-words";

const lineClassName = (className?: string) =>
    ["invisible", className].join(" ");

/** Resolved px value of a computed length, or the fallback for auto/none. */
const pixels = (value: string, fallback: number) =>
    value.endsWith("px") ? parseFloat(value) : fallback;

/**
 * Reads the font a line will render with by mounting a hidden line in the
 * same position, so caller and component CSS both apply.
 */
const readLineStyle = (
    container: HTMLElement,
    elementType: string,
    className?: string,
) => {
    const wrapper = document.createElement("div");
    wrapper.className = LINE_WRAPPER_CLASS;
    wrapper.style.position = "absolute";
    wrapper.style.visibility = "hidden";
    const probe = document.createElement(elementType);
    probe.className = lineClassName(className);
    wrapper.appendChild(probe);
    container.appendChild(wrapper);

    const style = window.getComputedStyle(probe);
    const lineStyle = {
        font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
        letterSpacing: parseFloat(style.letterSpacing) || 0,
        minWidth: pixels(style.minWidth, 0),
        maxWidth: pixels(style.maxWidth, Infinity),
        wraps: style.whiteSpace !== "nowrap" && style.whiteSpace !== "pre",
    };
    container.removeChild(wrapper);
    return lineStyle;
};

/** Layout width, unaffected by transforms such as scaled timeline cards. */
const contentWidth = (element: HTMLElement) => {
    const style = window.getComputedStyle(element);
    const width = parseFloat(style.width);
    if (style.boxSizing !== "border-box") return width;
    return (
        width -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight) -
        parseFloat(style.borderLeftWidth) -
        parseFloat(style.borderRightWidth)
    );
};

/** Content width the span gets when its own lines don't hold it open. */
const availableWidth = (container: HTMLElement) => {
    const lines = Array.from(container.children) as HTMLElement[];
    lines.forEach((line) => (line.style.display = "none"));
    const width = contentWidth(container);
    lines.forEach((line) => line.style.removeProperty("display"));
    return width;
};

interface IMeasuredWords {
    words: string[];
    widths: number[];
    spaceWidth: number;
}

/** Measures every space-separated word once, so resizing is arithmetic. */
const measureWords = (
    text: string,
    font: string,
    letterSpacing: number,
): IMeasuredWords => {
    const widthOf = (value: string) =>
        value
            ? measureNaturalWidth(prepare(value, font, { letterSpacing }))
            : 0;
    const words = text.split(" ");
    return {
        words,
        widths: words.map(widthOf),
        spaceWidth: widthOf("a a") - 2 * widthOf("a"),
    };
};

/**
 * Greedy wrapping that only breaks at spaces, so words are never split.
 * Trailing spaces hang past the edge like CSS, so they never force a break.
 */
const breakLines = (
    { words, widths, spaceWidth }: IMeasuredWords,
    maxWidth: number,
): string[] => {
    const lines: string[] = [];
    let line = words[0];
    let lineWidth = widths[0];

    for (let index = 1; index < words.length; index++) {
        const word = words[index];
        const candidateWidth = lineWidth + spaceWidth + widths[index];
        if (line && word && candidateWidth > maxWidth) {
            lines.push(line);
            line = word;
            lineWidth = widths[index];
        } else if (line) {
            line = `${line} ${word}`;
            lineWidth = candidateWidth;
        } else {
            line = word;
            lineWidth = widths[index];
        }
    }

    lines.push(line);
    return lines;
};

const SequentialRiseSpan: React.FC<ISequentialRiseSpanProps> = ({
    children,
    baseAnimationDelay = 0,
    elementType,
    className,
}) => {
    const spanItemRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLElement | null)[]>([]);
    const [lines, setLines] = useState<string[]>([]);

    const slideUp = (target: Element, observer: any): void => {
        target.classList.add("slide-up");
        observer.unobserve(target);
    };

    useEffect(() => {
        const addIntersectionObserver = () => {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting)
                            slideUp(entry.target, observer);
                    });
                },
                { threshold: [0.1, 0.5, 1] },
            );

            lineRefs.current.slice(0, lines.length).forEach((line) => {
                if (line) observer.observe(line);
            });

            return observer;
        };

        const observer = addIntersectionObserver();
        return () => observer.disconnect();
    }, [lines]);

    useEffect(() => {
        const container = spanItemRef.current;
        if (!container) return;

        const text = String(children);
        if (!text) return;
        let cancelled = false;

        // Like the estimate it replaces, this reads the layout on mount while
        // the span is still empty, so content-sized parents don't feed back.
        const readStyle = () =>
            readLineStyle(container, elementType || "p", className);
        let lineStyle = readStyle();
        const mountWidth = availableWidth(container);
        // Lines wrap at the width CSS would give them in this span: its
        // content width, clamped by the lines' own min-width and max-width.
        const wrapWidth = (available: number) =>
            Math.max(
                lineStyle.minWidth,
                Math.min(available, lineStyle.maxWidth),
            );
        let wrappedAt = Infinity;
        let words: IMeasuredWords | null = null;
        let resizeObserver: ResizeObserver | undefined;

        // Space can shrink after mount, e.g. once a sibling graphic sizes
        // itself. Re-wrap only then, so lines never overflow; when lines
        // still fit, wrapping again gives the same lines.
        const rewrapIfNarrower = () => {
            const width = wrapWidth(availableWidth(container));
            if (!words || width >= wrappedAt) return;
            wrappedAt = width;
            setLines(breakLines(words, width));
        };

        const measure = () => {
            if (cancelled) return;
            if (!lineStyle.wraps) {
                setLines([text]);
                return;
            }
            try {
                const { font, letterSpacing } = lineStyle;
                words = measureWords(text, font, letterSpacing);
            } catch {
                // No canvas text measurement here: show the text as one line.
                setLines([text]);
                return;
            }
            // ch lengths depend on the font, so read them again once it has loaded.
            lineStyle = readStyle();
            wrappedAt = wrapWidth(mountWidth);
            setLines(breakLines(words, wrappedAt));
            if (typeof ResizeObserver === "undefined") return;
            resizeObserver = new ResizeObserver(rewrapIfNarrower);
            resizeObserver.observe(container);
        };

        // Web fonts only download once used, and nothing has rendered this
        // font yet, so load it first or the fallback font gets measured.
        if (document.fonts)
            document.fonts.load(lineStyle.font, text).then(measure, measure);
        else measure();

        return () => {
            cancelled = true;
            resizeObserver?.disconnect();
        };
    }, [children, elementType, className]);

    return (
        <div className="sequential-rise-span" ref={spanItemRef}>
            {lines.map((line, index) => (
                <div key={index} className={LINE_WRAPPER_CLASS}>
                    {React.createElement(
                        elementType || "p",
                        {
                            className: lineClassName(className),
                            style: {
                                animationDelay: `${baseAnimationDelay + index * 100}ms`,
                            },
                            ref: (element: HTMLElement | null) => {
                                lineRefs.current[index] = element;
                            },
                        },
                        line,
                    )}
                </div>
            ))}
        </div>
    );
};

export default memo(SequentialRiseSpan);
