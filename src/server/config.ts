import { getCollection } from "./db";
import { COLLECTIONS, updateById } from "./documents";
import { HttpError, insertOneResult } from "./http";
import { CONFIG } from "./models";
import { fromJson, fromStorage } from "./schema";

export async function getConfigValue(key: string): Promise<string> {
    const collection = await getCollection(COLLECTIONS.config);
    const documents = await collection.find({}).toArray();
    const match = documents
        .map((document) => fromStorage(document, CONFIG))
        .find((config) => config?.key === key);
    if (!match) throw new HttpError(404);
    return match.value as string;
}

export async function insertConfig(body: unknown): Promise<unknown> {
    const config = fromJson(body, CONFIG);
    const collection = await getCollection(COLLECTIONS.config);
    return insertOneResult(await collection.insertOne(config));
}

export async function updateConfig(
    id: string,
    body: unknown,
): Promise<unknown> {
    return updateById(COLLECTIONS.config, id, fromJson(body, CONFIG));
}
