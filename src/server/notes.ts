import { getCollection } from "./db";
import { COLLECTIONS } from "./documents";
import { HttpError, insertOneResult, requireObjectId } from "./http";
import { readNoteBody } from "./markdown";
import { NOTE } from "./models";
import { fromJson, fromStorage, toResponse, type Model } from "./schema";
import { rustDateNow } from "./rustDate";

export async function getNotes(): Promise<unknown[]> {
    const collection = await getCollection(COLLECTIONS.note);
    const documents = await collection.find({}).toArray();
    return documents
        .map((document) => fromStorage(document, NOTE))
        .filter((note): note is Model => note !== null && note.active !== false)
        .map(toResponse);
}

export async function insertNote(body: unknown): Promise<unknown> {
    const note = fromJson(body, NOTE);
    note.date_created = rustDateNow();
    const collection = await getCollection(COLLECTIONS.note);
    return insertOneResult(await collection.insertOne(note));
}

export async function getNote(id: string): Promise<unknown> {
    const objectId = requireObjectId(id, 400);
    const collection = await getCollection(COLLECTIONS.note);
    const note = fromStorage(await collection.findOne({ _id: objectId }), NOTE);
    if (!note) throw new HttpError(500);
    if (note.active === false) throw new HttpError(404);

    try {
        note.body = await readNoteBody(note);
    } catch {
        throw new HttpError(404);
    }

    return toResponse(note);
}
