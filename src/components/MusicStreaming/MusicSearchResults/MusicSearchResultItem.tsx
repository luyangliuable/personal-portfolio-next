"use client";

import React from "react";
import { FaPlay, FaPlus, FaSpinner } from "react-icons/fa6";
import type { IMusicSearchResultItemProps } from "../Interface/IMusicSearchResultItemProps";
import { cardGradientEffect } from "../../../components/Utility/MouseUtility";

const MusicSearchResultItem: React.FC<IMusicSearchResultItemProps> = ({
    song,
    onPlay,
    onAddToQueue,
    isDownloading = false,
}) => {
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        console.error("Failed to load image:", song.coverUrl);
        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23fff'%3ENo Image%3C/text%3E%3C/svg%3E";
    };

    return (
        <article
            className="card music-result-item"
            onMouseMove={cardGradientEffect}
        >
            <div className="music-result-cover">
                <img
                    src={song.coverUrl}
                    alt={`${song.name} album cover`}
                    onError={handleImageError}
                    loading="lazy"
                />
            </div>
            <div className="music-result-info">
                <h3 className="truncate">{song.name}</h3>
                <p className="truncate">{song.artists.join(", ")}</p>
                <span className="music-duration">
                    {formatDuration(song.duration)}
                </span>
            </div>
            <div className="music-result-actions">
                <button
                    onClick={() => onPlay(song)}
                    aria-label={isDownloading ? "Downloading..." : "Play now"}
                    disabled={isDownloading}
                >
                    {isDownloading ? <FaSpinner className="animate-spin" /> : <FaPlay />}
                </button>
                <button
                    onClick={() => onAddToQueue(song)}
                    aria-label="Add to queue"
                >
                    <FaPlus />
                </button>
            </div>
        </article>
    );
};

export default MusicSearchResultItem;
