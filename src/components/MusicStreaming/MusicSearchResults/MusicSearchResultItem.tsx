"use client";

import React from "react";
import Image from "../../Image/Image";
import { cardGradientEffect } from "../../Utility/MouseUtility";
import type { IMusicSearchResultItemProps } from "../Interface/IMusicSearchResultItemProps";

const MusicSearchResultItem: React.FC<IMusicSearchResultItemProps> = ({
    song,
    onPlay,
    onAddToQueue,
}) => {
    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <article
            onMouseMove={cardGradientEffect}
            className="card music-result-item"
        >
            <div className="music-result-cover">
                <Image
                    src={song.coverUrl || "/default-album-cover.png"}
                    alt={`${song.name} album cover`}
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
                <button onClick={() => onPlay(song)} aria-label="Play now">
                    ▶
                </button>
                <button
                    onClick={() => onAddToQueue(song)}
                    aria-label="Add to queue"
                >
                    +
                </button>
            </div>
        </article>
    );
};

export default MusicSearchResultItem;
