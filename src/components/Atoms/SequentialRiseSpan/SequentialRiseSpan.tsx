import React, {
    ReactElement,
    useState,
    useRef,
    useEffect,
    useCallback,
    memo,
    RefObject,
} from "react";
import {
    layoutWithLines,
    prepareWithSegments,
    type PreparedTextWithSegments,
} from "@chenglou/pretext";
import "./SequentialRiseSpan.css";

export interface ISequentialRiseSpanProps {
    children: string;
    className?: string;
    elementType?: keyof JSX.IntrinsicElements;
    baseAnimationDelay?: number;
    font?: string;
    lineHeight?: number;
}

const DEFAULT_LINE_HEIGHT_RATIO = 1.2;

const SequentialRiseSpan: React.FC<ISequentialRiseSpanProps> = ({
    children,
    baseAnimationDelay = 0,
    elementType,
    className,
    font,
    lineHeight,
}) => {
    const spanItemRef = useRef<HTMLDivElement>(null);
    const preparedRef = useRef<PreparedTextWithSegments | null>(null);
    const preparedKeyRef = useRef<string>("");
    const [wrappedLines, setWrappedLines] = useState<ReactElement[]>([]);
    const [lineRefs, setLineRefs] = useState<RefObject<any>[]>([]);

    const resolveFont = useCallback(
        (element: HTMLElement): string => {
            if (font) return font;

            const style = window.getComputedStyle(element);
            return `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        },
        [font],
    );

    const resolvePrepared = useCallback(
        (element: HTMLElement): PreparedTextWithSegments => {
            const resolvedFont = resolveFont(element);
            const preparedKey = `${children}::${resolvedFont}`;

            if (
                preparedRef.current === null ||
                preparedKeyRef.current !== preparedKey
            ) {
                preparedRef.current = prepareWithSegments(
                    children,
                    resolvedFont,
                );
                preparedKeyRef.current = preparedKey;
            }

            return preparedRef.current;
        },
        [children, resolveFont],
    );

    const measureLines = useCallback(() => {
        const element = spanItemRef.current;

        if (!element) return;

        const style = window.getComputedStyle(element);
        const horizontalPadding =
            parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
        const maxWidth = element.offsetWidth - horizontalPadding;

        if (!Number.isFinite(maxWidth) || maxWidth <= 0) return;

        const resolvedLineHeight =
            lineHeight ??
            (parseFloat(style.lineHeight) ||
                parseFloat(style.fontSize) * DEFAULT_LINE_HEIGHT_RATIO);

        const prepared = resolvePrepared(element);
        const { lines } = layoutWithLines(
            prepared,
            maxWidth,
            resolvedLineHeight,
        );

        setWrappedLines(
            lines.map((line, index) =>
                React.createElement(
                    elementType || "p",
                    {
                        key: index,
                        className: ["invisible", className].join(" "),
                    },
                    line.text,
                ),
            ),
        );
        setLineRefs(lines.map(() => React.createRef<any>()));
    }, [className, elementType, lineHeight, resolvePrepared]);

    useEffect(() => {
        measureLines();
        window.addEventListener("resize", measureLines);

        let cancelled = false;
        const fontsReady = document?.fonts?.ready;
        if (fontsReady) {
            fontsReady.then(() => {
                if (!cancelled) measureLines();
            });
        }

        return () => {
            cancelled = true;
            window.removeEventListener("resize", measureLines);
        };
    }, [measureLines]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("slide-up");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: [0.1, 0.5, 1] },
        );

        lineRefs.forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, [lineRefs]);

    return (
        <div className="sequential-rise-span" ref={spanItemRef}>
            {wrappedLines.map((line, index) => {
                const lineElement = React.cloneElement(
                    line as React.ReactElement,
                    {
                        style: {
                            animationDelay: `${baseAnimationDelay + index * 100}ms`,
                        },
                        ref: lineRefs[index],
                    },
                );
                return (
                    <div key={index} className="w-full break-words">
                        {lineElement}
                    </div>
                );
            })}
        </div>
    );
};

export default memo(SequentialRiseSpan);
