import React from "react";
import type { Metadata } from "next";
import MusicStreaming from "../../../components/MusicStreaming/MusicStreaming";

export const metadata: Metadata = {
    title: "Music Streaming | Luyang's Portfolio",
    description: "Search and stream music powered by spotdl",
};

const MusicPage = () => {
    return <MusicStreaming />;
};

export default MusicPage;
