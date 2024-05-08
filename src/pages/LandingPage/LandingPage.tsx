import React, { useMemo } from "react";
import HeroSection from "../../components/HeroSection/HeroSection";
import ILandingPagestate from "./Interface/ILandingPageState";
import ILandingPageProps from "./Interface/ILandingPageProps";
import Experiences from "../../components/ExperienceSection/ExperienceSection";
import FeaturedContentSection from "../../components/FeaturedContentSection/FeaturedContentSection";
import LandingPageCard from "../../components/LandingPageCard/LandingPageCard";
import BlogPage from "../BlogPage/BlogPage";
import { useScrollPosition } from "../../hooks";

const LandingPage: React.FC<ILandingPageProps> = () => {
    const { scrollY, scrolling } = useScrollPosition();

    return (
        <main className="landing-page-content">
            <HeroSection scrolling={scrolling} />
            <FeaturedContentSection />
            <div className="experience-section-wrapper">
                <Experiences scrolled={scrollY} />
            </div>
            <LandingPageCard landingPageCardType="fitContent" className="blend-with-background">
                <section className="flex-column-centered-centered"><BlogPage /></section>
            </LandingPageCard>
        </main>
    )
}

export default LandingPage;
