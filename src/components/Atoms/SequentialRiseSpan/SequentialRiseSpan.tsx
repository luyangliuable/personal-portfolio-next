import React, {
    ReactElement,
    useState,
    useRef,
    useEffect,
    memo,
    RefObject,
    useCallback,
} from "react";
import { useDebounce } from "../../../hooks";
import "./SequentialRiseSpan.css";

export interface ISequentialRiseSpanProps {
    children: string;
    className?: string;
    elementType?: keyof JSX.IntrinsicElements;
    numberOfLettersPerLine?: number;
    calculationAdjustment?: number;
    minNumberOfLettersPerLine?: number;
    baseAnimationDelay?: number;
    maxNumberOfLettersPerLine?: number;
}

const SequentialRiseSpan: React.FC<ISequentialRiseSpanProps> = ({
    calculationAdjustment,
    children,
    baseAnimationDelay = 0,
    elementType,
    className,
    numberOfLettersPerLine,
    minNumberOfLettersPerLine,
    maxNumberOfLettersPerLine,
}) => {
    const spanItemRef = useRef<HTMLDivElement>(null);
    const [wrappedLines, setWrappedLines] = useState<
        ReactElement<{ key: string | number; className: string }>[]
    >([]);
    const [lineRefs, setLineRefs] = useState<RefObject<any>[]>([]);
    const [measuredLettersPerLine, setMeasuredLettersPerLine] =
        useState<number>(numberOfLettersPerLine ?? 0);

    const calculateLettersPerLine = useCallback(() => {
        // SSR guard
        if (typeof window === "undefined") return;

        const targetElement = spanItemRef.current;

        if (
            numberOfLettersPerLine ||
            measuredLettersPerLine > 0 ||
            !targetElement
        )
            return;

        // Input validation
        if (!children || typeof children !== "string" || children.length === 0) {
            console.warn("SequentialRiseSpan: Invalid children provided");
            return;
        }

        let tempSpan: HTMLSpanElement | null = null;

        try {
            tempSpan = document.createElement("span");
            tempSpan.style.visibility = "hidden";
            tempSpan.style.whiteSpace = "nowrap";
            tempSpan.textContent = children;
            document.body.appendChild(tempSpan);

            const charWidth = tempSpan.offsetWidth / children.length;

            const elementStyle = window.getComputedStyle(targetElement);
            const elementPadding =
                Number.parseFloat(elementStyle.paddingLeft) +
                Number.parseFloat(elementStyle.paddingRight);
            const targetElementWidth =
                targetElement.offsetWidth - elementPadding;
            const adjustment = calculationAdjustment ?? 0.95;

            const calculated = Math.floor(
                (targetElementWidth * adjustment) / charWidth,
            );

            setMeasuredLettersPerLine(Math.max(1, calculated));
        } catch (error) {
            console.error("SequentialRiseSpan: Error calculating letters per line:", error);
        } finally {
            // Guaranteed cleanup
            if (tempSpan && tempSpan.parentNode) {
                tempSpan.remove();
            }
        }
    }, [children, calculationAdjustment, measuredLettersPerLine, numberOfLettersPerLine]);

    const slideUp = (target: Element, observer: IntersectionObserver): void => {
        target.classList.add("slide-up");
        observer.unobserve(target);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting)
                        slideUp(entry.target, observer);
                });
            },
            { threshold: [0.1, 0.5, 1] },
        );

        lineRefs.forEach((ref) => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, [lineRefs]);

    // Debounced resize handler (250ms delay)
    const debouncedCalculate = useDebounce(calculateLettersPerLine, 250);

    useEffect(() => {
        if (!numberOfLettersPerLine) {
            if (measuredLettersPerLine === 0) calculateLettersPerLine();
            window.addEventListener("resize", debouncedCalculate);
        }

        return () => {
            window.removeEventListener("resize", debouncedCalculate);
        };
    }, [numberOfLettersPerLine, debouncedCalculate, calculateLettersPerLine, measuredLettersPerLine]);

    useEffect(() => {
        let currentLine = "";
        let lines: string[] = [];

        if (!numberOfLettersPerLine && !measuredLettersPerLine) return;

        const finalNumber = numberOfLettersPerLine ??
            Math.min(
                Math.max(
                    measuredLettersPerLine,
                    minNumberOfLettersPerLine ?? 0,
                ),
                maxNumberOfLettersPerLine ?? Number.MAX_SAFE_INTEGER,
            );

        String(children)
            .split(" ")
            .forEach((word) => {
                // Handle words longer than line length
                if (word.length > finalNumber) {
                    if (currentLine) {
                        lines.push(currentLine);
                        currentLine = "";
                    }
                    // Split long word into chunks
                    for (let i = 0; i < word.length; i += finalNumber) {
                        lines.push(word.slice(i, i + finalNumber));
                    }
                } else if (
                    (currentLine + (currentLine ? " " : "") + word).length >
                    finalNumber
                ) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine += (currentLine.length > 0 ? " " : "") + word;
                }
            });

        if (currentLine) {
            lines.push(currentLine);
        }

        setLineRefs(lines.map(() => React.createRef<any>()));

        const linesElements = lines.map((line) => {
            return React.createElement(
                elementType || "p",
                {
                    key: line,
                    className: ["invisible", className].join(" "),
                },
                line,
            );
        });

        setWrappedLines(linesElements);
    }, [measuredLettersPerLine, numberOfLettersPerLine, children, className, elementType, minNumberOfLettersPerLine, maxNumberOfLettersPerLine]);

    return (
        <div className="sequential-rise-span" ref={spanItemRef}>
            {measuredLettersPerLine !== 0 &&
                wrappedLines.map((line, index) => {
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
                        <div key={`line-${index}-${line.key}`} className="w-full break-words">
                            {lineElement}
                        </div>
                    );
                })}
        </div>
    );
};

export default memo(SequentialRiseSpan);
