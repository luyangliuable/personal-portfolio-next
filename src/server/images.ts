import { memoryCache } from "./cache";
import { getCollection } from "./db";
import { COLLECTIONS, updateById } from "./documents";
import { HttpError, insertOneResult, requireObjectId } from "./http";
import {
    compressImage,
    contentTypeFor,
    imageStoreLocation,
    readImageFile,
} from "./image";
import { LOCAL_IMAGE } from "./models";
import { fromJson, fromStorage, toResponse, type Model } from "./schema";
import { rustDateNow } from "./rustDate";

interface ImagePayload {
    contentType: string;
    buffer: Buffer;
}

export async function getImages(): Promise<unknown[]> {
    const collection = await getCollection(COLLECTIONS.localImage);
    const documents = await collection.find({}).toArray();
    return documents
        .map((document) => fromStorage(document, LOCAL_IMAGE))
        .filter((image): image is Model => image !== null)
        .map(toResponse);
}

export async function insertImage(body: unknown): Promise<unknown> {
    const image = fromJson(body, LOCAL_IMAGE);
    image.date_created = rustDateNow();
    const collection = await getCollection(COLLECTIONS.localImage);
    return insertOneResult(await collection.insertOne(image));
}

export async function updateImage(id: string, body: unknown): Promise<unknown> {
    const image = fromJson(body, LOCAL_IMAGE);
    image.date_last_modified = rustDateNow();
    return updateById(COLLECTIONS.localImage, id, image);
}

async function findImage(id: string): Promise<Model> {
    const objectId = requireObjectId(id, 500);
    const collection = await getCollection(COLLECTIONS.localImage);
    const document = await collection.findOne({ _id: objectId });
    if (!document) throw new HttpError(404);
    const image = fromStorage(document, LOCAL_IMAGE);
    if (!image) throw new HttpError(500);
    return image;
}

/** LocalImageController::get, caching the mime type alongside the bytes. */
export async function getImage(
    id: string,
    compression: number,
): Promise<ImagePayload> {
    const key = `${id}_${compression}`;
    const cached = memoryCache.get<ImagePayload>(key);
    if (cached !== undefined) return cached;

    const image = await findImage(id);
    const imageType = image.image_type as string;
    const root = imageStoreLocation();
    if (root === null) throw new HttpError(404);

    let file: Buffer;
    try {
        file = await readImageFile(root, imageType, image.file_name as string);
    } catch {
        throw new HttpError(500);
    }

    const contentType = contentTypeFor(imageType);
    if (!contentType) throw new HttpError(415);

    let buffer = file;
    if (imageType !== "gif" && imageType !== "pdf") {
        try {
            buffer = await compressImage(file, imageType, compression);
        } catch {
            throw new HttpError(500);
        }
    }

    const payload = { contentType, buffer };
    memoryCache.set(key, payload);
    return payload;
}
