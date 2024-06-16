"use client";

import React, { useEffect, useState } from "react";
import IHeroHeaderProps from "./Interface/IHeroHeaderProps";
import SequentialRiseSpan from "../Atoms/SequentialRiseSpan/SequentialRiseSpan";
import "./HeroHeader.css";

const HeroHeader: React.FC<IHeroHeaderProps> = ({ heading, description, graphics }) => {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        setIsRendered(true);
    }, [])

    if (!isRendered) {
        return (<></>);
    }

    return (
        <div className="hero-header flex flex-row justify-start items-center">
            {
                graphics && (
                    <div className="hero-header__graphics-container">{graphics}</div>
                )
            }
            <div className="w-full">
                <SequentialRiseSpan elementType="h1">
                    {heading}
                </SequentialRiseSpan>
                <SequentialRiseSpan className="hero-header--description" maxNumberOfLettersPerLine={100}>
                    {description}
                </SequentialRiseSpan>
            </div>
        </div>
    );
}

export default React.memo(HeroHeader);
