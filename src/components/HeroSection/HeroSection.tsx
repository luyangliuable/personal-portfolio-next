"use client";

import {
    useMemo,
    useRef,
    useEffect,
    useState,
    memo,
    type MouseEvent,
} from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import IHeroProps from "./Interface/IHeroProps";
import Link from "next/link";
import CodingCat from "../CodingCat/CodingCat";
import Button from "../Button/Button";
import LandingPageCard from "../LandingPageCard/LandingPageCard";
import SequentialRiseSpan from "../Atoms/SequentialRiseSpan/SequentialRiseSpan";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { FaGithubSquare, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiNotionFill } from "react-icons/ri";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./HeroSection.css";

const connections = [
    {
        name: "GitHub",
        link: "https://github.com/luyangliuable",
        color: "#FFF",
        background: "#181717",
        icon: <FaGithubSquare />,
    },
    {
        name: "LinkedIn",
        icon: <FaLinkedin />,
        color: "#FFF",
        background: "#0077B5",
        link: "https://www.linkedin.com/in/luyang-l",
    },
    {
        name: "Email",
        link: "mailto:luyang.l@protonmail.me",
        color: "#004300",
        background: "#77dd77",
        icon: <MdEmail />,
    },
    {
        name: "Notion",
        link: "https://luyangl.notion.site/luyangl/71be1ff365c44fd2b4f6f8dce14b7536?v=f1e55d08878e4bfda1b744e76b9480c7",
        color: "#000",
        background: "#FEFEFF",
        icon: <RiNotionFill />,
    },
];

const mainHeading: string = "Hi There, I am Luyang.";

const HeroSection: React.FC<IHeroProps> = () => {
    const heroSectionRef = useRef(null);
    const pixelatedCodingCatRef = useRef<HTMLDivElement>(null);
    const [screenWidth, setscreenWidth] = useState<number>(0);
    const [pixelCatReady, setPixelCatReady] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState<{
        x?: string;
        y?: string;
    }>({});

    useEffect(() => {
        const update = () => {
            setscreenWidth(globalThis.innerWidth);
        };

        const delay = setTimeout(() => {
            setPixelCatReady(true);
        }, 800);

        if (typeof globalThis !== "undefined") {
            setscreenWidth(globalThis.innerWidth);
            globalThis.addEventListener("resize", update);
        }

        return () => {
            clearTimeout(delay);
            if (typeof globalThis !== "undefined") {
                globalThis.removeEventListener("resize", update);
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
                transform: `translateY(${globalThis.innerHeight / 20}px)`,
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

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const catRef = pixelatedCodingCatRef.current;
        if (catRef && pixelCatReady) {
            const delay = setTimeout(() => {
                catRef.style.zIndex = "1";
            }, 100);
            const rect = catRef.getBoundingClientRect();
            const elementWidth = rect.width;
            const elementHeight = rect.height;
            const x = ((e.clientX - rect.left) / elementWidth) * 100;
            const y = ((e.clientY - rect.top) / elementHeight) * 100;
            setCursorPosition({ x: `${x}%`, y: `${y}%` });
            return () => {
                clearTimeout(delay);
            };
        }
    };

    const footer = useMemo(() => {
        return (
            <footer className="hero-section-badge__container flex justify-center items-center w-full mb-2">
                {connections.map((item: any, index: number) => (
                    <Link
                                key={item.name}
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
                <div className="hero-section__button-container flex flex-row mt-10 justify-start self-start flex-wrap gap-3">
                    <Button to="/projects/code">
                        See my Projects <AiOutlineArrowRight />
                    </Button>
                    <Button to="/digital-chronicles/blog">
                        Read my Blog
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
                    <div
                        className="
                            hero-section__content__left
                            flex
                            h-28
                            items-center
                            justify-center
                            relative
                        "
                        onMouseMove={handleMouseMove}
                        aria-label="Interactive hero section with coding cat"
                    >
                        <div
                            className="
                                absolute
                                flex
                                items-center
                                justify-center
                                w-full
                                h-full
                            "
                            ref={pixelatedCodingCatRef}
                            style={{
                                clipPath: `circle(70px at ${cursorPosition.x} ${cursorPosition.y})`,
                            }}
                        >
                            <CodingCat pixelated />
                        </div>
                        <div
                            className="
                                absolute
                                flex
                                items-center
                                justify-center
                                coding-cat
                                w-full
                                h-full
                                bg-[color:var(--background-color-primary-white)]
                            "
                            data-style="slides"
                        >
                            <CodingCat pixelated={false} />
                        </div>
                    </div>
                    {heroSectionContentLeft}
                </section>
                {footer}
            </LandingPageCard>
            <div className="hero-section__after"></div>
        </>
    );
};

export default memo(HeroSection);
