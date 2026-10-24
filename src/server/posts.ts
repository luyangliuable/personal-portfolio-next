import { memoryCache } from "./cache";
import { getCollection } from "./db";
import { COLLECTIONS, updateById } from "./documents";
import { HttpError, insertOneResult, requireObjectId } from "./http";
import { readPostBody } from "./markdown";
import { POST } from "./models";
import { fromJson, fromStorage, toResponse, type Model } from "./schema";
import { rustDateNow } from "./rustDate";

export async function getPosts(): Promise<unknown[]> {
    const collection = await getCollection(COLLECTIONS.post);
    const documents = await collection.find({}).toArray();
    return documents
        .map((document) => fromStorage(document, POST))
        .filter((post): post is Model => post !== null && post.active !== false)
        .map(toResponse);
}

export async function insertPost(body: unknown): Promise<unknown> {
    const post = fromJson(body, POST);
    post.date_created = rustDateNow();
    const collection = await getCollection(COLLECTIONS.post);
    return insertOneResult(await collection.insertOne(post));
}

export async function getPost(id: string): Promise<unknown> {
    const cached = memoryCache.get(id);
    if (cached !== undefined) return cached;

    const objectId = requireObjectId(id, 400);
    const collection = await getCollection(COLLECTIONS.post);
    const post = fromStorage(await collection.findOne({ _id: objectId }), POST);
    if (!post) throw new HttpError(500);
    if (post.active === false) throw new HttpError(404);

    try {
        post.body = await readPostBody(post);
    } catch {
        throw new HttpError(404);
    }

    const serialized = toResponse(post);
    memoryCache.set(id, serialized);
    return serialized;
}

export async function updatePost(id: string, body: unknown): Promise<unknown> {
    const post = fromJson(body, POST);
    post.date_last_modified = rustDateNow();
    return updateById(COLLECTIONS.post, id, post);
}
