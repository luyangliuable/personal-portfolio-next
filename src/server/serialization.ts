import { ObjectId } from "mongodb";

/** Serializes a Date the way the Rust service does: %Y-%m-%dT%H:%M:%S%.fZ */
export function formatDate(date: Date): string {
    return date.toISOString();
}

export function parseDate(value: unknown): Date | null {
    if (value instanceof Date) return value;
    if (typeof value !== "string" || value.length === 0) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function toObjectId(value: unknown): ObjectId | null {
    if (value instanceof ObjectId) return value;
    if (typeof value === "string" && ObjectId.isValid(value)) {
        return new ObjectId(value);
    }
    if (
        value &&
        typeof value === "object" &&
        "$oid" in (value as Record<string, unknown>)
    ) {
        const oid = (value as { $oid?: unknown }).$oid;
        if (typeof oid === "string" && ObjectId.isValid(oid)) {
            return new ObjectId(oid);
        }
    }
    return null;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        !(value instanceof Date) &&
        !(value instanceof ObjectId)
    );
}

/** Recursively converts BSON values to the JSON shape the Rust API returns. */
export function serializeValue(value: unknown): unknown {
    if (value instanceof ObjectId) return { $oid: value.toHexString() };
    if (value instanceof Date) return formatDate(value);
    if (Array.isArray(value)) return value.map(serializeValue);
    if (isPlainObject(value)) {
        const result: Record<string, unknown> = {};
        for (const [key, entry] of Object.entries(value)) {
            result[key] = serializeValue(entry);
        }
        return result;
    }
    return value ?? null;
}

export function serializeDocument<T>(document: T): unknown {
    return serializeValue(document);
}

export function serializeDocuments<T>(documents: T[]): unknown[] {
    return documents.map(serializeValue);
}
