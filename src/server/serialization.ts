import { ObjectId } from "mongodb";
import { formatRustDate } from "./rustDate";

/** bson's `ObjectId::parse_str` only accepts 24 hex characters. */
export function isHexObjectId(value: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(value);
}

export function toObjectId(value: unknown): ObjectId | null {
    if (value instanceof ObjectId) return value;
    if (typeof value === "string" && isHexObjectId(value)) {
        return new ObjectId(value);
    }
    if (
        value &&
        typeof value === "object" &&
        "$oid" in (value as Record<string, unknown>)
    ) {
        const oid = (value as { $oid?: unknown }).$oid;
        if (typeof oid === "string" && isHexObjectId(oid)) {
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
    if (value instanceof Date) return formatRustDate(value);
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
