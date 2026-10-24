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
        find: () => ({ toArray: async () => documents }),
        findOne: async (filter: Doc) =>
            documents.find((document) => matches(document, filter)) ?? null,
        insertOne: async (document: Doc) => {
            const stored = { _id: new ObjectId(), ...document };
            documents.push(stored);
            return { insertedId: stored._id };
        },
        updateOne: async (filter: Doc, update: { $set: Doc }) => {
            const found = documents.find((document) =>
                matches(document, filter),
            );
            if (found) Object.assign(found, update.$set);
            const count = found ? 1 : 0;
            return {
                matchedCount: count,
                modifiedCount: count,
                upsertedId: null,
            };
        },
    };
}

export const fakeDb = {
    getCollection: async (name: string) => collection(name),
    mongoUri: () => "mongodb://fake",
};
