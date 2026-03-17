"use client";

import React, { useState } from "react";
import { useMusicPlayer } from "../../hooks/useMusicPlayer";
import { useMusicSearch } from "../../hooks/useMusicSearch";
import MusicSearchBar from "./MusicSearchBar/MusicSearchBar";
import MusicSearchResults from "./MusicSearchResults/MusicSearchResults";
import MusicPlayerControls from "./MusicPlayerControls/MusicPlayerControls";
import type { IMusicStreamingProps } from "./Interface/IMusicStreamingProps";
import type { SpotdlSearchResult } from "../../lib/spotdl";
import "./MusicStreaming.css";

const MusicStreaming: React.FC<IMusicStreamingProps> = ({ initialQuery }) => {
    const musicPlayer = useMusicPlayer();
    const musicSearch = useMusicSearch(500);
    const [downloadingSongId, setDownloadingSongId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePlay = async (song: SpotdlSearchResult) => {
        // Don't start a new download if this song is already downloading
        if (downloadingSongId === song.id) {
            return;
        }

        setDownloadingSongId(song.id);
        setError(null);

        try {
            const response = await fetch("/api/music/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    youtubeUrl: song.youtubeUrl || song.spotifyUrl,
                    metadata: song,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.details || "Download failed");
            }

            // Only play after successful download
            musicPlayer.play(song);
            musicPlayer.addToQueue(song);
        } catch (error: any) {
            console.error("Error playing song:", error);
            setError(error.message || "Failed to play song. Please try again.");
        } finally {
            setDownloadingSongId(null);
        }
    };

    const handleAddToQueue = (song: SpotdlSearchResult) => {
        musicPlayer.addToQueue(song);
    };

    return (
        <main className="music-streaming-container">
            <div className="music-content-wrapper">
                <header className="music-header">
                    <h1>Music Streaming</h1>
                    <p>Search and stream your favorite songs</p>
                </header>

                <MusicSearchBar
                    onSearch={musicSearch.search}
                    loading={musicSearch.loading}
                />

                {error && (
                    <div className="error-message">{error}</div>
                )}

                {musicSearch.error && (
                    <div className="error-message">{musicSearch.error}</div>
                )}

                <section className="music-results-section">
                    <MusicSearchResults
                        results={musicSearch.results}
                        onPlay={handlePlay}
                        onAddToQueue={handleAddToQueue}
                        loading={musicSearch.loading}
                        downloadingSongId={downloadingSongId}
                    />
                </section>
            </div>

            {/* Fixed player at bottom */}
            <MusicPlayerControls
                currentSong={musicPlayer.currentSong}
                isPlaying={musicPlayer.isPlaying}
                currentTime={musicPlayer.currentTime}
                duration={musicPlayer.duration}
                volume={musicPlayer.volume}
                onPlayPause={
                    musicPlayer.isPlaying
                        ? musicPlayer.pause
                        : musicPlayer.resume
                }
                onSeek={musicPlayer.seek}
                onVolumeChange={musicPlayer.setVolume}
                onNext={musicPlayer.playNext}
                onPrevious={musicPlayer.playPrevious}
                queue={musicPlayer.queue}
                currentIndex={musicPlayer.currentIndex}
                onRemove={musicPlayer.removeFromQueue}
                onClear={musicPlayer.clearQueue}
                onPlayFromQueue={(song) => {
                    musicPlayer.play(song);
                }}
            />
        </main>
    );
};

export default MusicStreaming;
