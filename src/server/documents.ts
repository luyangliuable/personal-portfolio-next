import { parseDate, toObjectId } from "./serialization";

export const COLLECTIONS = {
    post: "Post",
    user: "User",
    localImage: "LocalImage",
    message: "Message",
    note: "Note",
    config: "Config",
} as const;

export interface NormalizeOptions {
    dateFields?: string[];
    oidFields?: string[];
}

/**
 * Converts an incoming JSON body into a Mongo document, matching the Rust
 * serde behaviour: dates decode from RFC3339 strings, ObjectIds from `$oid`.
 */
export function normalizeDocument(
    input: Record<string, unknown>,
    { dateFields = [], oidFields = [] }: NormalizeOptions = {},
): Record<string, unknown> {
    const document: Record<string, unknown> = { ...input };

    for (const field of dateFields) {
        if (field in document) document[field] = parseDate(document[field]);
    }

    for (const field of oidFields) {
        if (field in document) {
            document[field] = toObjectId(document[field]) ?? null;
        }
    }

    return document;
}

/** Rust `create` skips `_id` when absent; Mongo generates one. */
export function withoutId(
    input: Record<string, unknown>,
): Record<string, unknown> {
    const document = { ...input };
    if (document._id === null || document._id === undefined) {
        delete document._id;
    }
    return document;
}
