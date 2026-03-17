"use client";

import React, { useState } from "react";
import Button from "../../Button/Button";
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
        setQuery(e.target.value);
    };

    return (
        <form onSubmit={handleSubmit} className="music-search-bar">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                className="music-search-input"
                aria-label="Search for music"
            />
            <Button
                type="submit"
                disabled={loading || !query.trim()}
                loading={loading}
            >
                {loading ? "Searching..." : "Search"}
            </Button>
        </form>
    );
};

export default MusicSearchBar;
