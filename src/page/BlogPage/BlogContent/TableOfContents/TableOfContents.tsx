import ItableOfContentsProps from "../../../../interfaces/BlogPage/BlogContent/TableOfContents/ItableOfContentsProps";
import {
    useEffect,
    useState,
    useRef,
    createRef,
    cloneElement,
    type RefObject,
} from "react";
import {
    stringToHash,
    removeHashesAndStripWhitespace,
    removeTextInsideAngleBrackets,
    convertHtmlEntities,
} from "../../../../components/Utility/StringUtility";
import "./TableOfContents.css";
import { cl } from "../../../../components/Utility/LogicUtility";

const TableOfContents: React.FC<ItableOfContentsProps> = (props) => {
    const [tocEntries, setTocEntries] = useState<JSX.Element[] | null>(null);
    const [tocEntryRef, setTocEntryRef] = useState<RefObject<HTMLElement>[]>(
        [],
    );
    const [listenTocItems, setlistenTocItems] = useState<Set<string>>(
        new Set(),
    );
    const [lastPathInfo, setLastPathInfo] = useState<{
        lastPathStart: number;
        lastPathEnd: number;
    }>({
        lastPathStart: 0,
        lastPathEnd: 0,
    });
    const tocMarkerPathRef: RefObject<SVGPathElement> = useRef(null);

    useEffect(() => {
        renderTableOfContents();
    }, [props.headings]);

    useEffect(() => {
        listenSections();
    }, [tocEntries, props.emitter]);

    const handleClick = (
        _event: React.MouseEvent<HTMLButtonElement>,
        id: string,
    ) => {
        const allBlogSections = Array.from(
            document.querySelectorAll(".blog-section"),
        );
        const targetElement = allBlogSections.find(
            (section) => section.id === id,
        );
        if (targetElement)
            targetElement.scrollIntoView({
                block: "start",
                behavior: "smooth",
            });
    };

    const renderTableOfContents = (): void => {
        const getTextColor = (level: number): string => {
            const lightness = level * 20;
            return `hsl(0, 0%, ${lightness}%)`;
        };
        const subheadings = props.headings?.filter(({ level }) => level !== 0);
        const renderedSubHeadings = subheadings?.map(
            ({ title, level }, idx: number) => {
                if (level === 1) title = "";
                const indentation = `${Math.max(level - 2, 0) * 20}px`;
                const marginBottom =
                    idx === 0 ? "0px" : `${(22 - 4.5 * level) / 2}px`;
                const color = getTextColor(level);
                const id = stringToHash(title);
                const className = `level-${level - 2} section-toc-entry flex items-center`;
                const titleId = `${id}-${idx}`;
                return (
                    <button
                        key={titleId}
                        id={id.toString()}
                        className={className}
                        style={{
                            color,
                            margin: `${marginBottom} ${indentation}`,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            textAlign: "left",
                            width: "100%",
                        }}
                        onClick={(e) => handleClick(e, id.toString())}
                    >
                        {convertHtmlEntities(
                            removeTextInsideAngleBrackets(
                                removeHashesAndStripWhitespace(title),
                            ),
                        )}
                    </button>
                );
            },
        );
        if (renderedSubHeadings) {
            setTocEntries(renderedSubHeadings);
            setTocEntryRef(renderedSubHeadings.map(() => createRef<any>()));
        }
    };

    const drawPath = () => {
        const tocPath = tocMarkerPathRef.current;
        if (!tocPath) return;
        if (!tocEntries) return;
        const path: any[] = [];
        let height = 0,
            indent = 10,
            baseIndent = 10,
            indentOffset = 20,
            heightEach = 20,
            startHeight = 56,
            startIdx = -1,
            endIdx = -1,
            pathStart = 0,
            pathEnd = 0;
        tocEntries.forEach((entry, idx) => {
            if (entry.props.className.includes("active")) {
                if (startIdx === -1) startIdx = idx;
                endIdx = idx;
            }
        });
        path.push("M", indent, startHeight);
        height = startHeight;
        tocEntries.forEach((entry, idx) => {
            const tocEntryCurrent = tocEntryRef[idx]?.current;
            if (!tocEntryCurrent) return;
            const computedStyle = globalThis.getComputedStyle(tocEntryCurrent);
            const extra =
                Number.parseFloat(computedStyle.height) +
                Number.parseFloat(computedStyle.marginBottom) * 2;
            if (idx < startIdx) pathStart += extra;
            const { className } = entry.props;
            const match = className.match(/level-(\d+)/);
            if (match) {
                const level = match[1];
                const expectedIdent = baseIndent + level * indentOffset;
                if (indent !== expectedIdent) {
                    indent = expectedIdent;
                    path.push("L", indent, height);
                    if (idx <= endIdx) pathEnd += heightEach;
                    if (idx < startIdx) pathStart += heightEach;
                }
                if (idx <= endIdx) pathEnd += extra;
                path.push("L", indent, height + extra);
                height += extra;
            }
        });
        const { lastPathStart, lastPathEnd } = lastPathInfo;
        if (pathStart !== lastPathStart || pathEnd !== lastPathEnd) {
            if (startIdx === -1) tocPath.setAttribute("opacity", "0");
            const pathString = path.join(" ");
            const pathLength = tocPath.getTotalLength();
            tocPath.setAttribute("d", pathString);
            tocPath.setAttribute("stroke-dashoffset", "1");
            tocPath.setAttribute(
                "stroke-dasharray",
                `0, ${pathStart}, ${pathEnd - pathStart}, ${pathLength === 0 ? 1000 : pathLength}`,
            );
            tocPath.setAttribute("opacity", "1");
            setLastPathInfo({
                lastPathStart: pathStart,
                lastPathEnd: pathEnd,
            });
        }
    };
    useEffect(() => {
        if (tocEntries === null) return;
        drawPath();
    }, [tocEntries]);
    const updateTocEntryActiveState = (
        tocEntry: JSX.Element,
        intersectingIds: string[],
    ): JSX.Element => {
        const prevClassName = tocEntry.props.className.replace("active", "");
        if (intersectingIds.includes(tocEntry.props.id)) {
            return cloneElement(tocEntry, {
                className: `${prevClassName} active`,
            });
        }
        return cloneElement(tocEntry, {
            className: prevClassName,
        });
    };

    const handleIntersectingSections = (intersectingIds: string[]): void => {
        setTocEntries(
            (prev) =>
                prev?.map((tocEntry) =>
                    updateTocEntryActiveState(tocEntry, intersectingIds),
                ) ?? null,
        );
    };

    function listenSections(): void {
        if (tocEntries === null || props.emitter === undefined) return;
        if (listenTocItems.has("intersectingSectionsListener")) return;
        props.emitter.on("intersectingSections", handleIntersectingSections);
        setlistenTocItems((prev) =>
            new Set(prev).add("intersectingSectionsListener"),
        );
    }

    return (
        <div className={cl("table-of-contents", props.className)}>
            <div className="mb-2 w-full">
                <h2 className="font-bold mb-2 pb-1 border-b border-gray-300 w-full">
                    Table of Contents
                </h2>
            </div>
            {tocEntries?.map((entry, index) => {
                const entryId = `${entry.props.id || "entry"}-${index}`;
                return cloneElement(entry, {
                    ref: tocEntryRef[index],
                    key: entryId,
                });
            })}
            <svg
                className="toc-marker"
                width="200"
                height="200"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    ref={tocMarkerPathRef}
                    stroke="#444"
                    strokeWidth="3"
                    fill="transparent"
                    strokeLinecap="round"
                    strokeDasharray="0, 0, 0, 1000"
                    strokeLinejoin="round"
                    transform="translate(-0.5, -0.5)"
                />
            </svg>
        </div>
    );
};

export default TableOfContents;
