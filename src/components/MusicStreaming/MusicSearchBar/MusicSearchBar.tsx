"use client";

import React, { useState } from "react";
import type { IMusicSearchBarProps } from "../Interface/IMusicSearchBarProps";

const MusicSearchBar: React.FC<IMusicSearchBarProps> = ({
    onSearch,
    loading = false,
    placeholder = "Search for songs, artists, or albums...",
}) => {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);
    };

    return (
        <form onSubmit={handleSubmit} className="music-search-bar">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                className="music-search-input"
                disabled={loading}
                aria-label="Search for music"
            />
            <button
                type="submit"
                className="music-search-button"
                disabled={loading || !query.trim()}
                aria-label="Search"
            >
                {loading ? "Searching..." : "Search"}
            </button>
        </form>
    );
};

export default MusicSearchBar;
