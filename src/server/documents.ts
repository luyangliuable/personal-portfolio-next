import { getCollection } from "./db";
import { HttpError, requireObjectId, updateResult } from "./http";
import type { Model } from "./schema";

export const COLLECTIONS = {
    post: "Post",
    user: "User",
    localImage: "LocalImage",
    message: "Message",
    note: "Note",
    config: "Config",
} as const;

/**
 * MongoRepo::update: `$set` the whole decoded struct (nulls included) with
 * upsert. Invalid ids and driver errors both surface as 400.
 */
export async function updateById(
    collectionName: string,
    id: string,
    document: Model,
): Promise<unknown> {
    const objectId = requireObjectId(id, 400);
    const collection = await getCollection(collectionName);
    try {
        const result = await collection.updateOne(
            { _id: objectId },
            { $set: document },
            { upsert: true },
        );
        return updateResult(result);
    } catch {
        throw new HttpError(400);
    }
}
