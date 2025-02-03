"use client";

import React, { useMemo, useRef, useEffect, useState, memo } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import IHeroProps from "./Interface/IHeroProps";
import Link from "next/link";
import CodingCat from "../CodingCat/CodingCat";
import Button from "../Button/Button";
import LandingPageCard from "../LandingPageCard/LandingPageCard";
import SequentialRiseSpan from "../Atoms/SequentialRiseSpan/SequentialRiseSpan";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SiCodecademy } from "react-icons/si";
import { FaGithubSquare, FaLinkedin, FaStackOverflow } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiNotionFill } from "react-icons/ri";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./HeroSection.css";
import Bento from "../Bento/Bento";

const connections = [
    {
        name: "Notion",
        link: "https://luyangl.notion.site/luyangl/71be1ff365c44fd2b4f6f8dce14b7536?v=f1e55d08878e4bfda1b744e76b9480c7",
        color: "#000",
        background: "#FEFEFF",
        rowSpan: 2,
        colSpan: 2,
        icon: <RiNotionFill />,
        imageSrc:
            "https://img.shields.io/badge/notion-%2312100E.svg?&style=for-the-badge&logo=notion&logoColor=%23333&color=%239e9e9e",
    },
    {
        name: "Email",
        link: "mailto:luyang.l@protonmail.me",
        color: "#004300",
        rowSpan: 2,
        colSpan: 1,
        background: "#77dd77",
        icon: <MdEmail />,
        imageSrc:
            "https://img.shields.io/badge/email-%2312100E.svg?&style=for-the-badge&logo=protonmail&logoColor=white&color=black",
    },
    {
        name: "LinkedIn",
        icon: <FaLinkedin />,
        color: "#FFF",
        rowSpan: 1,
        colSpan: 1,
        background: "#0077B5",
        link: "https://www.linkedin.com/in/luyang-l",
        imageSrc:
            "https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white",
    },
    {
        name: "SO",
        link: "https://stackoverflow.com/users/1570777/luyangliuable",
        color: "#F48024", // Stack Overflow's primary color
        rowSpan: 1,
        colSpan: 1,
        background: "#FFF", // White background
        icon: <FaStackOverflow />,
        imageSrc:
            "https://img.shields.io/badge/codecademy-%2312100E.svg?&style=for-the-badge&logo=codecademy&logoColor=white&color=black",
    },
    {
        name: "GitHub",
        link: "https://github.com/luyangliuable",
        color: "#FFF",
        rowSpan: 1,
        colSpan: 2,
        background: "#181717",
        icon: <FaGithubSquare />,
        imageSrc:
            "https://img.shields.io/badge/github-%2312100E.svg?&style=for-the-badge&logo=github&logoColor=white&color=black",
    },
    {
        name: "Codecademy",
        link: "https://www.codecademy.com/profiles/luyangliuable",
        color: "#FFF",
        rowSpan: 1,
        colSpan: 1,
        background: "#000",
        icon: <SiCodecademy />,
        imageSrc:
            "https://img.shields.io/badge/codecademy-%2312100E.svg?&style=for-the-badge&logo=codecademy&logoColor=white&color=black",
    },
];

const mainHeading: string = "Hi There, I am Luyang.";

const HeroSection: React.FC<IHeroProps> = () => {
    const heroSectionRef = useRef(null);

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
        const heroSection = ".hero-section";

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroSection,
                start: "top+=30% top",
                end: "bottom top",
                invalidateOnRefresh: true,
                scrub: 0.1,
            },
        });

        tl.add(
            gsap.to(heroSection, {
                transform: `translateY(${window.innerHeight / 20}px)`,
            }),
            "start",
        );

        const afterElement = ".hero-section__after";

        tl.add(
            gsap.to(afterElement, {
                transform: `translateY(0)`,
            }),
            "start",
        );
    });

    const footer = useMemo(() => {
        return (
            <footer className="hero-section-badge__container flex justify-center items-center w-full mb-2">
                {connections.map((item: any, index: number) => (
                    <Link
                        key={index}
                        style={{
                            color: item.color,
                            backgroundColor: item.background,
                        }}
                        href={item.link}
                        className="hero-section-badge__link flex justify-center items-center box-shadow-md"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {item.icon}
                        {item.name.toUpperCase()}
                    </Link>
                ))}
            </footer>
        );
    }, []);

    const heroSectionContentLeft = useMemo(() => {
        return (
            <section
                className="
                    hero-section__content__right
                "
                ref={heroSectionRef}
            >
                <header className="mb-2 md:mb-2">
                    {screenWidth > 550 && (
                        <SequentialRiseSpan
                            elementType="h1"
                            className="hero-section__heading"
                        >
                            {mainHeading}
                        </SequentialRiseSpan>
                    )}
                    {screenWidth <= 550 && (
                        <SequentialRiseSpan
                            elementType="h1"
                            className="hero-section__heading"
                            maxNumberOfLettersPerLine={10}
                        >
                            {mainHeading}
                        </SequentialRiseSpan>
                    )}
                </header>
                <div className="hero-section__content__left__text text-gray-500 relative">
                    {screenWidth > 550 && (
                        <SequentialRiseSpan
                            baseAnimationDelay={200}
                            calculationAdjustment={0.82}
                            minNumberOfLettersPerLine={48}
                        >
                            A software engineer, dog lover and fitness ethusiast
                            who enjoys cooking, experimenting, eager to embrace
                            life’s adventures and form meaningful connections
                            and creating memories with like-minded people!
                        </SequentialRiseSpan>
                    )}
                    {screenWidth <= 550 && (
                        <SequentialRiseSpan
                            baseAnimationDelay={200}
                            calculationAdjustment={0.7}
                            minNumberOfLettersPerLine={38}
                        >
                            A software engineer, dog lover and fitness ethusiast
                            who enjoys cooking, experimenting, eager to embrace
                            life’s adventures and form meaningful connections
                            and creating memories with like-minded people!
                        </SequentialRiseSpan>
                    )}
                </div>
                <div className="hero-section__button-container flex flex-row mt-10 justify-start self-start flex-wrap gap-1">
                    <Button to="/digital-chronicles/blog">
                        See my Blog <AiOutlineArrowRight />
                    </Button>
                    <Button to="/about/teddie">
                        See my Dog <AiOutlineArrowRight />
                    </Button>
                    <Button to="/projects/code">
                        See my Projects <AiOutlineArrowRight />
                    </Button>
                    <Button to="/digital-chronicles/coding-notes">
                        See my Notes <AiOutlineArrowRight />
                    </Button>
                </div>
            </section>
        );
    }, [mainHeading, screenWidth]);

    return (
        <>
            <LandingPageCard
                className="hero-section"
                landingPageCardType="fitContent"
            >
                <section className="hero-section__content">
                    <section
                        className="
                            hero-section__content__left
                            flex
                            h-28
                            items-center
                            justify-center
                            relative
                        "
                    >
                        <div
                            className="
                                absolute
                                flex
                                items-center
                                justify-center
                                w-full
                                bg-[color:var(--background-color-primary-white)]
                            "
                        >
                            <CodingCat pixelated />
                        </div>
                        <div
                            className="
                                absolute
                                flex
                                items-center
                                justify-center
                                w-full
                                bg-[color:var(--background-color-primary-white)]
                            "
                            data-style="slides"
                        >
                            <CodingCat pixelated={false} />
                        </div>
                    </section>
                    {heroSectionContentLeft}
                </section>
                {footer}
            </LandingPageCard>
            <div className="hero-section__after"></div>
        </>
    );
};

export default memo(HeroSection);
