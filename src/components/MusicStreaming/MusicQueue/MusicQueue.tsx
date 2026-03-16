"use client";

import React from "react";
import type { IMusicQueueProps } from "../Interface/IMusicQueueProps";
import MusicQueueItem from "./MusicQueueItem";

const MusicQueue: React.FC<IMusicQueueProps> = ({
    queue,
    currentIndex,
    onRemove,
    onClear,
}) => {
    if (queue.length === 0) {
        return (
            <div className="music-queue-empty">
                <p>Your queue is empty. Add some songs to get started!</p>
            </div>
        );
    }

    return (
        <div className="music-queue">
            <div className="queue-header">
                <h3>Queue ({queue.length})</h3>
                <button onClick={onClear} aria-label="Clear queue">
                    Clear All
                </button>
            </div>
            <div className="queue-list">
                {queue.map((song, index) => (
                    <MusicQueueItem
                        key={`${song.id}-${index}`}
                        song={song}
                        index={index}
                        isPlaying={index === currentIndex}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        </div>
    );
};

export default MusicQueue;
