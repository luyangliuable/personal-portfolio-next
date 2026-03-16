"use client";

import React from "react";
import Image from "../../Image/Image";
import type { IMusicPlayerControlsProps } from "../Interface/IMusicPlayerControlsProps";

const MusicPlayerControls: React.FC<IMusicPlayerControlsProps> = ({
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    onPlayPause,
    onSeek,
    onVolumeChange,
    onNext,
    onPrevious,
}) => {
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="music-player-controls">
            {currentSong && (
                <div className="now-playing">
                    <Image
                        src={currentSong.coverUrl}
                        alt={currentSong.name}
                        className="now-playing-cover"
                    />
                    <div className="now-playing-info">
                        <h4 className="truncate">{currentSong.name}</h4>
                        <p className="truncate">
                            {currentSong.artists.join(", ")}
                        </p>
                    </div>
                </div>
            )}
            <div className="player-controls-main">
                <button onClick={onPrevious} aria-label="Previous">
                    ⏮
                </button>
                <button
                    onClick={onPlayPause}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? "⏸" : "▶"}
                </button>
                <button onClick={onNext} aria-label="Next">
                    ⏭
                </button>
            </div>
            <div className="player-progress">
                <span>{formatTime(currentTime)}</span>
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={(e) => onSeek(Number(e.target.value))}
                    aria-label="Seek"
                />
                <span>{formatTime(duration)}</span>
            </div>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                aria-label="Volume"
            />
        </div>
    );
};

export default MusicPlayerControls;
