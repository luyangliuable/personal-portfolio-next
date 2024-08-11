"use client";

import React, { useEffect, useRef, useState } from 'react';
import { FaAngleDown } from "react-icons/fa";
import IFeaturedContentSectionProps from "./Interface/IFeaturedContentSectionProps";
import IFeaturedContentSectionState from "./Interface/IFeaturedContentSectionState";
import Button from "../Button/Button";
import GalleryItem from "../Gallery/GalleryItem/GalleryItem";
import LandingPageCard from "../LandingPageCard/LandingPageCard";
import TwinCandle from "../TwinCandle/TwinCandle";
import "./FeaturedContentSection.css";
import { useTrigger } from '../../stores/TriggerContext';
import Retro from '../Retro/Retro';

const FeaturedContentSection: React.FC<IFeaturedContentSectionProps> = ({ postList }) => {
    const [state, setState] = useState<IFeaturedContentSectionState>({
        featuredPosts: [
            {
                image: {
                    $oid: "65596ad4ad7cc31ee9263e32"
                },
                _id: {
                    $oid: "featured-tool"
                },
                heading: "Featured Tool: Coming Soon",
                date_created: "",
                post_type: "tool",
                tags: [],
                author: "Luyang Liu",
                body: "Coming Soon",
                url: "Coming Soon"
            },
            {
                image: {
                    $oid: "66ab67bd8803e8c20005c32e"
                },
                _id: {
                    $oid: "can4cancer"
                },
                date_created: "",
                body: "I joined can4cancer which is an initiative that aims to raise funds to support research towards curing and preventing cancer.",
                author: "Luyang Liu",
                url: "https://melbournewalk24.can4cancer.com.au/lucas-liu",
                post_type: "none",
                tags: [],
                heading: "Sponsor Me for Can4Cancer Now!",
            }
        ],
        numberOfCardsEachRow: 0,
        showAllPosts: false,
        featuredTool: {
            name: "Coming Soon",
            description: "Coming Soon",
            link: "Coming Soon"
        }
    });

    const currentComponentRef = useRef<HTMLDivElement>(null);
    const twinCandleComponentParentRef = useRef<HTMLDivElement>(null);
    const twinCandleComponentRef = useRef<TwinCandle>(null);
    const showMoreButtonRef = useRef<HTMLDivElement>(null);

    const { toggleTrigger } = useTrigger();

    useEffect(() => {
        calculateElementsToShow();

        window.addEventListener("resize", calculateElementsToShow);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        twinCandleComponentRef.current?.transitionCandleFireToOn();
                    } else {
                        twinCandleComponentRef.current?.transitionCandleFireToOff();
                    }
                });
            },
            { threshold: 1, rootMargin: "-32% 0px 0px 0px" }
        );

        if (twinCandleComponentParentRef.current) {
            observer.observe(twinCandleComponentParentRef.current);
        }

        return () => {
            if (twinCandleComponentParentRef.current) {
                observer.unobserve(twinCandleComponentParentRef.current);
            }
            window.removeEventListener("resize", calculateElementsToShow);
        };
    }, []);

    const calculateElementsToShow = () => {
        const windowWidth = window.innerWidth;
        const elementWidth = 400;
        const wrapperWidth = 1900;
        let numOfElementsToShow = Math.floor(Math.min(windowWidth, wrapperWidth) / elementWidth);
        setState(prevState => ({ ...prevState, numberOfCardsEachRow: Math.max(numOfElementsToShow, 1) }));
    }

    const showAllElements = () => {
        setState({ ...state, showAllPosts: true });
        if (showMoreButtonRef.current) showMoreButtonRef.current.style.display = 'none';
        toggleTrigger();
    }

    function groupArray<T>(array: T[], groupSize: number): T[][] {
        return array.reduce((acc, _, i) => {
            if (i % groupSize === 0) {
                acc.push(array.slice(i, i + groupSize));
            }
            return acc;
        }, [] as T[][]);
    }

    const renderTopPickedPostsSortedByDateDescending = (): React.ReactNode => {
        const { numberOfCardsEachRow: sliceEnd, showAllPosts } = state;
        const posts = [...state.featuredPosts, ...postList.filter(post => post.is_featured)];
        return groupArray(posts.slice(0, showAllPosts ? -1 : sliceEnd), sliceEnd).map((group, index) => (
            <div key={index} className="featured-section w-full flex flex-col position-relative">
                <Retro />
                <div className="flex flex-row w-full justify-center items-stretch gap-1 flex-wrap position-relative">
                    {group.map((content) => (
                        <div key={content._id.$oid}>
                            <GalleryItem
                                name={content.heading}
                                tags={content.tags}
                                description={content.body}
                                dateCreated={content.date_created}
                                type={content.post_type === "md" ? "blog" : content.post_type}
                                minuteRead={content.reading_time_minutes}
                                className="my-2.5"
                                link={content.url ?? `/digital-chronicles/blog/${content._id.$oid}`}
                                image={content.image.$oid}
                            />
                        </div>
                    ))}
                </div>
            </div>
        ));
    }

    return (
        <LandingPageCard className="mb-20" heading="Featured Content" landingPageCardType="fitContent" blendWithBackground={true}>
            <section ref={currentComponentRef} className="flex flex-col items-center position-relative">
                {renderTopPickedPostsSortedByDateDescending()}
                <div className="show-more-button-wrapper" ref={showMoreButtonRef}>
                    <Button
                        style={{ "--border-radius": "20px", zIndex: 2, border: "2px solid #FFF" } as React.CSSProperties}
                        onClick={showAllElements}
                        showButtonLine>
                        Show More <FaAngleDown />
                    </Button>
                </div>
                <div className="divider h-28"></div>
                <div ref={twinCandleComponentParentRef}><TwinCandle ref={twinCandleComponentRef} /></div>
            </section>
        </LandingPageCard>
    );
}

export default FeaturedContentSection;
