"use client";

import React, {
    CSSProperties,
    useEffect,
    useRef,
    useState,
    useMemo,
} from "react";
import { isoDateFormatToString } from "../../../components/Utility/StringUtility";
import Link from "next/link";
import { cardGradientEffect } from "../../../components/Utility/MouseUtility";
import "./GalleryItem.css";
import IGalleryItemProps from "./Interface/IGalleryItemProps";
import TagCloud from "../../TagCloud/TagCloud";
import DynamicLoadQueue from "../../../stores/DynamicLoadQueue/DynamicLoadQueue";
import Image from "../../Image/Image";
import SequentialRiseSpan from "../../Atoms/SequentialRiseSpan/SequentialRiseSpan";
import { TbToolsOff } from "react-icons/tb";
import { CgWebsite } from "react-icons/cg";
import { truncateTextBody } from "../../Utility/StringUtility";
import { CiTimer, CiCalendar } from "react-icons/ci";
import Contributors from "./Contributors/Contributors";
import { cl } from "../../Utility/LogicUtility";

interface GalleryItemTypeSegmentProps {
    type?: string;
}

const GalleryItemTypeSegment: React.FC<GalleryItemTypeSegmentProps> = ({ type }) => {
    const MemoizedCgWebsite = useMemo(() => <CgWebsite />, []);
    const MemoizedTbToolsOff = useMemo(() => <TbToolsOff />, []);

    if (type === "blog") {
        return (
            <div className="gallery-item__type font-fira-code">
                {MemoizedCgWebsite}
                <span>BLOG</span>
            </div>
        );
    } else if (type === "tool") {
        return (
            <div className="gallery-item__type font-fira-code">
                {MemoizedTbToolsOff}
                <span>TOOL</span>
            </div>
        );
    }

    return <></>;
};

const GalleryItem: React.FC<IGalleryItemProps> = (props) => {
    const galleryItemRef = useRef<HTMLDivElement>(null);
    const dynamicLoadQueue = DynamicLoadQueue.getInstance();

    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isRendered && galleryItemRef.current) {
            dynamicLoadQueue.addToQueue(galleryItemRef.current);
        }
    }, [isRendered, galleryItemRef, dynamicLoadQueue]);

    const style: CSSProperties = props.style || {};
    const { image, className, imageOverlay } = props;

    useEffect(() => {
        setIsRendered(true);
    }, []);

    if (!isRendered) {
        return <></>;
    }

    return (
        <Link
            shallow
            className={cl(
                className,
                "h-full relative w-full flex items-center justify-center",
            )}
            href={props.link ?? ""}
        >
            <div
                style={style}
                ref={galleryItemRef}
                onMouseMove={cardGradientEffect}
                className="card gallery-item initially-hidden blur-boundary--sm"
            >
                <GalleryItemTypeSegment type={props.type} />
                <div className="gallery-item__image flex justify-center items-center">
                    {imageOverlay ? (
                        <>
                            <img alt="" src={imageOverlay} />
                            <Image
                                isLazyLoading={false}
                                compression={30}
                                alt=""
                                src={image ?? ""}
                            />
                        </>
                    ) : (
                        <Image
                            isLazyLoading={false}
                            compression={30}
                            alt=""
                            src={image ?? ""}
                        />
                    )}
                </div>
                <div className="px-5">
                    <TagCloud tags={props.tags} />
                    <div className="gallery-item__link">
                        <h3 className="font-bold">{props.name}</h3>
                    </div>
                    <p>{props.subheading}</p>
                    {props.description && (
                        <div className="w-full box-border">
                            <SequentialRiseSpan
                                minNumberOfLettersPerLine={42}
                                calculationAdjustment={0.50}
                            >
                                {truncateTextBody(props.description, 200)}
                            </SequentialRiseSpan>
                        </div>
                    )}
                </div>
                {(props.minuteRead || props.dateCreated || props.metadata) && (
                    <p className="absolute gallery-item__metadata flex">
                        {props.minuteRead && (
                            <span className="flex items-center">
                                <CiTimer /> {props.minuteRead} min read
                            </span>
                        )}
                        {props.dateCreated && (
                            <span className="flex items-center">
                                <CiCalendar />{" "}
                                {isoDateFormatToString(
                                    new Date(props.dateCreated),
                                )}
                            </span>
                        )}
                        {props.metadata?.map((item, idx) => {
                                const keyValue = typeof item.value === 'string' || typeof item.value === 'number'
                                    ? item.value
                                    : `metadata-${idx}`;
                                return (
                                    <span
                                        key={keyValue}
                                        className="flex items-center"
                                    >
                                        {item.icon}
                                        {item.callback?.(item.value) ?? item.value}
                                    </span>
                                );
                            })}
                    </p>
                )}
                {props.repoOwner && props.repoName && (
                    <Contributors
                        repoOwner={props.repoOwner}
                        repoName={props.repoName}
                    />
                )}
            </div>
        </Link>
    );
};

export default GalleryItem;
