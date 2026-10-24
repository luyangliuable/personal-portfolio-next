import { MongoClient, type Db } from "mongodb";

export const RUST_DB_NAME = "rustDB";

const DEFAULT_MONGO_URI = "mongodb://localhost:27017";

/**
 * The Rust service connects with MONGOURI (default localhost). MONGODB_URI is
 * kept as a fallback for setups that only configure the Next.js variable.
 */
export function mongoUri(): string {
    return process.env.MONGOURI ?? process.env.MONGODB_URI ?? DEFAULT_MONGO_URI;
}

const globalForMongo = globalThis as typeof globalThis & {
    _rustMongoClient?: Promise<MongoClient>;
};

function clientPromise(): Promise<MongoClient> {
    globalForMongo._rustMongoClient ??= new MongoClient(mongoUri()).connect();
    return globalForMongo._rustMongoClient;
}

export async function getDb(): Promise<Db> {
    const client = await clientPromise();
    return client.db(RUST_DB_NAME);
}

export async function getCollection(name: string) {
    const db = await getDb();
    return db.collection(name);
}
