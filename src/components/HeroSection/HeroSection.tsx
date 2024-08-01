"use client";

import React, { useMemo } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import IHeroProps from "./Interface/IHeroProps";
import Link from "next/link";
import CodingCat from "../CodingCat/CodingCat";
import Button from "../Button/Button";
import LandingPageCard from "../LandingPageCard/LandingPageCard";
import SequentialRiseSpan from "../Atoms/SequentialRiseSpan/SequentialRiseSpan";

import { SiCodecademy } from "react-icons/si";
import { FaGithubSquare } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiNotionFill } from "react-icons/ri";

import "./HeroSection.css";

const HeroSection: React.FC<IHeroProps> = ({}) => {
    const mainHeading: string = "Hi There, I am Luyang.";

    const introduction: JSX.Element = (
        <SequentialRiseSpan calculationAdjustment={.82} minNumberOfLettersPerLine={48}>
            A software engineer, dog lover and fitness ethusiast who enjoys cooking, experimenting, eager to embrace life’s adventures and form meaningful connections and creating memories with like-minded people!
        </SequentialRiseSpan>
    );

    const connections: any = [{
        name: "Notion",
        link: "https://luyangl.notion.site/luyangl/71be1ff365c44fd2b4f6f8dce14b7536?v=f1e55d08878e4bfda1b744e76b9480c7",
        color: "#000",
        background: "#FEFEFF",
        icon: <RiNotionFill />,
        imageSrc: "https://img.shields.io/badge/notion-%2312100E.svg?&style=for-the-badge&logo=notion&logoColor=%23333&color=%239e9e9e",
    },
    {
        name: "Email",
        link: "mailto:luyang.l@protonmail.me",
        color: "#004300",
        background: "#77dd77",
        icon: <MdEmail />,
        imageSrc: "https://img.shields.io/badge/email-%2312100E.svg?&style=for-the-badge&logo=protonmail&logoColor=white&color=black",
    },
    {
        name: "GitHub",
        link: "https://github.com/luyangliuable",
        color: "#FFF",
        background: "#181717",
        icon: <FaGithubSquare />,
        imageSrc:
            "https://img.shields.io/badge/github-%2312100E.svg?&style=for-the-badge&logo=github&logoColor=white&color=black",
    },
    {
        name: "LinkedIn",
        icon: <FaLinkedin />,
        color: "#FFF",
        background: "#0077B5",
        link: "https://www.linkedin.com/in/luyang-l",
        imageSrc:
            "https://img.shields.io/badge/linkedin-%230077B5.svg?&style=for-the-badge&logo=linkedin&logoColor=white",
    },
    {
        name: "Codecademy",
        link: "https://www.codecademy.com/profiles/luyangliuable",
        color: "#FFF",
        background: "#000",
        icon: <SiCodecademy />,
        imageSrc: "https://img.shields.io/badge/codecademy-%2312100E.svg?&style=for-the-badge&logo=codecademy&logoColor=white&color=black",
    }]

    const footer = useMemo(() => {
        return (
            <footer className="hero-section-badge__container flex justify-center items-center w-full">
                {connections.map(
                    (item: any, index: number) => (
                        <Link
                            key={index}
                            style={{
                                color: item.color,
                                backgroundColor: item.background
                            }}
                            href={item.link}
                            className="hero-section-badge__link flex justify-center items-center"
                            target="_blank"
                            rel="noopener noreferrer" >
                            {item.icon}
                            {item.name.toUpperCase()}
                        </Link>
                    )
                )}
            </footer>
        );
    }, [connections]);

    const heroSectionContentLeft = useMemo(() => {
        return (
            <section className="hero-section__content__left">
                <header className="self-start">
                    <SequentialRiseSpan elementType="h1" className="hero-section__heading" minNumberOfLettersPerLine={40}>
                        {mainHeading}
                    </SequentialRiseSpan>
                </header>
                <div className="hero-section__content__left__text position-relative">{introduction}</div>
                <div className="hero-section__button-container flex flex-row mt-10 justify-start self-start flex-wrap gap-1">
                    <Button to="/digital-chronicles/blogs">See my Blog <AiOutlineArrowRight /></Button>
                    <Button to="/about/teddie">See my Dog <AiOutlineArrowRight /></Button>
                    <Button to="/projects/code">See my Projects <AiOutlineArrowRight /></Button>
                    <Button to="/digital-chronicles/coding-notes">See my Notes <AiOutlineArrowRight /></Button>
                </div>
            </section>
        );
    }, [mainHeading, introduction]);

    return (
        <section className="hero-section__wrapper">
            <LandingPageCard className="hero-section" landingPageCardType="fitContent" >
                <div className="space h-28"></div>
                <section className="hero-section__content">
                    <section className="hero-section__content__right">
                        <CodingCat />
                    </section>
                    {heroSectionContentLeft}
                </section>
                {footer}
            </LandingPageCard>
        </section>
    );
}

export default HeroSection;
