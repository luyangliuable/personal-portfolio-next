"use client";

import Gallery from "../../components/Gallery/Gallery";
import IGalleryItemProps from "../../components/Gallery/GalleryItem/Interface/IGalleryItemProps";
import HeroHeader from "../../components/HeroHeader/HeroHeader";
import ProgressBar from "../../components/ProgressBar/Progressbar";
import "./YoutubePlaylist.css";
import { IoIosTimer } from "react-icons/io";

const YoutubePlaylist = () => {
    const heroHeaderContent = Object.freeze({
        heading: "Youtube Playlists",
        description: "Youtube videos I find interesting."
    }); // as const

    const { heading, description } = heroHeaderContent;

    const formatTime = (totalSeconds: number): string => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = Math.floor(totalSeconds % 60);

        const pad = (num: number, size: number = 2) => {
            let s = "000" + num;
            return s.substr(s.length - size);
        };

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    };

    const content: IGalleryItemProps[] = [
        {
            name: "AWS Solutions Architect Associate Certification (SAA-C03) – Full Course to PASS the Exam",
            description: "Prepare for the AWS Certified Solutions Architect - Associate certification and pass! Certify your knowledge and skills in AWS technology, across a wide range of AWS services.",
            link: `https://www.youtube.com/watch?v=c3Cn4xYfxJY?t=12560`,
            metadata: [
                {
                    value: <ProgressBar progress={12560 / 180878} />,
                    icon: <>progress:</>,
                }, {
                    value: `${formatTime(180878)} watch`,
                    icon: <IoIosTimer />,
                }
            ],
            image: `https://i.ytimg.com/vi/c3Cn4xYfxJY/maxresdefault.jpg`
        }
    ];

    return (
        <main>
            <HeroHeader heading={heading} description={description} />
            <Gallery content={content} heading="Learning" />
        </main>
    )
}

export default YoutubePlaylist;
