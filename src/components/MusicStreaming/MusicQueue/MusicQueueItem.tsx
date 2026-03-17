"use client";

import React from "react";
import { FaXmark } from "react-icons/fa6";
import type { IMusicQueueItemProps } from "../Interface/IMusicQueueItemProps";

const MusicQueueItem: React.FC<IMusicQueueItemProps> = ({
    song,
    index,
    isPlaying,
    onRemove,
}) => {
    return (
        <div
            className={`music-queue-item ${isPlaying ? "playing" : ""}`}
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
                className="queue-remove-button"
                aria-label="Remove from queue"
            >
                <FaXmark />
            </button>
        </div>
    );
};

export default MusicQueueItem;
