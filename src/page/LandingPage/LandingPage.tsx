"use client";

import React, { useState, useEffect } from "react";
import HeroSection from "../../components/HeroSection/HeroSection";
import { ILandingPageProps } from "../../interfaces";
import Experiences from "../../components/ExperienceSection/ExperienceSection";
import FeaturedContentSection from "../../components/FeaturedContentSection/FeaturedContentSection";
import LandingPageCard from "../../components/LandingPageCard/LandingPageCard";
import BlogPage from "../BlogPage/BlogPage";
import SkeletonPage from "../SkeletonPage/SkeletonPage";

const LandingPage: React.FC<ILandingPageProps> = ({ postList }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const handleLoad = () => {
            setIsLoaded(true);
        };
        handleLoad();
    }, []);

    if (!isLoaded) {
        return (<SkeletonPage />);
    }

    return (
        <main className="landing-page-content">
            <HeroSection />
            <FeaturedContentSection postList={postList} />
            <Experiences />
            <LandingPageCard landingPageCardType="fitContent" className="blend-with-background">
                <section className="flex-column-centered-centered"><BlogPage data={postList} /></section>
            </LandingPageCard>
        </main>
    );
};

export default LandingPage;
