"use client";

import React from "react";
import { useMusicPlayer } from "@/hooks/useMusicPlayer";
import { useMusicSearch } from "@/hooks/useMusicSearch";
import MusicSearchBar from "./MusicSearchBar/MusicSearchBar";
import MusicSearchResults from "./MusicSearchResults/MusicSearchResults";
import MusicPlayerControls from "./MusicPlayerControls/MusicPlayerControls";
import MusicQueue from "./MusicQueue/MusicQueue";
import type { IMusicStreamingProps } from "./Interface/IMusicStreamingProps";
import type { SpotdlSearchResult } from "@/lib/spotdl";
import "./MusicStreaming.css";

const MusicStreaming: React.FC<IMusicStreamingProps> = ({ initialQuery }) => {
    const musicPlayer = useMusicPlayer();
    const musicSearch = useMusicSearch(500);

    const handlePlay = async (song: SpotdlSearchResult) => {
        // Download song if not cached, then play
        try {
            await fetch("/api/music/download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    spotifyUrl: song.spotifyUrl || song.youtubeUrl,
                    metadata: song,
                }),
            });

            musicPlayer.play(song);
            musicPlayer.addToQueue(song);
        } catch (error) {
            console.error("Error playing song:", error);
        }
    };

    const handleAddToQueue = (song: SpotdlSearchResult) => {
        musicPlayer.addToQueue(song);
    };

    return (
        <main className="music-streaming-container">
            <header className="music-header">
                <h1>Music Streaming</h1>
                <p>Search and stream your favorite songs</p>
            </header>

            <MusicSearchBar
                onSearch={musicSearch.search}
                loading={musicSearch.loading}
            />

            {musicSearch.error && (
                <div className="error-message">{musicSearch.error}</div>
            )}

            <div className="music-content-grid">
                <section className="music-results-section">
                    <MusicSearchResults
                        results={musicSearch.results}
                        onPlay={handlePlay}
                        onAddToQueue={handleAddToQueue}
                        loading={musicSearch.loading}
                    />
                </section>

                <aside className="music-sidebar">
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
                    />

                    <MusicQueue
                        queue={musicPlayer.queue}
                        currentIndex={musicPlayer.currentIndex}
                        onRemove={musicPlayer.removeFromQueue}
                        onClear={musicPlayer.clearQueue}
                    />
                </aside>
            </div>
        </main>
    );
};

export default MusicStreaming;
