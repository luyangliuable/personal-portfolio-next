"use client";

import React from "react";
import type { SpotdlSearchResult } from "@/lib/spotdl";
import MusicSearchResultItem from "./MusicSearchResultItem";

interface IMusicSearchResultsProps {
    results: SpotdlSearchResult[];
    onPlay: (song: SpotdlSearchResult) => void;
    onAddToQueue: (song: SpotdlSearchResult) => void;
    loading?: boolean;
}

const MusicSearchResults: React.FC<IMusicSearchResultsProps> = ({
    results,
    onPlay,
    onAddToQueue,
    loading = false,
}) => {
    if (loading) {
        return (
            <div className="music-results-loading">
                <div
                    className="skeleton-component"
                    style={{ height: "200px" }}
                />
                <div
                    className="skeleton-component"
                    style={{ height: "200px" }}
                />
                <div
                    className="skeleton-component"
                    style={{ height: "200px" }}
                />
            </div>
        );
    }

    if (results.length === 0) {
        return (
            <div className="music-results-empty">
                <p>No results found. Try searching for your favorite songs!</p>
            </div>
        );
    }

    return (
        <div className="music-results-grid">
            {results.map((song) => (
                <MusicSearchResultItem
                    key={song.id}
                    song={song}
                    onPlay={onPlay}
                    onAddToQueue={onAddToQueue}
                />
            ))}
        </div>
    );
};

export default MusicSearchResults;
