import type { SpotdlSearchResult } from "../../../lib/spotdl";

export interface IMusicSearchResultItemProps {
    song: SpotdlSearchResult;
    onPlay: (song: SpotdlSearchResult) => void;
    onAddToQueue: (song: SpotdlSearchResult) => void;
}
