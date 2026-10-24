import { ObjectId } from "mongodb";

type Doc = Record<string, unknown>;

export const fakeStore = new Map<string, Doc[]>();

function matches(document: Doc, filter: Doc): boolean {
    return Object.entries(filter).every(([key, value]) =>
        value instanceof ObjectId
            ? value.equals(document[key] as ObjectId)
            : document[key] === value,
    );
}

function collection(name: string) {
    if (!fakeStore.has(name)) fakeStore.set(name, []);
    const documents = fakeStore.get(name)!;

    return {
        find: () => ({ toArray: () => Promise.resolve(documents) }),
        findOne: (filter: Doc) =>
            Promise.resolve(
                documents.find((document) => matches(document, filter)) ?? null,
            ),
        insertOne: (document: Doc) => {
            const stored = { _id: new ObjectId(), ...document };
            documents.push(stored);
            return Promise.resolve({ insertedId: stored._id });
        },
        updateOne: (filter: Doc, update: { $set: Doc }) => {
            const found = documents.find((document) =>
                matches(document, filter),
            );
            if (found) Object.assign(found, update.$set);
            const count = found ? 1 : 0;
            return Promise.resolve({
                matchedCount: count,
                modifiedCount: count,
                upsertedId: null,
            });
        },
    };
}

export const fakeDb = {
    getCollection: (name: string) => Promise.resolve(collection(name)),
    mongoUri: () => "mongodb://fake",
};
