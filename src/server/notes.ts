import { getCollection } from "./db";
import { COLLECTIONS, normalizeDocument, withoutId } from "./documents";
import { HttpError, insertOneResult, requireObjectId } from "./http";
import { readNoteBody } from "./markdown";
import { serializeDocument, serializeDocuments } from "./serialization";

const DATE_FIELDS = ["date_created", "date_last_modified"];
const OID_FIELDS = ["_id", "image"];

export async function getNotes(): Promise<unknown[]> {
    const collection = await getCollection(COLLECTIONS.note);
    const notes = await collection.find({}).toArray();
    return serializeDocuments(notes.filter((note) => note.active !== false));
}

export async function insertNote(
    body: Record<string, unknown>,
): Promise<unknown> {
    const document = withoutId(
        normalizeDocument(body, {
            dateFields: DATE_FIELDS,
            oidFields: OID_FIELDS,
        }),
    );
    document.date_created = new Date();
    const collection = await getCollection(COLLECTIONS.note);
    try {
        const result = await collection.insertOne(document);
        return insertOneResult(result);
    } catch {
        throw new HttpError(400);
    }
}

export async function getNote(id: string): Promise<unknown> {
    const objectId = requireObjectId(id, 400);
    const collection = await getCollection(COLLECTIONS.note);
    const note = await collection.findOne({ _id: objectId });
    if (!note) throw new HttpError(500);
    if (note.active === false) throw new HttpError(404);

    try {
        note.body = await readNoteBody(note);
    } catch {
        throw new HttpError(404);
    }

    return serializeDocument(note);
}
