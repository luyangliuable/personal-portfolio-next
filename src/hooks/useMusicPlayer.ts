import { useState, useRef, useCallback, useEffect } from "react";
import type { SpotdlSearchResult } from "@/lib/spotdl";

export interface MusicPlayerState {
    currentSong: SpotdlSearchResult | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    queue: SpotdlSearchResult[];
    currentIndex: number;
}

export function useMusicPlayer() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [state, setState] = useState<MusicPlayerState>({
        currentSong: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.7,
        queue: [],
        currentIndex: -1,
    });

    // Initialize audio element
    useEffect(() => {
        if (typeof window !== "undefined") {
            audioRef.current = new Audio();
            audioRef.current.volume = state.volume;

            // Event listeners
            const handleTimeUpdate = () => {
                if (audioRef.current) {
                    setState((prev) => ({
                        ...prev,
                        currentTime: audioRef.current!.currentTime,
                    }));
                }
            };

            const handleDurationChange = () => {
                if (audioRef.current) {
                    setState((prev) => ({
                        ...prev,
                        duration: audioRef.current!.duration,
                    }));
                }
            };

            const handleEnded = () => {
                playNext();
            };

            audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
            audioRef.current.addEventListener(
                "durationchange",
                handleDurationChange,
            );
            audioRef.current.addEventListener("ended", handleEnded);

            return () => {
                if (audioRef.current) {
                    audioRef.current.removeEventListener(
                        "timeupdate",
                        handleTimeUpdate,
                    );
                    audioRef.current.removeEventListener(
                        "durationchange",
                        handleDurationChange,
                    );
                    audioRef.current.removeEventListener("ended", handleEnded);
                    audioRef.current.pause();
                }
            };
        }
    }, []);

    const play = useCallback((song: SpotdlSearchResult) => {
        if (audioRef.current) {
            audioRef.current.src = `/api/music/stream/${song.id}`;
            audioRef.current.play();
            setState((prev) => ({
                ...prev,
                currentSong: song,
                isPlaying: true,
            }));
        }
    }, []);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setState((prev) => ({ ...prev, isPlaying: false }));
        }
    }, []);

    const resume = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.play();
            setState((prev) => ({ ...prev, isPlaying: true }));
        }
    }, []);

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setState((prev) => ({ ...prev, currentTime: time }));
        }
    }, []);

    const setVolume = useCallback((volume: number) => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            setState((prev) => ({ ...prev, volume }));
        }
    }, []);

    const addToQueue = useCallback((song: SpotdlSearchResult) => {
        setState((prev) => ({
            ...prev,
            queue: [...prev.queue, song],
        }));
    }, []);

    const playNext = useCallback(() => {
        setState((prev) => {
            const nextIndex = prev.currentIndex + 1;
            if (nextIndex < prev.queue.length) {
                const nextSong = prev.queue[nextIndex]!;
                play(nextSong);
                return { ...prev, currentIndex: nextIndex };
            }
            return prev;
        });
    }, [play]);

    const playPrevious = useCallback(() => {
        setState((prev) => {
            const prevIndex = prev.currentIndex - 1;
            if (prevIndex >= 0) {
                const prevSong = prev.queue[prevIndex]!;
                play(prevSong);
                return { ...prev, currentIndex: prevIndex };
            }
            return prev;
        });
    }, [play]);

    const removeFromQueue = useCallback((index: number) => {
        setState((prev) => ({
            ...prev,
            queue: prev.queue.filter((_, i) => i !== index),
        }));
    }, []);

    const clearQueue = useCallback(() => {
        setState((prev) => ({ ...prev, queue: [], currentIndex: -1 }));
    }, []);

    return {
        ...state,
        play,
        pause,
        resume,
        seek,
        setVolume,
        addToQueue,
        playNext,
        playPrevious,
        removeFromQueue,
        clearQueue,
    };
}
