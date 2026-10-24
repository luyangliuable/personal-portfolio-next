import { ObjectId } from "mongodb";
import type { InsertOneResult, UpdateResult } from "mongodb";
import { isHexObjectId, serializeValue } from "./serialization";

export class HttpError extends Error {
    status: number;

    constructor(status: number, message?: string) {
        super(message ?? `Request failed with status ${status}`);
        this.status = status;
    }
}

/** Rust controllers use `expect` on invalid ids for images and 400 for posts. */
export function requireObjectId(
    id: string,
    invalidStatus: 400 | 500 = 400,
): ObjectId {
    if (!isHexObjectId(id)) {
        throw new HttpError(invalidStatus, `Invalid ObjectId: ${id}`);
    }
    return new ObjectId(id);
}

/** mongodb 2.5 result structs serialize with `rename_all = "camelCase"`. */
export function insertOneResult(result: InsertOneResult): unknown {
    return { insertedId: serializeValue(result.insertedId) };
}

export function updateResult(result: UpdateResult): unknown {
    return {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        upsertedId: serializeValue(result.upsertedId ?? null),
    };
}
