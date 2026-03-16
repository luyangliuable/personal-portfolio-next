import type { SpotdlSearchResult } from "../../../lib/spotdl";

export interface IMusicStreamingState {
    searchQuery: string;
    searchResults: SpotdlSearchResult[];
    currentSong: SpotdlSearchResult | null;
    queue: SpotdlSearchResult[];
    isPlaying: boolean;
    loading: boolean;
    error: string | null;
}
