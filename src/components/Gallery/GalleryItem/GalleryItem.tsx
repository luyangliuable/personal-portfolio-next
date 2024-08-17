"use client";

import React, { CSSProperties, useEffect, useRef, ReactElement, useState } from "react";
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
import { CiTimer } from "react-icons/ci";
import { CiCalendar } from "react-icons/ci";
import Contributors from "./Contributors/Contributors";
import { cl } from "../../Utility/LogicUtility";

const GalleryItem: React.FC<IGalleryItemProps> = (props) => {
    const galleryItemRef = useRef<HTMLDivElement>(null);
    const dynamicLoadQueue = DynamicLoadQueue.getInstance();

    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isRendered && galleryItemRef.current) {
            dynamicLoadQueue.addToQueue(galleryItemRef.current);
        }
    }, [isRendered, galleryItemRef, dynamicLoadQueue]);

    const GalleryItemTypeSegment = (): ReactElement => {
        const type = props.type;

        if (type === "blog") {
            return (
                <div className="gallery-item__type font-fira-code">
                    <CgWebsite />
                    <span>BLOG</span>
                </div>
            );
        } else if (type === "tool") {
            return (
                <div className="gallery-item__type font-fira-code">
                    <TbToolsOff />
                    <span>TOOL</span>
                </div>
            );
        }

        return (<></>);
    };

    const style: CSSProperties = props.style || {};
    const { image, className } = props;

    useEffect(() => {
        setIsRendered(true);
    }, [])

    if (!isRendered) {
        return (<></>);
    }

    return (
        <div
            style={style}
            ref={galleryItemRef}
            key={props.key}
            onMouseMove={cardGradientEffect}
            className="card gallery-item initially-hidden blur-boundary">
            <GalleryItemTypeSegment />
            <div className="gallery-item__image"><Image alt="" src={image ?? ""} /></div>
            <div className="px-5">
                <TagCloud tags={props.tags} />
                <h3>{props.name}</h3>
                <p>{props.subheading}</p>
                {props.description &&
                    <div className="w-full box-border">
                        <SequentialRiseSpan minNumberOfLettersPerLine={42}>
                            {truncateTextBody(props.description, 200)}
                        </SequentialRiseSpan>
                    </div>
                }
            </div>
            {
                props.minuteRead && props.dateCreated &&
                (
                    <p className="position-absolute gallery-item__metadata flex">
                        <span className="flex items-center"><CiTimer /> {props.minuteRead} min read</span>
                        <span className="flex items-center"><CiCalendar /> {isoDateFormatToString(new Date(props.dateCreated))}</span>
                    </p>
                )
            }
            {
                props.repoOwner && props.repoName &&
                <Contributors repoOwner={props.repoOwner} repoName={props.repoName} />
            }
        </div>
    );
}

export default GalleryItem;
