import type { Metadata } from "next";
import React from "react";
import HeroHeader from "../../../components/HeroHeader/HeroHeader";
import Gallery from "../../../components/Gallery/Gallery";
import { GalleryItem } from "../../../components/Gallery/Interface/IGalleryProps";

export const metadata: Metadata = {
    title: "Luyang's Website | Web Experiments",
    description: "",
};

const heroHeaderContent = Object.freeze({
    heading: "Web Experiments",
    description: "",
});

const content: GalleryItem[] = [
    {
        name: "Fractal Hills",
        description: "Created with web-gl",
        link: "https://llcode.tech/projects/web-experiments/fractal-hills",
        image: "https://llcode.tech/api/image/677a5f3618eb5f86ea13b55a",
    },
];

const ThreeDPrintingGallery: React.FC<{}> = () => {
    const { heading, description } = heroHeaderContent;
    return (
        <main>
            <HeroHeader heading={heading} description={description} />
            <Gallery content={content} heading="Web Experiments" />
        </main>
    );
};

export default ThreeDPrintingGallery;
