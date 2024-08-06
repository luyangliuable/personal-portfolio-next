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
        numOfElementsToShow: 0,
        featuredTool: {
            name: "Coming Soon",
            description: "Coming Soon",
            link: "Coming Soon"
        }
    });

    const currentComponentRef = useRef<HTMLDivElement>(null);
    const featuredSectionRef = useRef<HTMLDivElement>(null);
    const twinCandleComponentParentRef = useRef<HTMLDivElement>(null);
    const twinCandleComponentRef = useRef<TwinCandle>(null);
    const showMoreButtonRef = useRef<HTMLDivElement>(null);

    const { toggleTrigger } = useTrigger();

    useEffect(() => {
        calculateElementsToShow();

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
        };
    }, []);

    const calculateElementsToShow = () => {
        const windowWidth = window.innerWidth;
        const elementWidth = 400;
        const wrapperWidth = 1900;
        let numOfElementsToShow = Math.floor(Math.min(windowWidth, wrapperWidth) / elementWidth);
        setState(prevState => ({ ...prevState, numOfElementsToShow: Math.max(numOfElementsToShow, 1) }));
    }

    const showAllElements = () => {
        /* const featuredPostsLength = state.featuredPosts?.length ?? 0;
         * setState({ ...state, numOfElementsToShow: featuredPostsLength + 2 });
         * if (showMoreButtonRef.current) showMoreButtonRef.current.style.display = 'none';
         * if (featuredSectionRef.current) featuredSectionRef.current.classList.remove('featured-section-with-before'); */
        alert("Show all elements disabled temporarily.");
        toggleTrigger();
    }

    const renderTopPickedPostsSortedByDateDescending = (): React.ReactNode => {
        const sliceEnd = state.numOfElementsToShow;
        const posts = [...state.featuredPosts, ...postList.filter(post => post.is_featured)];
        return posts.slice(0, sliceEnd).map((content) => (
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
        ));
    }

    return (
        <LandingPageCard className="mb-20" heading="Featured Content" landingPageCardType="fitContent" blendWithBackground={true}>
            <section ref={currentComponentRef} className="flex flex-col items-center">
                <div ref={featuredSectionRef} className="featured-section featured-section-with-before w-full position-relative flex flex-row justify-center items-stretch">
                    {renderTopPickedPostsSortedByDateDescending()}
                </div>
                <div className="show-more-button-wrapper" ref={showMoreButtonRef}>
                    <Button
                        style={{ "--border-radius": "20px", zIndex: 10, border: "2px solid #F3F3F3" } as React.CSSProperties}
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
