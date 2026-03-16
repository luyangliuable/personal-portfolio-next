"use client";

import React from "react";
import { cardGradientEffect } from "@/components/Utility/MouseUtility";
import type { IMusicQueueItemProps } from "../Interface/IMusicQueueItemProps";

const MusicQueueItem: React.FC<IMusicQueueItemProps> = ({
    song,
    index,
    isPlaying,
    onRemove,
}) => {
    return (
        <div
            onMouseMove={cardGradientEffect}
            className={`card music-queue-item ${isPlaying ? "playing" : ""}`}
        >
            <div className="queue-item-info">
                <span className="queue-index">{index + 1}</span>
                <div>
                    <h5 className="truncate">{song.name}</h5>
                    <p className="truncate">{song.artists.join(", ")}</p>
                </div>
            </div>
            <button
                onClick={() => onRemove(index)}
                className="queue-remove-btn"
                aria-label="Remove from queue"
            >
                ✕
            </button>
        </div>
    );
};

export default MusicQueueItem;
