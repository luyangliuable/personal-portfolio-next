import { useState, useCallback, useEffect, useRef } from "react";
import type { SpotdlSearchResult } from "@/lib/spotdl";

export interface MusicSearchState {
    query: string;
    results: SpotdlSearchResult[];
    loading: boolean;
    error: string | null;
}

export function useMusicSearch(debounceMs: number = 500) {
    const [state, setState] = useState<MusicSearchState>({
        query: "",
        results: [],
        loading: false,
        error: null,
    });

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Perform the actual search
    const performSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setState((prev) => ({ ...prev, results: [], loading: false }));
            return;
        }

        setState((prev) => ({ ...prev, loading: true, error: null }));

        try {
            const response = await fetch("/api/music/search", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) {
                throw new Error("Failed to search for music");
            }

            const data = await response.json();

            setState((prev) => ({
                ...prev,
                results: data.results || [],
                loading: false,
            }));
        } catch (error: any) {
            setState((prev) => ({
                ...prev,
                error: error.message,
                loading: false,
            }));
        }
    }, []);

    // Debounced search
    const search = useCallback(
        (query: string) => {
            setState((prev) => ({ ...prev, query }));

            // Clear existing timeout
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            // Set new timeout
            timeoutRef.current = setTimeout(() => {
                performSearch(query);
            }, debounceMs);
        },
        [debounceMs, performSearch],
    );

    // Cleanup
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const clearSearch = useCallback(() => {
        setState({
            query: "",
            results: [],
            loading: false,
            error: null,
        });
    }, []);

    return {
        ...state,
        search,
        clearSearch,
    };
}
