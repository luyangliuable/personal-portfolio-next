import type { SpotdlSearchResult } from "@/lib/spotdl";

export interface IMusicQueueItemProps {
    song: SpotdlSearchResult;
    index: number;
    isPlaying: boolean;
    onRemove: (index: number) => void;
}
