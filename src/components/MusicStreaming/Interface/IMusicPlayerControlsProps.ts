import type { SpotdlSearchResult } from "@/lib/spotdl";

export interface IMusicPlayerControlsProps {
    currentSong: SpotdlSearchResult | null;
    isPlaying: boolean;
    currentTime: number;
    duration: number;
    volume: number;
    onPlayPause: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
    onNext: () => void;
    onPrevious: () => void;
}
