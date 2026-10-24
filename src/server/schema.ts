import { HttpError } from "./http";
import { formatRustDate, normalizeRustDate } from "./rustDate";
import { serializeValue, toObjectId } from "./serialization";

type FieldType =
    | "string"
    | "i32"
    | "bool"
    | "oid"
    | "date"
    | "strings"
    | "bson"
    | { enum: string[] };

interface Field {
    type: FieldType;
    required?: boolean;
}

/** Key order mirrors the Rust struct field order. */
export type Schema = Record<string, Field>;

type Source = "json" | "bson";

const INVALID = Symbol("invalid");

function isI32(value: unknown): boolean {
    return (
        Number.isInteger(value) &&
        (value as number) >= -2_147_483_648 &&
        (value as number) <= 2_147_483_647
    );
}

function decodeDate(value: unknown, source: Source): unknown {
    // Documents written by an earlier version of this port hold BSON dates.
    if (source === "bson" && value instanceof Date)
        return formatRustDate(value);
    if (typeof value !== "string") return INVALID;
    if (value === "") return null;
    return normalizeRustDate(value) ?? INVALID;
}

function decodeBson(value: unknown): unknown {
    const isOid =
        typeof value === "object" && value !== null && "$oid" in value;
    return isOid ? (toObjectId(value) ?? INVALID) : value;
}

function decodeValue(type: FieldType, value: unknown, source: Source) {
    switch (type) {
        case "string":
            return typeof value === "string" ? value : INVALID;
        case "i32":
            return isI32(value) ? value : INVALID;
        case "bool":
            return typeof value === "boolean" ? value : INVALID;
        case "strings":
            return Array.isArray(value) &&
                value.every((entry) => typeof entry === "string")
                ? value
                : INVALID;
        case "oid":
            return toObjectId(value) ?? INVALID;
        case "date":
            return decodeDate(value, source);
        case "bson":
            return source === "json" ? decodeBson(value) : value;
        default:
            return typeof value === "string" && type.enum.includes(value)
                ? value
                : INVALID;
    }
}

/**
 * serde-style decode: unknown keys are dropped, missing optional fields
 * become null and `_id` is skipped when absent. Returns null when invalid.
 */
function decode(input: unknown, schema: Schema, source: Source) {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
        return null;
    }
    const record = input as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    for (const [name, field] of Object.entries(schema)) {
        const raw = record[name];
        const value =
            raw === undefined || raw === null
                ? null
                : decodeValue(field.type, raw, source);
        if (value === INVALID || (value === null && field.required))
            return null;
        if (name === "_id" && value === null) continue;
        result[name] = value;
    }
    return result;
}

export type Model = Record<string, unknown>;

/** Request body decode; Rocket answers 422 when the body does not fit. */
export function fromJson(body: unknown, schema: Schema): Model {
    const model = decode(body, schema, "json");
    if (!model) throw new HttpError(422);
    return model;
}

/** Mongo document decode; null when the Rust driver would fail to read it. */
export function fromStorage(document: unknown, schema: Schema): Model | null {
    return decode(document, schema, "bson");
}

export function toResponse(model: Model): unknown {
    return serializeValue(model);
}
