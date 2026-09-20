import { ObjectId } from "mongodb";
import type { InsertOneResult, UpdateResult } from "mongodb";

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
    if (!ObjectId.isValid(id)) {
        throw new HttpError(invalidStatus, `Invalid ObjectId: ${id}`);
    }
    return new ObjectId(id);
}

export function objectIdOrNull(id: string): ObjectId | null {
    return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export function insertOneResult(result: InsertOneResult): unknown {
    return { inserted_id: { $oid: String(result.insertedId) } };
}

export function updateResult(result: UpdateResult): unknown {
    return {
        matched_count: result.matchedCount,
        modified_count: result.modifiedCount,
        upserted_id: result.upsertedId
            ? { $oid: String(result.upsertedId) }
            : null,
    };
}
