import type { SpotdlSearchResult } from "@/lib/spotdl";

export interface IMusicQueueProps {
    queue: SpotdlSearchResult[];
    currentIndex: number;
    onRemove: (index: number) => void;
    onClear: () => void;
    onReorder?: (fromIndex: number, toIndex: number) => void;
}
