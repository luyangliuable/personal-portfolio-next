import { memoryCache } from "./cache";
import { getCollection } from "./db";
import { COLLECTIONS, normalizeDocument, withoutId } from "./documents";
import {
    HttpError,
    insertOneResult,
    requireObjectId,
    updateResult,
} from "./http";
import { compressImage, contentTypeFor, readImageFile } from "./image";
import { serializeDocument, serializeDocuments } from "./serialization";

const DATE_FIELDS = ["date_created", "date_last_modified"];
const OID_FIELDS = ["_id"];

export async function getImages(): Promise<unknown[]> {
    const collection = await getCollection(COLLECTIONS.localImage);
    const images = await collection.find({}).toArray();
    return serializeDocuments(images);
}

export async function insertImage(
    body: Record<string, unknown>,
): Promise<unknown> {
    const document = withoutId(
        normalizeDocument(body, {
            dateFields: DATE_FIELDS,
            oidFields: OID_FIELDS,
        }),
    );
    document.date_created = new Date();
    const collection = await getCollection(COLLECTIONS.localImage);
    try {
        const result = await collection.insertOne(document);
        return insertOneResult(result);
    } catch {
        throw new HttpError(400);
    }
}

export async function getImage(
    id: string,
    compression: number,
): Promise<{ contentType: string; buffer: Buffer }> {
    const key = `${id}_${compression}`;
    const cached = memoryCache.get<Buffer>(key);
    // The Rust controller always reports JPEG on a cache hit, even for PNG.
    if (cached !== undefined)
        return { contentType: "image/jpeg", buffer: cached };

    const objectId = requireObjectId(id, 500);
    const collection = await getCollection(COLLECTIONS.localImage);
    const image = await collection.findOne({ _id: objectId });
    if (!image) throw new HttpError(404);

    let file: Buffer;
    try {
        file = await readImageFile(
            image.image_type as string,
            image.file_name as string,
        );
    } catch {
        throw new HttpError(500);
    }

    const contentType = contentTypeFor(image.image_type as string);
    if (!contentType) throw new HttpError(415);

    if (image.image_type === "gif" || image.image_type === "pdf") {
        memoryCache.set(key, file);
        return { contentType, buffer: file };
    }

    let compressed: Buffer;
    try {
        compressed = await compressImage(
            file,
            image.image_type as string,
            compression,
        );
    } catch {
        throw new HttpError(500);
    }

    memoryCache.set(key, compressed);
    return { contentType, buffer: compressed };
}

export async function updateImage(
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
    const collection = await getCollection(COLLECTIONS.localImage);
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
