"use client";

import React, { useState } from "react";
import { FaBackward, FaPlay, FaPause, FaForward, FaList, FaChevronDown, FaChevronUp } from "react-icons/fa6";
import type { IMusicPlayerControlsProps } from "../Interface/IMusicPlayerControlsProps";
import type { SpotdlSearchResult } from "../../../lib/spotdl";

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
    queue = [],
    currentIndex = 0,
    onRemove,
    onClear,
    onPlayFromQueue,
}) => {
    const [queueExpanded, setQueueExpanded] = useState(false);
    const [playerMinimized, setPlayerMinimized] = useState(false);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        console.error("Failed to load player image:", currentSong?.coverUrl);
        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23333'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23fff'%3ENo Image%3C/text%3E%3C/svg%3E";
    };

    const handlePlayFromQueue = (song: SpotdlSearchResult) => {
        if (onPlayFromQueue) {
            onPlayFromQueue(song);
        }
    };

    const handleRemove = (index: number) => {
        if (onRemove) {
            onRemove(index);
        }
    };

    const handleClear = () => {
        if (onClear) {
            onClear();
        }
    };

    return (
        <div className="music-player-fixed">
            {currentSong && (
                <div className="player-card">
                    {!playerMinimized ? (
                        <>
                            <div className="player-content">
                                <div className="player-album">
                                    <img
                                        src={currentSong.coverUrl}
                                        alt={currentSong.name}
                                        onError={handleImageError}
                                    />
                                </div>

                                <div className="player-main">
                                    <div className="player-info">
                                        <h4 className="player-song-name">
                                            {currentSong.name}
                                        </h4>
                                        <p className="player-artist">
                                            {currentSong.artists.join(", ")}
                                        </p>
                                    </div>

                                    <div className="player-controls">
                                        <button
                                            onClick={onPrevious}
                                            className="player-control-button"
                                            aria-label="Previous"
                                        >
                                            <FaBackward />
                                        </button>
                                        <button
                                            onClick={onPlayPause}
                                            className="player-play-button-small"
                                            aria-label={isPlaying ? "Pause" : "Play"}
                                        >
                                            {isPlaying ? <FaPause /> : <FaPlay />}
                                        </button>
                                        <button
                                            onClick={onNext}
                                            className="player-control-button"
                                            aria-label="Next"
                                        >
                                            <FaForward />
                                        </button>
                                    </div>

                                    <div className="player-progress-bar">
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration || 0}
                                            value={currentTime}
                                            onChange={(e) => onSeek(Number(e.target.value))}
                                            className="player-progress-input"
                                            aria-label="Seek"
                                        />
                                        <div
                                            className="player-progress-filled"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>

                                    <div className="player-time">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{formatTime(duration)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setQueueExpanded(!queueExpanded)}
                                className="player-queue-toggle"
                                aria-label="Toggle queue"
                            >
                                <span><FaList /> {queue.length}</span>
                                {queueExpanded ? <FaChevronDown /> : <FaChevronUp />}
                            </button>

                            {queueExpanded && (
                                <div className="player-queue-list">
                                    <div className="player-queue-header">
                                        <span>Queue</span>
                                        {queue.length > 0 && (
                                            <button
                                                onClick={handleClear}
                                                className="queue-clear-button"
                                                aria-label="Clear queue"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                    {queue.length === 0 ? (
                                        <div className="queue-empty">Queue is empty</div>
                                    ) : (
                                        queue.map((song, index) => (
                                            <div
                                                key={`${song.id}-${index}`}
                                                className={`player-queue-item ${index === currentIndex ? 'playing' : ''}`}
                                                onClick={() => handlePlayFromQueue(song)}
                                            >
                                                <div className="queue-item-content">
                                                    <span className="queue-index">{index + 1}</span>
                                                    <div className="queue-item-text">
                                                        <div className="queue-song-name">{song.name}</div>
                                                        <div className="queue-artist-name">{song.artists.join(", ")}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemove(index);
                                                    }}
                                                    className="queue-remove-button"
                                                    aria-label="Remove from queue"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="player-minimized-content">
                            <button
                                onClick={onPlayPause}
                                className="player-minimized-play-button"
                                aria-label={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? <FaPause /> : <FaPlay />}
                            </button>
                            <div className="player-minimized-progress">
                                <div
                                    className="player-minimized-progress-filled"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <button
                                onClick={() => setPlayerMinimized(false)}
                                className="player-minimized-expand"
                                aria-label="Expand player"
                            >
                                <FaChevronUp />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => setPlayerMinimized(true)}
                        className="player-minimize-button"
                        aria-label="Minimize player"
                    >
                        −
                    </button>
                </div>
            )}
        </div>
    );
};

export default MusicPlayerControls;
