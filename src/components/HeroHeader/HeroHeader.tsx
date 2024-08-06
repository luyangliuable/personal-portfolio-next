"use client"; import React, { useEffect, useRef } from "react";
import IHeroHeaderProps from "./Interface/IHeroHeaderProps";
import SequentialRiseSpan from "../Atoms/SequentialRiseSpan/SequentialRiseSpan";
import "./HeroHeader.css";

import { gsap } from 'gsap';
import { useGSAP } from "@gsap/react";

import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTrigger } from "../../stores/TriggerContext";
gsap.registerPlugin(useGSAP, ScrollTrigger);

const HeroHeader: React.FC<IHeroHeaderProps> = ({ heading, description, graphics }) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const { trigger } = useTrigger();

    useGSAP(() => {
        const heroHeader = {
            this: ".hero-header",
            graphics: ".hero-header__graphics-container",
            content: ".hero-header__content",
            heading: ".hero-header__heading",
            description: ".hero-header__description"
        };

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroHeader.this,
                start: "top top",
                end: "bottom top",
                scrub: true
            },
        });

        tl.add(gsap.to(heroHeader.this, {
            opacity: .3,
            transform: "translateY(-150px) scale(95%)",
            borderBottomColor: "#333",
        }), "start")
    }, [trigger])

    return (
        <div
            ref={componentRef}
            className="hero-header flex flex-row justify-start items-center">
            {
                graphics && (
                    <div className="hero-header__graphics-container">{graphics}</div>
                )
            }
            <div className="hero-header__content w-full">
                <div className="hero-header__heading" >
                    <SequentialRiseSpan elementType="h1">
                        {heading}
                    </SequentialRiseSpan>
                </div>
                <div>
                    <div className="hero-header__description">
                        <SequentialRiseSpan
                            maxNumberOfLettersPerLine={100}
                            calculationAdjustment={.8}>
                            {description}
                        </SequentialRiseSpan>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default React.memo(HeroHeader);
