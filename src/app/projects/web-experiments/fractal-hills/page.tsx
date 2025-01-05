import type { Metadata } from "next";
import React from "react";
import HeroHeader from "../../../../components/HeroHeader/HeroHeader";
import FractalHills from "../../../../components/FractalHills/FractalHills";

export const metadata: Metadata = {
    title: "Fractal Hills",
    description: "",
};

const heroHeaderContent = Object.freeze({
    heading: "Web Experiments | Fractal Hills",
    description: "",
});

const ThreeDPrintingGallery: React.FC<{}> = () => {
    const { heading, description } = heroHeaderContent;
    return (
        <main>
            <HeroHeader heading={heading} description={description} />
            <FractalHills />
        </main>
    );
};

export default ThreeDPrintingGallery;
