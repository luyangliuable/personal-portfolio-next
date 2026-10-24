import { readFile } from "node:fs/promises";

export function markdownStoreLocation(): string | null {
    return process.env.MARKDOWN_POSTS_STORE_LOCATION ?? null;
}

export function notesStoreLocation(): string | null {
    return process.env.NOTES_STORE_LOCATION ?? null;
}

function requireLocation(location: string | null, name: string): string {
    if (location === null) throw new Error(`No ${name} store location found`);
    return location;
}

/** {MARKDOWN_POSTS_STORE_LOCATION}/{year}/{month}/{file_name}.md */
export async function readPostBody(
    post: Record<string, unknown>,
): Promise<string> {
    const root = requireLocation(markdownStoreLocation(), "markdown");
    return readFile(
        `${root}/${post.year}/${post.month}/${post.file_name}.md`,
        "utf8",
    );
}

/** {NOTES_STORE_LOCATION}/{file_path} */
export async function readNoteBody(
    note: Record<string, unknown>,
): Promise<string> {
    const root = requireLocation(notesStoreLocation(), "notes");
    return readFile(`${root}/${note.file_path}`, "utf8");
}
