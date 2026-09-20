import { getCollection } from "./db";
import { COLLECTIONS, withoutId } from "./documents";
import {
    HttpError,
    insertOneResult,
    requireObjectId,
    updateResult,
} from "./http";

export async function getConfigValue(key: string): Promise<string> {
    const collection = await getCollection(COLLECTIONS.config);
    const configs = await collection.find({}).toArray();
    const match = configs.find((config) => config.key === key);
    if (!match) throw new HttpError(404);
    return match.value as string;
}

export async function insertConfig(
    body: Record<string, unknown>,
): Promise<unknown> {
    const collection = await getCollection(COLLECTIONS.config);
    try {
        const result = await collection.insertOne(withoutId(body));
        return insertOneResult(result);
    } catch {
        throw new HttpError(400);
    }
}

export async function updateConfig(
    id: string,
    body: Record<string, unknown>,
): Promise<unknown> {
    const objectId = requireObjectId(id, 400);
    const document = withoutId(body);
    delete document._id;
    const collection = await getCollection(COLLECTIONS.config);
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
