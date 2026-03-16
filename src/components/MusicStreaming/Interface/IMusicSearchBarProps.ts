export interface IMusicSearchBarProps {
    onSearch: (query: string) => void;
    loading?: boolean;
    placeholder?: string;
}
