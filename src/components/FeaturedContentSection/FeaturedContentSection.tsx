"use client";

import React, { useEffect, useRef, useState } from 'react';
import { FaAngleDown } from "react-icons/fa";
import { truncateTextBody } from "../Utility/StringUtility";
import IFeaturedContentSectionProps from "./Interface/IFeaturedContentSectionProps";
import IFeaturedContentSectionState from "./Interface/IFeaturedContentSectionState";
import Button from "../Button/Button";
import GalleryItem from "../Gallery/GalleryItem/GalleryItem";
import LandingPageCard from "../LandingPageCard/LandingPageCard";
import PostRepository from "../../repositories/PostRepository";
import TwinCandle from "../TwinCandle/TwinCandle";

import "./FeaturedContentSection.css";

const FeaturedContentSection: React.FC<IFeaturedContentSectionProps> = (props) => {
    const [state, setState] = useState<IFeaturedContentSectionState>({
        featuredPosts: [],
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
    const postRepository = PostRepository.getInstance();

    useEffect(() => {
        calculateElementsToShow();
        fetchPostList();

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
        const featuredPostsLength = state.featuredPosts?.length ?? 0;
        setState({ ...state, numOfElementsToShow: featuredPostsLength + 2 });
        if (showMoreButtonRef.current) showMoreButtonRef.current.style.display = 'none';
        if (featuredSectionRef.current) featuredSectionRef.current.classList.remove('featured-section-with-before');
    }

    const renderTopPickedPostsSortedByDateDescending = (): React.ReactNode => {
        const sliceEnd = state.numOfElementsToShow - 2;
        return state.featuredPosts?.slice(0, sliceEnd).map((content) => (
            <div key={content._id.$oid}>
                <GalleryItem
                    name={content.heading}
                    tags={content.tags}
                    type="blog"
                    dateCreated={content.date_created}
                    minuteRead={content.reading_time_minutes}
                    className="my-2.5"
                    link={`/digital-chronicles/blog/${content._id.$oid}`}
                    image={content.image.$oid}
                />
            </div>
        ));
    }

    const fetchPostList = async () => {
        const response = await postRepository.getFeaturedPostList();
        setState(prevState => ({ ...prevState, featuredPosts: response }));
    }

    const getFeaturedToolHeading = () => "Featured Tool: " + state.featuredTool?.name;

    return (
        <LandingPageCard className="mb-20" heading="Featured Content" landingPageCardType="fitContent" blendWithBackground={true}>
            <section ref={currentComponentRef} className="flex flex-col items-center">
                <div ref={featuredSectionRef} className="featured-section featured-section-with-before w-full position-relative flex flex-row justify-center items-stretch">
                    <GalleryItem
                        name={getFeaturedToolHeading()}
                        type="tool"
                        className="my-2.5 h-full"
                        image="65596ad4ad7cc31ee9263e32"
                        description={truncateTextBody(state.featuredTool?.description)}
                        link={state.featuredTool?.link}
                    />
                    <GalleryItem
                        name="Sponser Me for Can4Cancer Now!"
                        className="my-2.5 h-full"
                        action="VISIT"
                        image="https://raisely-images.imgix.net/can4cancer-2024/uploads/can-4-cancer-logo-jpg-9f9f6a.jpg?fit=max&w=1000&auto=format&q=62"
                        description="I joined can4cancer which is an initiative that aims to raise funds to support research towards curing and preventing cancer."
                        link="https://melbournewalk24.can4cancer.com.au/lucas-liu"
                    />
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
