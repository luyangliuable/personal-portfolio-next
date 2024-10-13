"use client";

import React, { useRef, useState, useEffect } from "react";
import IHeroHeaderProps from "./Interface/IHeroHeaderProps";
import SequentialRiseSpan from "../Atoms/SequentialRiseSpan/SequentialRiseSpan";
import "./HeroHeader.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTrigger } from "../../stores/TriggerContext";
import { refreshScrollTrigger } from "../Utility/ScrollUtility";
import GolfedSierpinski from "../GolfedSierpinski/GolfedSierpinski";

const HeroHeader: React.FC<IHeroHeaderProps> = ({
    heading,
    description,
    graphics,
}) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const { trigger } = useTrigger();

    const [screenWidth, setscreenWidth] = useState<number>(0);

    useEffect(() => {
        const update = () => {
            setscreenWidth(window.innerWidth);
        };

        if (typeof window !== "undefined") {
            setscreenWidth(window.innerWidth);
            window.addEventListener("resize", update);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", update);
            }
        };
    }, []);

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.timeline({
            scrollTrigger: {
                trigger: ".hero-header",
                start: "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
            },
        }).to(".hero-header", {
            opacity: 0.3,
            transform: "translateY(-150px) scale(95%)",
            borderBottomColor: "#333",
        });

        refreshScrollTrigger(ScrollTrigger);
    }, [trigger]);

    const renderGraphics = () =>
        graphics ? (
            <div className="hero-header__graphics-container">{graphics}</div>
        ) : (
            <div className="hero-header__graphics-container">
                <GolfedSierpinski />
            </div>
        );

    return (
        <div
            ref={componentRef}
            className="hero-header flex justify-center items-center position-relative"
        >
            <div className="flex flex-row normalised-width w-full items-center position-relative hero-header__inner">
                {screenWidth > 768 && renderGraphics()}
                <div className="hero-header__content w-full">
                    <div className="hero-header__heading important-text">
                        <SequentialRiseSpan
                            calculationAdjustment={0.35}
                            elementType="h1"
                        >{`${heading}\u00A0/ `}</SequentialRiseSpan>
                    </div>
                    <div className="hero-header__description">
                        <SequentialRiseSpan
                            baseAnimationDelay={150}
                            maxNumberOfLettersPerLine={50}
                            calculationAdjustment={0.8}
                        >
                            {description}
                        </SequentialRiseSpan>
                    </div>
                </div>
                {screenWidth <= 768 && renderGraphics()}
            </div>
        </div>
    );
};

export default React.memo(HeroHeader);
