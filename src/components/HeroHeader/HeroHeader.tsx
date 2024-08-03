"use client";

import React, { useEffect, useRef, useState } from "react";
import IHeroHeaderProps from "./Interface/IHeroHeaderProps";
import SequentialRiseSpan from "../Atoms/SequentialRiseSpan/SequentialRiseSpan";
import { clamp } from "../Utility/LogicUtility";
import "./HeroHeader.css";
import { useScrollPosition } from "../../hooks";

const HeroHeader: React.FC<IHeroHeaderProps> = ({ heading, description, graphics }) => {
    const [isRendered, setIsRendered] = useState(false);

    const [animationScroll, setAnimationScroll] = useState<number | null>(null);

    const { scrollY } = useScrollPosition();

    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log(animationScroll);
    }, [animationScroll])

    useEffect(() => {
        const addIntersectionObserver = () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const posY = componentRef.current!.getBoundingClientRect().top + window.scrollY;
                        setAnimationScroll(posY < 100 ? 1 : posY);
                    }
                });
            }, { threshold: [0.1] });

            if (componentRef.current) observer.observe(componentRef.current);

            return observer;
        }
        const observer = addIntersectionObserver();
        return () => observer.disconnect();
    }, [componentRef]);

    return (
        <div
            ref={componentRef}
            className="hero-header flex flex-row justify-start items-center"
            style={{
                visibility: animationScroll ? "visible" : "hidden",
                opacity: animationScroll ? clamp(.3, 1, 300 - ((scrollY ?? 0) - animationScroll), 1 / 300) : 1,
                borderBottom: `${animationScroll ? clamp(.1, 2, (scrollY ?? 0) - animationScroll, 1 / 5) : ".1"}px solid #DDD`,
                transform: animationScroll ? `translateY(${clamp(-150, 0, -((scrollY ?? 0) - animationScroll), 1 / 2)}px)` : "none",
                width: animationScroll ? `${clamp(95, 100, 100 * 50 - ((scrollY ?? 0) - animationScroll), 1 / 50)}% ` : "100%"
            }}>
            {
                graphics && (
                    <div className="hero-header__graphics-container">{graphics}</div>
                )
            }
            <div className="w-full">
                <SequentialRiseSpan elementType="h1">
                    {heading}
                </SequentialRiseSpan>
                <SequentialRiseSpan
                    className="hero-header--description"
                    maxNumberOfLettersPerLine={100}
                    calculationAdjustment={.8}>
                    {description}
                </SequentialRiseSpan>
            </div>
        </div >
    );
}

export default React.memo(HeroHeader);
