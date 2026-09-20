import { memoryCache } from "./cache";
import { getCollection } from "./db";
import { COLLECTIONS, normalizeDocument, withoutId } from "./documents";
import {
    HttpError,
    insertOneResult,
    requireObjectId,
    updateResult,
} from "./http";
import { readPostBody } from "./markdown";
import { serializeDocument, serializeDocuments } from "./serialization";

const DATE_FIELDS = ["date_created", "date_last_modified"];
const OID_FIELDS = ["_id", "image"];

export async function getPosts(): Promise<unknown[]> {
    const collection = await getCollection(COLLECTIONS.post);
    const posts = await collection.find({}).toArray();
    return serializeDocuments(posts.filter((post) => post.active !== false));
}

export async function insertPost(
    body: Record<string, unknown>,
): Promise<unknown> {
    const document = withoutId(
        normalizeDocument(body, {
            dateFields: DATE_FIELDS,
            oidFields: OID_FIELDS,
        }),
    );
    document.date_created = new Date();
    const collection = await getCollection(COLLECTIONS.post);
    try {
        const result = await collection.insertOne(document);
        return insertOneResult(result);
    } catch {
        throw new HttpError(400);
    }
}

export async function getPost(id: string): Promise<unknown> {
    const cached = memoryCache.get(id);
    if (cached !== undefined) return cached;

    const objectId = requireObjectId(id, 400);
    const collection = await getCollection(COLLECTIONS.post);
    const post = await collection.findOne({ _id: objectId });
    if (!post) throw new HttpError(500);
    if (post.active === false) throw new HttpError(404);

    try {
        post.body = await readPostBody(post);
    } catch {
        throw new HttpError(404);
    }

    const serialized = serializeDocument(post);
    memoryCache.set(id, serialized);
    return serialized;
}

export async function updatePost(
    id: string,
    body: Record<string, unknown>,
): Promise<unknown> {
    const objectId = requireObjectId(id, 400);
    const document = normalizeDocument(body, {
        dateFields: DATE_FIELDS,
        oidFields: OID_FIELDS,
    });
    delete document._id;
    document.date_last_modified = new Date();
    const collection = await getCollection(COLLECTIONS.post);
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
